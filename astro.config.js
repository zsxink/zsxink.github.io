import { defineConfig } from 'astro/config'
import { remarkReadingTime } from './src/plugins/remarkReadingTime'
import { rehypeCodeBlock } from './src/plugins/rehypeCodeBlock'
import { rehypeTableBlock } from './src/plugins/rehypeTableBlock'
import { rehypeCodeHighlight } from './src/plugins/rehypeCodeHighlight'
import { rehypeImage } from './src/plugins/rehypeImage'
import { rehypeLink } from './src/plugins/rehypeLink'
import { rehypeHeading } from './src/plugins/rehypeHeading'
import remarkDirective from 'remark-directive'
import { remarkSpoiler } from './src/plugins/remarkSpoiler'
import { remarkEmbed } from './src/plugins/remarkEmbed'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import { site } from './src/config.json'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import swup from '@swup/astro'

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    swup({
      theme: false,
      animationClass: 'swup-transition-',
      containers: ['main'],
      morph: ['[component-export="Provider"]'],
      // 禁用 swup 的平滑滚动，使用自定义滚动脚本处理锚点偏移
      smoothScrolling: false,
      // 恢复默认的linkSelector，确保页面导航链接正常工作
      linkSelector: 'a[href]',
      // 通过ignoreVisit函数排除锚点链接
      ignoreVisit: (url, { el } = {}) => {
        // 忽略带有data-no-swup属性的链接
        if (el?.closest('[data-no-swup]')) return true
        // 忽略锚点链接（以#开头）
        if (url.startsWith('#')) return true
        return false
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkMath, remarkDirective, remarkEmbed, remarkSpoiler, remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeKatex,
      rehypeLink,
      rehypeImage,
      rehypeHeading,
      rehypeCodeBlock,
      rehypeCodeHighlight,
      rehypeTableBlock,
    ],
    remarkRehype: { footnoteLabel: '参考', footnoteBackLabel: '返回正文' },
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
})
