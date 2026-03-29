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
    for (let i = 0; i < $headings.length; i++) {
      const item = $headings[i]
      const nextItem = $headings[i + 1]
      const itemTop = item.getBoundingClientRect().top
      const nextItemTop = nextItem ? nextItem.getBoundingClientRect().top : 10000

      if (itemTop <= 96 && nextItemTop > 96) {
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
    // 让浏览器首先尝试原生锚点导航
    // 如果浏览器支持CSS scroll-margin-top，这应该工作
    // 作为备用方案，如果CSS不工作，我们添加一个延迟的JS修复
    setTimeout(() => {
      const target = document.getElementById(slug)
      if (target) {
        // 检查目标是否在正确位置（考虑导航栏）
        const rect = target.getBoundingClientRect()
        const headerHeight = 64 // 导航栏高度
        const extraPadding = 32 // 额外间距
        
        // 如果标题被导航栏遮挡
        if (rect.top < headerHeight + extraPadding) {
          // 手动滚动到正确位置
          const targetPosition = target.offsetTop - headerHeight - extraPadding
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      }
    }, 100) // 给浏览器100ms时间来处理原生滚动
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
      >
        <span>{text}</span>
      </a>
    </li>
  )
}
