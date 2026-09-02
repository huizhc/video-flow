import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS } from '@/services/seed'
import { useSpaceStore } from './space'

function compare(op, left, right) {
  const ln = Number(left)
  const rn = Number(right)
  const numeric = !Number.isNaN(ln) && !Number.isNaN(rn) && String(left).trim() !== ''
  switch (op) {
    case 'eq':
      return String(left) === String(right)
    case 'ne':
      return String(left) !== String(right)
    case 'contains':
      return String(left).includes(String(right))
    case 'gt':
      return numeric && ln > rn
    case 'gte':
      return numeric && ln >= rn
    case 'lt':
      return numeric && ln < rn
    case 'lte':
      return numeric && ln <= rn
    default:
      return false
  }
}

export const useRuleStore = defineStore('rules', () => {
  const rules = persisted(KEYS.rules, [])
  const spaceStore = useSpaceStore()

  const sorted = computed(() => [...rules.value].sort((a, b) => a.priority - b.priority))
  const enabledCount = computed(() => rules.value.filter((r) => r.enabled).length)
  const byId = (id) => rules.value.find((r) => r.id === id) || null

  function normalizePriority() {
    sorted.value.forEach((rule, index) => {
      const target = rules.value.find((r) => r.id === rule.id)
      if (target) target.priority = index + 1
    })
  }

  function create(payload) {
    const rule = {
      id: uid('rul'),
      name: payload.name,
      group: payload.group,
      priority: rules.value.length + 1,
      enabled: payload.enabled !== false,
      description: payload.description || '',
      conditions: payload.conditions || [],
      actions: payload.actions || [],
      hits: 0,
      lastHitAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    rules.value.push(rule)
    normalizePriority()
    spaceStore.log('业务规则', '新建规则', rule.name)
    return rule
  }

  function update(id, patch) {
    const index = rules.value.findIndex((r) => r.id === id)
    if (index < 0) return
    rules.value[index] = { ...rules.value[index], ...patch, updatedAt: new Date().toISOString() }
    spaceStore.log('业务规则', '更新规则', rules.value[index].name)
  }

  function remove(id) {
    const target = byId(id)
    rules.value = rules.value.filter((r) => r.id !== id)
    normalizePriority()
    if (target) spaceStore.log('业务规则', '删除规则', target.name)
  }

  function toggle(id) {
    const rule = byId(id)
    if (!rule) return
    rule.enabled = !rule.enabled
    rule.updatedAt = new Date().toISOString()
    spaceStore.log('业务规则', rule.enabled ? '启用规则' : '停用规则', rule.name)
  }

  function movePriority(id, direction) {
    const list = sorted.value
    const index = list.findIndex((r) => r.id === id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (index < 0 || swapIndex < 0 || swapIndex >= list.length) return
    const a = rules.value.find((r) => r.id === list[index].id)
    const b = rules.value.find((r) => r.id === list[swapIndex].id)
    const tmp = a.priority
    a.priority = b.priority
    b.priority = tmp
    spaceStore.log('业务规则', '调整优先级', a.name)
  }

  function evaluate(sample) {
    return sorted.value
      .filter((rule) => rule.enabled)
      .map((rule) => {
        const results = rule.conditions.map((c) => ({
          condition: c,
          matched: compare(c.op, sample[c.field], c.value)
        }))
        const useOr = rule.conditions.some((c) => c.join === 'or')
        const matched = results.length
          ? useOr
            ? results.some((r) => r.matched)
            : results.every((r) => r.matched)
          : false
        return { rule, results, matched }
      })
  }

  function recordHit(id) {
    const rule = byId(id)
    if (!rule) return
    rule.hits += 1
    rule.lastHitAt = new Date().toISOString()
  }

  return { rules, sorted, enabledCount, byId, create, update, remove, toggle, movePriority, evaluate, recordHit }
})
