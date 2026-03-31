# Markdown章节锚点跳转偏移修复文档

## 问题描述

点击文章右侧TOC目录进行章节跳转时，存在位置偏差问题：

- 第一次点击跳转后标题位置偏下，上方有过多空白
- 第二次点击同一个链接时，标题顶部被固定导航栏完全遮挡
- 多次点击位置不稳定，没有一致性

## 根本原因分析

1. **滚动计算逻辑问题**：原代码在滚动过程中获取元素位置，动态变化的视口位置导致计算错误
2. **缺少滚动锁机制**：平滑滚动过程中重复点击会触发多次计算，位置叠加导致偏差
3. **双重标准偏移**：CSS和JavaScript没有统一的偏移设置，存在冲突

## 最终解决方案

采用**CSS + JavaScript双重保险方案**，确保所有场景下跳转位置准确：

### 1. CSS层面（基础保障）

在 `src/styles/markdown.css` 中为所有标题添加滚动偏移：

```css
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  scroll-margin-top: 72px;
}
```

- 即使JavaScript失效，浏览器默认锚点滚动也会自动偏移
- 支持浏览器前进后退、页面刷新等所有原生场景

### 2. JavaScript层面（交互增强）

在 `src/layouts/Layout.astro` 中实现统一的锚点跳转逻辑：

- 简化计算逻辑，直接使用 `getBoundingClientRect()` + `window.pageYOffset` 计算绝对位置
- 统一硬编码72px偏移量，和CSS保持完全一致
- 移除可能导致闪烁的二次校验逻辑，一次滚动到位
- 支持TOC点击、文章内锚点点击、SWUP页面切换带hash等所有场景

## 偏移量说明

```
总偏移量 72px = 固定导航栏高度 64px + 标题上方间距 8px
```

- 导航栏高度在 `src/components/header/Header.tsx` 中固定为 `h-[64px]`
- 8px间距保证标题和导航栏之间有舒适的视觉间隙，不会太近也不会太远

## 修改的文件列表

| 文件路径                          | 修改内容                                         |
| --------------------------------- | ------------------------------------------------ |
| `src/styles/markdown.css`         | 为所有markdown标题添加 `scroll-margin-top: 72px` |
| `src/layouts/Layout.astro`        | 重写锚点跳转逻辑，统一使用72px偏移量             |
| `src/components/post/PostToc.tsx` | 优化激活项判断阈值，和全局偏移保持一致           |

## 验证方法

1. 打开任意一篇带有目录的文章
2. 多次点击不同的TOC章节链接，检查跳转后标题是否完整显示在导航栏下方
3. 连续快速点击同一个TOC链接，检查是否位置稳定不偏移
4. 刷新页面（带hash），检查是否自动滚动到正确位置
5. 点击文章内部的锚点链接，检查跳转位置是否准确

## 后续维护

如果后续修改了导航栏高度，需要同步更新两个地方的偏移量：

1. `src/styles/markdown.css` 中的 `scroll-margin-top` 值
2. `src/layouts/Layout.astro` 脚本中所有的 `- 72` 数值
