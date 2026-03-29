import { pageScrollLocationAtom, pageScrollDirectionAtom } from '@/store/scrollInfo'
import type { MarkdownHeading } from 'astro'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { startTransition, useEffect, useRef, useState } from 'react'

function useActiveItem() {
  const [activeItem, setActiveItem] = useState('')
  const scrollY = useAtomValue(pageScrollLocationAtom)

  useEffect(() => {
    const $article = document.querySelector('#markdown-wrapper')
    if (!$article) return
    const $headings = Array.from($article.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    
    // 如果没有找到标题，返回
    if ($headings.length === 0) return
    
    // 特殊情况：如果滚动位置在页面顶部，激活第一个标题
    if (scrollY < 100) {
      const firstHeading = $headings[0]
      if (firstHeading && firstHeading.id) {
        startTransition(() => {
          setActiveItem(firstHeading.id)
        })
        return
      }
    }
    
    // 正常计算激活项
    for (let i = 0; i < $headings.length; i++) {
      const item = $headings[i]
      const nextItem = $headings[i + 1]
      const itemTop = item.getBoundingClientRect().top
      const nextItemTop = nextItem ? nextItem.getBoundingClientRect().top : 10000

      // 使用更灵活的阈值：标题顶部在96px附近（考虑导航栏偏移）
      if (itemTop <= 120 && nextItemTop > 72) {
        startTransition(() => {
          setActiveItem(item.id)
        })
        break
      }
    }
  }, [scrollY])

  return activeItem
}

export function PostToc({ headings }: { headings: MarkdownHeading[] }) {
  const activeItem = useActiveItem()

  return (
    <ul
      className="relative overflow-y-auto space-y-2 group text-sm"
      style={{
        maxHeight: 'min(380px, calc(100vh - 250px))',
        scrollbarWidth: 'none',
      }}
    >
      {headings.map((item) => (
        <TocItem
          key={item.slug}
          slug={item.slug}
          text={item.text}
          depth={item.depth}
          isActive={item.slug === activeItem}
        />
      ))}
    </ul>
  )
}

export function TocItem({
  slug,
  text,
  depth,
  isActive,
}: {
  slug: string
  text: string
  depth: number
  isActive: boolean
}) {
  const itemRef = useRef<HTMLLIElement>(null)
  const scrollDirection = useAtomValue(pageScrollDirectionAtom)

  useEffect(() => {
    if (!isActive) return
    const $item = itemRef.current
    if (!$item) return
    const $container = $item.parentElement
    if (!$container) return

    const containerHeight = $container.clientHeight
    const itemHeight = $item.clientHeight
    const itemOffsetTop = $item.offsetTop
    const scrollTop = $container.scrollTop

    const itemTop = itemOffsetTop - scrollTop
    const itemBottom = itemTop + itemHeight

    if (itemTop < 0 || itemBottom > containerHeight) {
      if (scrollDirection === 'up') {
        $container.scrollTop = itemOffsetTop - containerHeight + itemHeight

      } else {
        $container.scrollTop = itemOffsetTop
      }
    }
  }, [isActive])

  const handleClick = () => {
    // SWUP滚动插件会处理锚点导航和滚动偏移
    // 我们只需要确保链接被正确点击，SWUP会接管其余工作
  }

  return (
    <li className="relative" ref={itemRef}>
      <span
        className={clsx(
          'absolute left-0 top-2 h-1 rounded-full',
          isActive ? 'bg-accent' : 'bg-zinc-300 dark:bg-zinc-700',
        )}
        style={{ width: `${4 * (7 - depth)}px` }}
      ></span>
      <a
        className={clsx(
          'inline-block pl-8 transition-colors duration-300',
          isActive
            ? 'font-bold text-accent'
            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
        )}
        href={`#${slug}`}
        onClick={handleClick}
        data-toc-link="true"
      >
        <span>{text}</span>
      </a>
    </li>
  )
}
