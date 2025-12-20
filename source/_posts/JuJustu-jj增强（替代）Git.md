---
title: JuJustu-jj增强（替代）Git
categories:
  - [学习笔记]
  - [速查手册]
  - [开发工具]
tags:
  - Git
  - Jujustu
  - 速查手册
published: true
date: 2025-12-19 13:47:42
---
{% githubrepo 'jj-vcs/jj' %}

{% githubrepo 'NGshiyu/java_study' %}

# [Jujustu 简介](https://docs.jj-vcs.dev/latest/tutorial/)

## 名称来由

Jujutsu（jj） (日文“柔术”之意) 是一个开源的分布式版本控制系统（VCS）。它主要由 Rust 编写，旨在提供比 Git 更简单、更强大且更符合直觉的用户界面（UI/UX），同时保持与 Git 的后端兼容性。

它的核心理念就像“柔术”一样：灵活、流畅，利用（兼容）现有的力量（Git）而不是通过蛮力对抗。

## 诞生与历史

jj主要由 Google 的软件工程师 Martin von Zweigbergk 创建。他也是 Mercurial (hg) 社区的资深开发者。

Git 虽然是行业标准，但其命令行界面（CLI）因其复杂性、不一致性和陡峭的学习曲线而饱受诟病（例如 checkout 承载了太多功能，暂存区 index 的概念让新手困惑）。

Martin 希望结合 Git 的强大生态（GitHub/GitLab 兼容性）与 Mercurial (hg) 的易用性，并引入一些全新的创新概念。

## 发展现状

目前是一个活跃的开源项目（托管在 GitHub），虽然仍处于 Beta 阶段，但因其作为“Git 的更佳前端”而迅速在 Rust 社区和极客圈流行起来。Google 内部也在尝试将其集成到工作流中。

# 核心设计哲学

## Git 兼容性 (Git-compatible)

它可以直接在现有的 Git 仓库上使用。jj 把它主要当作后端存储。你可以在同一个仓库里混合使用 git 命令和 jj 命令。

## 工作副本即提交 (The Working Copy is a Commit)

在 jj 中，你当前正在写代码的状态（工作区）被自动视为一个未完成的提交。

你不需要频繁 git add。当你修改文件时，jj 实际上是在更新这个“当前提交”。当你准备好时，你只是“完成”它并开始一个新的。

## 冲突是一等公民 (Conflicts as First-Class Objects)：

这是 jj 最酷的功能之一。如果合并产生冲突，你可以成功提交包含冲突的代码。 而不需要立刻解决冲突才能继续工作。冲突标记被作为文件内容的一部分存储下来，可以在以后任何时候再去解决。

# 安装(MacOs)

```shell
brew install jj
```

# 使用

## 关联 `git` 仓库

以当前的博客仓库为例

