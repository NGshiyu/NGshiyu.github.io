---
title: Hexo+Github Pages搭建个人博客
date: 2025-11-09 18:24:45
categories:
  - [搞七捻三]
  - [个人博客]
tags:
  - Hexo
  - Next
  - Blog
  - GitHub Pages
---
{% githubrepo 'NGshiyu/NGshiyu.github.io' %}

# 写在最前

感谢开源世界和AI的发展，让我由于懒一直搁置的计划，得以实现！！！🙏🙏🙏🙏

# 碎碎念

从踏入互联网开发领域的起始，就一直有建立个人博客和个人知识库的想法，
个人知识库建立经历过从OneNote-Notion-Obsidian-Github,也算是积累了一些东西，但是个人博客却一直由于各种自我找理由而迟迟没有推进。

在一个忙里偷闲的周末下午，我突然想起来了老师的一段话，大意是：
作为一名开发者，强烈建议大家坚持写博客，不管你是在哪里写，一定要动起来，
一是为了积累你自己的知识，技术发展的速度太快内容太多你是跟不上的，记下来反复咀嚼才行；
二是为了能让你有一个自我的总结，在写博客的过程中，你要给别人看,自然需要深入浅出，让别人能看懂，这也是你自己增进理解的过程。

在六年之后再次回想起这句话，感觉像是在过电影，好几个中文博客站只是起了个头就放弃了，好像这几年什么都没有留下，处于一种有秩序的混乱中，迷茫驻足又被推着走。
算了，不上价值，不谈收获，确实是需要给自己留点什么，那就从现在开始吧！


# 组件选型

- [Hexo](https://github.com/hexojs/hexo): 基于Node.js 开发的开源静态博客框架，将Markdown的文件处理为静态的HTML网页，结合内置的[插件](https://hexo.io/plugins/)等内容，编译为静态网页部署到服务器
- [Next](https://github.com/next-theme/hexo-theme-next): 一个高质量主题插件，集成了一些插件功能，同时也具备扩展能力，可以快速定制你的个人博客。[参考](https://hexo-next.readthedocs.io/zh-cn/latest/)
  - gitalk: Next 集成的一个 GitHub 评论框架，接入GitHub Issue，
  - ... Next集成了一些使用的插件，感兴趣的可以[自行探索](https://theme-next.js.org/plugins/)
- Github：用于存放博客的源数据，并结合 Actions + Pages 的能力实现自动化部署和代理访问

> 通过这种方式，可以实现0成本搭建博客，并且因为是托管在GitHub上面的，你也无须担心被攻击，只要注意避免在公开的仓库中泄露自己的隐私即可，而且上手的成本非常低。

# 搭建博客

## 准备Github仓库
- 添加一个GitHub的仓库，命名为xx.github.io，添加README.md
- 为了本地的结构清晰，环境干净，这里仓库直接留空

## 安装Hexo
- 创建本地的Hexo工作空间文件夹 `~/Hexo`
- 执行Hexo的安装命令
```shell
npm install -g hexo-cli # 全局安装
npm install hexo # 非全局安装
hexo init <folder> # 此处的名称和你的仓库名称保持相同
cd <folder> # 后续所有的操作均在次目录内完成，不会再返回上层目录了
npm install
```
执行完成这几步你的仓库Hexo就搭建好了，这里的小巧思是这样我就可以使用任意的编辑器（如WebStorm、VsCode）把我的GitHub上的博客项目当作一个工程打开，
对于我来说比较干净清晰，接下来只需要关联GitHub代码仓库和你的Hexo工程，使用仓库的提示处理，将本地工程推送到GitHub即可

## GitHub Actions + GitHub Pages 自动化部署
- 添加 `.github/workflows/hexo.yml` 
- 添加如下脚本内容
```yaml
# Sample workflow for building and deploying a Hexo site to GitHub Pages
name: Deploy Hexo site to Pages

on:
  # Runs on pushes targeting the default branch [当推送到 [?] 分支时触发]
  push:
    branches: [main]

  # Allows you to run this workflow manually from the Actions tab [允许从 Actions 页面手动触发工作流]
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages [为 GITHUB_TOKEN 设置权限，允许部署到 GitHub Pages]
permissions:
  contents: read      # 允许读取仓库内容
  pages: write        # 允许写入 Pages 内容
  id-token: write     # 允许使用 GitHub OIDC 令牌

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete. [设置并发策略，防止重复运行]
concurrency:
  group: "pages"           # 同组内只保留最新任务
  cancel-in-progress: false # 不取消正在运行的任务

# Default to bash
defaults:
  run:
    shell: bash

jobs:
  # Build job ------------------ 构建任务 ------------------
  build:
    runs-on: ubuntu-latest  # 使用最新 Ubuntu 环境

    steps:
      # 拉取仓库代码（包含子模块）
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive  # 同步子模块（Next 主题）

      # 配置 GitHub Pages 环境
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      # 安装envsubst
      - name: Install envsubst
        run: sudo apt-get update && sudo apt-get install -y gettext-base

      # 安装 Node.js 环境（用于执行 Hexo 命令）
      - name: Use Node.js 24.x
        uses: actions/setup-node@v4
        with:
          node-version: "24"

      # 安装 Hexo 及依赖
      - name: Install Dependencies
        run: npm ci

      # ✳️ 替换 _config.next.yml 文件中的占位符变量
      # 此步骤会将 ${VAR_NAME} 替换为仓库 Secrets 中的真实值
      # envsubst 是一个环境变量替换工具，可以将文件中的 ${VAR} 占位符替换成对应的环境变量值
      - name: Replace environment variables in Next config
        run: |
          echo "开始替换 _config.next.yml 中的环境变量..."
          envsubst < _config.next.yml > _config.next.resolved.yml
          cp _config.next.resolved.yml _config.next.yml
        # 注入环境变量 ！！！此处是我的 GitHub Secret 配置的密钥环境变量，用于 theme-next 的 gitalk 评论插件，可以移除
        env:
          GITALK_GITHUB_CLIENT_ID: ${{ secrets.GITALK_GITHUB_CLIENT_ID }}
          GITALK_GITHUB_CLIENT_SECRET: ${{ secrets.GITALK_GITHUB_CLIENT_SECRET }}

      # 使用 Hexo 生成静态文件，加载替换后的配置文件
      - name: Build with Hexo
        run: npx hexo clean && npx hexo generate --prod

      # 上传构建生成的静态文件作为 artifact（供后续部署使用）
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  # ------------------ 部署任务 ------------------
  deploy:
    environment:
      name: github-pages   # 部署环境名称
      url: ${{ steps.deployment.outputs.page_url }}  # 部署完成后访问地址
    runs-on: ubuntu-latest
    needs: build           # 依赖 build 任务完成
    steps:
      # 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
- 这一步完成你的博客已经搭建好，可以投入使用了

# 个性化配置
> Hexo 相关的主题有非常多，大家可以自行浏览[Jekyll Themes](http://jekyllthemes.org/)，找自己喜欢的使用，我本人使用的是[hexo-theme-next](https://github.com/next-theme/hexo-theme-next)

## 下载主题

> next主题经历过多次迭代，检索的时候注意使用最新的版本，参阅最新的配置文档

next主题支持多种安装方式，我使用最便捷的方式安装 `npm install hexo-theme-next --save`，这个方式不用管理过多的文件，避免在后续不断迭代的过程中代码仓库过大 `git pull` 的时候慢

## 配置

将next主题的配置文件迁移到主目录，方便做个性化配置，原始文档的注释也很齐全，英文不好得可以让大模型做一次翻译或者直接参考我的[配置文档](https://github.com/NGshiyu/NGshiyu.github.io/blob/main/_config.next.yml)

```shell
cp node_modules/hexo-theme-next/_config.yml _config.next.yml
```

同时，Hexo 和 Next 主题本身就自带了一些插件，如何配置可以参考对应的插件仓库

# 工作空间优化（注意密钥等内容添加到`gitignore`）

## [direnv](https://direnv.net/)

控制本地的特殊环境变量，而无须污染全局`bash`环境，在项目内添加文件`.envrc`,如：

```shell
# ~/.envrc 或 项目/.envrc
export FOO=foo
export NODE_ENV=development
```

使用 `direnv allow` 加载变量，

> Tips: <font color="red"> `direnv` 并不支持局部 `alias` 配置</font>，所以需要下面的工具

## [Just](https://github.com/casey/just)
 
使用 just 工具优化本地处理的流程，简化局部安装 Hexo 过于繁琐的命令，在项目内配置 `Justfile` 如：

```shell
#!/usr/bin/env just --justfile
export PATH := join(justfile_directory(), "node_modules", "bin") + ":" + env_var('PATH')

build:
  npx hexo generate --dev
clean:
  npx hexo clean
server:
  npx hexo server
run:
  npx hexo clean && npx hexo generate --dev && npx hexo server --dev
all:
  npx hexo clean && npx hexo generate --dev
```

同时这个工具可以结合WebStorm的插件使用，更加方便

## WebStorm 插件

### [env](https://plugins.jetbrains.com/plugin/9525--env-files)

根据 .env、Dockerfile 和 docker-compose.yml 文件自动补全环境变量。

# 总结

到此处就基本拥有一个可以投入使用的博客了，如果想要美化或者添加更多的功能，可以通过 `_config.next.yml` 配置和 `plugins` 继续探索！