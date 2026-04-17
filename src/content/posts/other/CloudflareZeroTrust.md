---
title: Cloudflare Zero Trust
date: 2026-04-17
lastMod: 2026-04-17 07:58:11
summary: 使用 0 成本 Cloudflare 访问网络
category: 其他
tags: [Cloudflare]
sticky: 0
---

> Zero Trust 可以免费访问 Google、YouTube 等，但无法使用 Gemini、ChatGPT、Claude（IP 限制，无法绕开）。

此文仅用于学习交流

## 1、注册和登录 Cloudflare

优先使用 Goole 登录，其次使用外网的邮箱如微软的 outlook、hotmail，注册后，直接登录！注意 Apple 登录一定要邮箱注册的 Apple ID， 手机号注册的无法登录到 Cloudflare。

![image-20260416073351738](attachments/image-20260416073351738.png)

登录后可以设置中文

![image-20260416073940736](attachments/image-20260416073940736.png)

## 2、开通 Zero Trust

登录后，Cloudflare 管理后台 [Cloudflare Dashboard | Manage Your Account](https://dash.cloudflare.com/)， 点击左边 Zero Trust,然后点击 Get started！

![image-20260416073529653](attachments/image-20260416073529653.png)

输入团队名称名称，可用即可！

![image-20260416073608383](attachments/image-20260416073608383.png)

选 Free 的套餐，不需要绑定信用卡等，下一步跳过即可！

![image-20260416073732246](attachments/image-20260416073732246.png)

把地址栏后面的内容去掉，只保留 https://dash.cloudflare.com/ 时会回到首页，重新点击 Zero Trust！

![image-20260416073826986](attachments/image-20260416073826986.png)

点击右边的团队和资源->设备。 添加设备。

![image-20260416074038261](attachments/image-20260416074038261.png)

下载 Warp 软件，然后一直下一步即可！

![image-20260416074117566](attachments/image-20260416074117566.png)

定义注册策略 是允许那些邮箱使用， 然后就是服务模式默认 流量和 DNS（推荐）！

![image-20260416074153869](attachments/image-20260416074153869.png)

继续

![image-20260416074246946](attachments/image-20260416074246946.png)

## 3、安装 Warp 软件

把前面下载的 Warp 安装好软件后，打开 。

![image-20260416074343355](attachments/image-20260416074343355.png)

点右下角设置，偏好设置，点击右下角使用 cloudflare zero trust 登录

![image-20260416074618135](attachments/image-20260416074618135.png)

然后下一步

![image-20260416074659778](attachments/image-20260416074659778.png)

输入你的团队名字

![image-20260416074719253](attachments/image-20260416074719253.png)

点击确定，会自动打开浏览器，输入前面填入的允许的邮箱！

![image-20260416074749595](attachments/image-20260416074749595.png)

验证码输入后点 Sign in

![image-20260416074825870](attachments/image-20260416074825870.png)

最后出现 Zero Trust 就是成了，点击开启连接。

![image-20260416074955448](attachments/image-20260416074955448.png)

访问 Goole 试试。

![image-20260416075228298](attachments/image-20260416075228298.png)

## 4、移动端安装

打开 Google Play 商店，下载 Cloudflare One Agent

![image-20260416075912774](attachments/image-20260416075912774.png)

iOS 需要用美区的苹果账户
