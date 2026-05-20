import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  // shortcuts: [
  //   ['wh-full', 'w-full h-full'],
  //   ['flex-col', 'flex flex-col'],
  //   ['f-c-c', 'flex justify-center items-center'],
  //   ['f-b-c', 'flex justify-between items-center'],
  //   ['absolute-lt', 'absolute left-0 top-0'],
  //   ['absolute-lb', 'absolute left-0 bottom-0'],
  //   ['absolute-rt', 'absolute right-0 top-0'],
  //   ['absolute-rb', 'absolute right-0 bottom-0'],
  //   ['absolute-center', 'absolute-lt f-c-c wh-full'],
  //   ['bg-img-cover', 'bg-no-repeat bg-center bg-cover'],
  //   ['bg-img-contain', 'bg-no-repeat bg-center bg-contain'],
  // ],
  theme: {
    container: {
      center: true,
      maxWidth: {
        // 'DEFAULT': '100%',
        // 'sm': '640px',
        // 'md': '768px',
        // 'lg': '1024px',
        // 'xl': '1260px',
        // '2xl': '1480px',
      },
      padding: {
        // 'DEFAULT': '20px',
        // 'sm': '15px',
        // 'md': '20px',
        // 'lg': '25px',
        // 'xl': '30px',
        // '2xl': '35px',
      },
    },
    colors: {
      theme: 'var(--theme-color)',
      // dark: 'var(--theme-dark-color)',
      // light: 'var(--theme-light-color)',
      // primary: 'var(--theme-primary-color)',
      // error: 'var(--theme-error-color)',
      // gray: 'var(--theme-gray)',
      // lightgray: 'var(--theme-lightgray)',
    },
    breakpoints: {
      // 'sm': '640px',
      // 'md': '919px',
      // 'lg': '1024px',
      // 'xl': '1260px',
      // '2xl': '1520px',
    },
  },
  transformers: [transformerDirectives()],
})
