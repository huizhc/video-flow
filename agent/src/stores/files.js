import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS } from '@/services/seed'
import { useSpaceStore } from './space'

const TEXT_EXT = ['txt', 'md', 'csv', 'json', 'log', 'yaml', 'yml', 'xml', 'html', 'js', 'ts', 'css', 'sql']

export const useFileStore = defineStore('files', () => {
  const nodes = persisted(KEYS.files, [])
  const spaceStore = useSpaceStore()

  const byId = (id) => nodes.value.find((n) => n.id === id) || null
  const childrenOf = (parentId) =>
    nodes.value
      .filter((n) => (n.parentId || null) === (parentId || null))
      .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name, 'zh') : a.type === 'folder' ? -1 : 1))

  const folders = computed(() => nodes.value.filter((n) => n.type === 'folder'))
  const files = computed(() => nodes.value.filter((n) => n.type === 'file'))
  const totalSize = computed(() => files.value.reduce((sum, f) => sum + (f.size || 0), 0))

  function breadcrumb(id) {
    const chain = []
    let cursor = byId(id)
    while (cursor) {
      chain.unshift(cursor)
      cursor = cursor.parentId ? byId(cursor.parentId) : null
    }
    return chain
  }

  function isDescendant(candidateId, targetId) {
    if (!targetId) return false
    let cursor = byId(targetId)
    while (cursor) {
      if (cursor.id === candidateId) return true
      cursor = cursor.parentId ? byId(cursor.parentId) : null
    }
    return false
  }

  function nameExists(parentId, name, excludeId = null) {
    return nodes.value.some(
      (n) => (n.parentId || null) === (parentId || null) && n.name === name && n.id !== excludeId
    )
  }

  function createFolder(parentId, name) {
    const folder = {
      id: uid('fd'),
      name,
      type: 'folder',
      parentId: parentId || null,
      size: 0,
      owner: spaceStore.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    nodes.value.push(folder)
    spaceStore.log('文件中心', '新建文件夹', name)
    return folder
  }

  function isTextFile(name) {
    return TEXT_EXT.includes(String(name).split('.').pop().toLowerCase())
  }

  function readUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      if (isTextFile(file.name) && file.size <= 512 * 1024) {
        reader.onload = () => resolve({ content: String(reader.result), dataUrl: null })
        reader.readAsText(file)
      } else if (file.size <= 2 * 1024 * 1024) {
        reader.onload = () => resolve({ content: '', dataUrl: String(reader.result) })
        reader.readAsDataURL(file)
      } else {
        resolve({ content: '', dataUrl: null })
      }
    })
  }

  async function upload(parentId, fileList) {
    const created = []
    for (const file of fileList) {
      const { content, dataUrl } = await readUpload(file)
      let name = file.name
      let i = 1
      while (nameExists(parentId, name)) {
        const dot = file.name.lastIndexOf('.')
        name = dot > 0 ? `${file.name.slice(0, dot)}(${i})${file.name.slice(dot)}` : `${file.name}(${i})`
        i += 1
      }
      const node = {
        id: uid('fl'),
        name,
        type: 'file',
        parentId: parentId || null,
        ext: name.split('.').pop().toLowerCase(),
        size: file.size,
        owner: spaceStore.user.name,
        content,
        dataUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      nodes.value.push(node)
      created.push(node)
    }
    if (created.length) spaceStore.log('文件中心', '上传文件', created.map((n) => n.name).join('、'))
    return created
  }

  function rename(id, name) {
    const node = byId(id)
    if (!node) return
    const from = node.name
    node.name = name
    if (node.type === 'file') node.ext = name.split('.').pop().toLowerCase()
    node.updatedAt = new Date().toISOString()
    spaceStore.log('文件中心', '重命名', `${from} → ${name}`)
  }

  function move(ids, targetId) {
    const moved = []
    ids.forEach((id) => {
      const node = byId(id)
      if (!node || id === targetId) return
      if (node.type === 'folder' && isDescendant(id, targetId)) return
      node.parentId = targetId || null
      node.updatedAt = new Date().toISOString()
      moved.push(node.name)
    })
    if (moved.length) {
      const target = targetId ? byId(targetId)?.name : '根目录'
      spaceStore.log('文件中心', '移动', `${moved.join('、')} → ${target}`)
    }
    return moved.length
  }

  function remove(ids) {
    const removed = []
    const collect = (id) => {
      const node = byId(id)
      if (!node) return
      removed.push(node)
      if (node.type === 'folder') childrenOf(id).forEach((child) => collect(child.id))
    }
    ids.forEach(collect)
    const removedIds = removed.map((n) => n.id)
    nodes.value = nodes.value.filter((n) => !removedIds.includes(n.id))
    if (removed.length) spaceStore.log('文件中心', '删除', removed.map((n) => n.name).join('、'))
    return removed.length
  }

  return {
    nodes,
    folders,
    files,
    totalSize,
    byId,
    childrenOf,
    breadcrumb,
    isDescendant,
    isTextFile,
    nameExists,
    createFolder,
    upload,
    rename,
    move,
    remove
  }
})
