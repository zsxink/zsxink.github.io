---
title: Cloudflare Workers 搭建 VLESS/Trojan 订阅
date: 2026-04-19
lastMod: 2026-04-20 07:58:11
summary: 使用 Cloudflare Workers 搭建免费的个人订阅节点
category: 其他
tags: [Cloudflare]
sticky: 0
---

> Cloudflare Workers 目前亲测可以访问 Gemini 和 ChatGPT，请勿访问 Claude，请勿使用有购买服务的 AI 服务，IP 是机房 IP 不是很纯净！访问速度不如 Cloudflare Zero Trust（看上一篇文章）。

### ⚠️ 重要法律与合规声明

**在使用 EdgeTunnel 或任何类似网络工具之前，请您仔细阅读并理解以下内容：**

- **合规性承诺：** 此内容仅供学习、研究和技术交流使用。请确保您在使用过程中严格遵守您所在地（居住地/注册地）的所有相关法律法规。
- **严禁非法用途：** 严禁将本工具用于任何非法目的，包括但不限于访问被限制的非法内容、从事网络攻击、窃取数据、传播违规信息或进行任何违反互联网安全管理条例的行为。
- **风险自负：** 因使用本工具而导致的任何法律责任、经济损失、网络安全问题或个人隐私泄露，均由使用者本人承担。本指南仅提供技术操作流程，不承担任何形式的连带责任。
- **网络道德：** 请自觉维护网络空间的清朗，尊重各地的互联网管理政策，不利用此类工具进行任何破坏性活动。

在此之前你需要有一个 Cloudflare 账号和 Github 账户！使用 EdgeTunnel ，一个基于 CF Worker 平台的脚本，可以将 VLESS 配置信息转换为订阅内容，方便地使用在线配置转换到 Clash 或 Singbox 等工具中。以下是部署 EdgeTunnel 的步骤。

出口 IP，纯净度堪忧！

![image-20260421001158563](attachments/image-20260421001158563.png)

另外访问不同地区的服务的出口 IP也是随机

![image-20260421001500128](attachments/image-20260421001500128.png)

## 1、注册免费域名

打开 [https://dash.domain.digitalplat.org/signup?ref=AqdK0sunOX](attachments/signup) ，使用我的邀请码可以获取两个可用免费域名！

可以使用 +86-130XXXXXXXX 这样的随机也行！反正格式对了就行

![image-20260419233430710](attachments/image-20260419233430710.png)

验证邮箱

![image-20260419234507197](attachments/image-20260419234507197.png)

真人验证，需要有个 Github 账户！

![image-20260419234730437](attachments/image-20260419234730437.png)

同意

![image-20260419235510290](attachments/image-20260419235510290.png)

### 1.1、注册免费域名

开始域名注册， 其中 US.KG 和 XX.KG 需要付费，好像是 7 美元一个，但是可以永久（没买过不确认），但 **dpdns.org , qzz.io**, ~~qd.je（暂不能托管到 Cloudflare）~~ 可以免费注册。

![image-20260419235713208](attachments/image-20260419235713208.png)

输入完成后点击检查可用性，可以注册的话会产出注册界面！

![image-20260420000043612](attachments/image-20260420000043612.png)

## 2、在 Cloudflare 添加域名解析

点击添加，连接域。

![image-20260420001350881](attachments/image-20260420001350881.png)

填入刚才注册的域名然后点击继续：

![image-20260420001441805](attachments/image-20260420001441805.png)

一律选择 Free

![image-20260420003252572](attachments/image-20260420003252572.png)

继续前往激活

![image-20260420003442917](attachments/image-20260420003442917.png)

复制 名称服务器

![image-20260420003503919](attachments/image-20260420003503919.png)

### 2.1、在 digitalplat 添加名称服务器

在域名列表中，选择域名，域名管理：，把上面的名称服务器复制进去，然后点击更新!

![image-20260420003731040](attachments/image-20260420003731040.png)

回到 cloudflare ， 点击我已更新名称服务器！

![image-20260420004220580](attachments/image-20260420004220580.png)

出现下面的就等一下，然后刷新

![image-20260420004440810](attachments/image-20260420004440810.png)

出现下面的表示成功

![image-20260420004555410](attachments/image-20260420004555410.png)

## 3、搭建 edgetunnel

EdgeTunnel 是一个基于 CF Worker 平台的脚本，可以将 VLESS 配置信息转换为订阅内容。Github 地址 [https://github.com/cmliu/edgetunnel](https://github.com/cmliu/edgetunnel).

### 3.1、初始化 KV 存储

点击 存储和数据库，选择 Workers KV。

![image-20260420231016211](attachments/image-20260420231016211.png)

点击 CreateInstance。

![image-20260420231117268](attachments/image-20260420231117268.png)

命名空间随意

![image-20260420231159893](attachments/image-20260420231159893.png)

### 3.2、部署 \_workders.js

选择 计算， 选择 “Workers 和 Pages”

![image-20260420231248443](attachments/image-20260420231248443.png)

点击创建应用程序：

![image-20260420231328060](attachments/image-20260420231328060.png)

点击 从 Hello World 开始！

![image-20260420233505870](attachments/image-20260420233505870.png)

输入 Workers 的名称，然后点击部署

![image-20260420233613974](attachments/image-20260420233613974.png)

点击编辑代码

![image-20260420233656288](attachments/image-20260420233656288.png)

粘贴 edge tunnel 的 \_workers.js 的内容，然后点击部署

![image-20260420234022856](attachments/image-20260420234022856.png)

### 3.3、添加自定义域名

回到 Workers 主页。 点击设置。

![image-20260420231956250](attachments/image-20260420231956250.png)

添加域名。

![image-20260420232115929](attachments/image-20260420232115929.png)

自定义域

![image-20260420232136637](attachments/image-20260420232136637.png)

输入你的 Workers 项目名称 + 你前面注册绑定到 cloudflare 的免费域名。

![image-20260420232219686](attachments/image-20260420232219686.png)

可用的话会显示如下，然后正常点击添加域即可。

![image-20260420232356403](attachments/image-20260420232356403.png)

添加完成自定义域名后，需要做两件事情

- 启用 预览 URL
- 添加变量 ADMIN 和 URL

![image-20260420234603368](attachments/image-20260420234603368.png)

添加变量，完成后点击部署。

- ADMIN 管理员密码
- URL 404 错误地址 推荐 https://cloudflare-error-page-3th.pages.dev/

![image-20260420234824585](attachments/image-20260420234824585.png)

### 3.4、添加 KV 绑定

点击上方的绑定

![image-20260420235015865](attachments/image-20260420235015865.png)

选择 KV 命名空间

![image-20260420235038985](attachments/image-20260420235038985.png)

变量名称一定要KV，然后添加绑定

![image-20260420235104002](attachments/image-20260420235104002.png)

## 4、edge tunnel 配置

访问在 3.3、添加自定义域名 中添加的域名。 后面需要加上 /admin，比如 workers-name.shuai-shuai.qzz.io/admin.

之后会弹出密码输入框，输出刚才设置的管理员密码，然后登录。

![image-20260420235354728](attachments/image-20260420235354728.png)

出现下面的表示即可， 点击复制节点（第一个）

![image-20260420235602623](attachments/image-20260420235602623.png)

## 5、V2RayN 设置

打开 Windows V2RayN。选择配置项，选择从剪切板导入分享链接。

![image-20260420235844958](attachments/image-20260420235844958.png)

测试是否可以连上

![image-20260421000002765](attachments/image-20260421000002765.png)

## 6、手机的 V2RayNG

直接扫二维码即可！
