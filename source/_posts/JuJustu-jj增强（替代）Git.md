---
title: JuJustu-jj增强（替代）Git
categories:
  - [学习笔记]
  - [速查手册]
  - [开发工具,版本控制系统 (VCS),Jujustu]
tags:
  - 版本控制系统 (VCS)
  - 速查手册
  - Jujustu
published: false
date: 2025-12-19 13:47:42
---
{% githubrepo 'jj-vcs/jj' %}

{% githubrepo 'NGshiyu/NGshiyu.github.io' %}

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

以当前的博客仓库为例，使用jj拉取仓库

### jj git clone （重新初始化一个仓库）

```shell
❯ jj git clone git@github.com:NGshiyu/NGshiyu.github.io.git
Fetching into new repo in ".../NGshiyu.github.io"
remote: Enumerating objects: 958, done.
remote: Total 958 (delta 213), reused 185 (delta 165), pack-reused 706 (from 1)
bookmark: dependabot/npm_and_yarn/node-forge-1.3.2@origin [new] untracked
bookmark: dev@origin                                      [new] untracked
bookmark: main@origin                                     [new] tracked
Setting the revset alias `trunk()` to `main@origin`
Working copy  (@) now at: tloqwtuw b165b5f5 (empty) (no description set)
Parent commit (@-)      : pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 =====
Added 52 files, modified 0 files, removed 0 files
Hint: Running `git clean -xdf` will remove `.jj/`!
```

### jj init  (在本地已有的git仓库里集成jj)  （later）

### jj st (jj status)

```shell
❯ jj st
Working copy changes:
M .gitignore
M source/_posts/JuJustu-jj增强（替代）Git.md
#工作副本（基于父提交产生的copy，可以在这个上面添加自己的内容，用于下一次的提交）
#此处工作副本的下一次提交id已经初始化好了，如果push到远程仓库这个id就会变成远程仓库的下一个提交id
Working copy  (@) : tloqwtuw cd1e0cc5 (no description set) 
Parent commit (@-): pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 ===== #父提交（也就是目前远程git仓库的最后一次提交）
```
执行之后输出了以下内容，在使用jj之前，我删除了本地已经存在的当前仓库，最后一次提交的 commit ID: 25d8b3da
1. jj引入了一些新概念。在输出中可以看到两个提交：父提交和工作副本。它们分别使用两个不同的标识符进行标识：“change ID”和“commit ID”。
Git 用户： 提交 ID/哈希值与 Git 中看到的相同，应该与您在 Git 仓库检出后使用 `git log` 查看仓库时看到的内容一致。change ID 则是一个新概念，是 Jujutsu 特有的。

此处工作副本的下一次提交id `cd1e0cc5` 已经初始化好了，如果此时push到远程仓库这个id就会变成远程仓库的下一个提交id。
但是如果此时你再次编辑内容，并且再次执行 `jj st`, 你会发现提交id的哈希值变了，但是变更id保持不变，如下：
```shell
❯ jj st
Working copy changes:
M .gitignore
M source/_posts/JuJustu-jj增强（替代）Git.md
Working copy  (@) : tloqwtuw 523aef39 (no description set)
Parent commit (@-): pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 =====
```
这个概念和 Git 非常不同，在 Git 中，working copy 是一个完全不同的概念。

## 创建第一次的提交

### jj describe

执行之后会进入 `nano` 编辑器，编辑提交的描述 `jj first commit` 后保存，执行 `jj st` 输出如下：
```shell
❯  jj describe
Working copy  (@) now at: tloqwtuw d3386f4e jj first commit
Parent commit (@-)      : pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 =====

❯ jj st      
Working copy changes:
M .gitignore
M source/_posts/JuJustu-jj增强（替代）Git.md
Working copy  (@) : tloqwtuw d3386f4e jj first commit
Parent commit (@-): pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 =====
```

### jj config

1. jj 的默认编辑器是nano，使用起来不是很习惯，使用 `jj config` 配置为 vim
    ```shell
    jj config set --user ui.editor "vim"
    ```
2. `jj config list` 查看现有的 jj 配置顺手配置一下自己的用户名等信息
   ```shell
   jj config set --user user.name "xxxx"
   jj config set --user user.email "xxx@xxx"
   jj metaedit --update-author  #设置成功后 jj 需要设置当前已存在的变更元信息才生效，否则会保持原有的信息
   ```
   
### jj diff

使用 `jj diff` 查看当前的变更差异，输出内容如下，并且会伴有颜色标识状态:
> Jujutsu 的 diff 格式目前默认采用内联着色方式(当前是vim)（如果需要实现 `git diff --color-words` 的效果 ），可以使用 `jj diff --git` 来使 diff 转换风格。
```shell
❯ jj diff       
Modified regular file .gitignore:
    ...
  13   13: 
  14   14: # 环境变量和敏感配置文件
  15   15: .env
       16: .envrc
  16   17: .env.local
  17   18: .env.production
  18   19: .env.development
    ...
Modified regular file source/_posts/JuJustu-jj增强（替代）Git.md:
    ...
  61   61: 
  62   62: ## 关联 `git` 仓库
  63   63: 
  64   64: 以当前的博客仓库为例以当前的博客仓库为例，使用jj拉取仓库
  65   65: 
       66: ### jj git clone
       67: 
       68: ```shell
       69: ❯ jj git clone git@github.com:NGshiyu/NGshiyu.github.io.git
       70: Fetching into new repo in ".../NGshiyu.github.io"
       71: remote: Enumerating objects: 958, done.
       72: remote: Total 958 (delta 213), reused 185 (delta 165), pack-reused 706 (from 1)
       73: bookmark: dependabot/npm_and_yarn/node-forge-1.3.2@origin [new] untracked
       74: bookmark: dev@origin                                      [new] untracked
       75: bookmark: main@origin                                     [new] tracked
       76: Setting the revset alias `trunk()` to `main@origin`
       77: Working copy  (@) now at: tloqwtuw b165b5f5 (empty) (no description set)
       78: Parent commit (@-)      : pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 =====
       79: Added 52 files, modified 0 files, removed 0 files
       80: Hint: Running `git clean -xdf` will remove `.jj/`!
       81: ```
       82: 
       83: ### jj st (jj status)
       84: 
       85: ```shell
       86: ❯ jj st
       87: Working copy changes:
       88: M .gitignore
       89: M source/_posts/JuJustu-jj增强（替代）Git.md
       90: # 工作副本（基于父提交产生的copy，可以在这个上面添加自己的内容，用于下一次的提交）
       91: # 此处工作副本的下一次提交id已经初始化好了，如果push到远程仓库这个id就会变成远程仓库的下一个提交id
```

### jj new

`jj new` 会在当前工作副本提交之上创建一个新的提交，<font color="red">但是并不会push到远程仓库</font>。这个新提交用于保存工作副本的更改。

因此我们可以使用这个命令来处理不同的工作，以便于区分当前所做的事情，这样会让每一次做了什么在提交信息中展示的非常清晰。
```shell
❯ jj new       
Working copy  (@) now at: npkxlrmm 8182dfdc (empty) (no description set)
Parent commit (@-)      : tloqwtuw 0b3d5db2 jj first commit
```

#### jj new main

基于 main 分支创建一个新的变更，之前的变更会被保留在历史里面，如：
```shell
❯ jj new main
Working copy  (@) now at: unokmvpv 9018cf83 (empty) (no description set)
Parent commit (@-)      : pkstknpr 25d8b3da main | ===== jujustu 替代 git start：删除仓库重新开始 =====
Added 0 files, modified 2 files, removed 0 files
❯ jj log     
@  rlqqryyp xxxxx@163.com 2025-12-20 18:36:05 0bb045f6
│  (empty) (no description set)
│ ○  ntuktkwl xxxxx@163.com 2025-12-20 18:36:00 60e5a9bd
│ │  (no description set)
│ ○  wvmtpotp xxxxx@163.com 2025-12-20 17:55:51 65c118b1
│ │  (no description set)
│ ○  lxoomtww xxxxx@163.com 2025-12-20 17:55:01 c3775734
│ │  (empty) squash 1
│ ○  sozpywzr xxxxx@163.com 2025-12-20 17:54:56 77c89dd3
│ │  (no description set)
│ ○  zpvxkqmx xxxxx@163.com 2025-12-20 17:52:09 e2b2b8e2
│ │  (empty) sq1
│ ○  sllnswrt xxxxx@163.com 2025-12-20 17:51:02 69b39424
│ │  (no description set)
│ │ ○  lrtsqmnl xxxxx@163.com 2025-12-20 17:49:46 a6374095
│ ├─╯  (empty) (no description set)
│ ○  tloqwtuw xxxxx@163.com 2025-12-20 17:49:46 c85d7904
├─╯  jj first commit
◆  pkstknpr xxxxx@163.com 2025-12-20 16:27:42 main git_head() 25d8b3da
│  ===== jujustu 替代 git start：删除仓库重新开始 =====
~
```

### jj squash

等价于 `git add . && git commit --amend --no-edit`，执行之后会出现以下几种情况：
1. 当前的变更有描述，会进入vim，让你编辑描述内容

   a. 不编辑直接保存，会把这个描述直接追加到父变更中，处理为一次变更
   b. 编辑在保存，同样会把这个描述直接追加到父变更中，处理为一次变更，此时你的变更消息会展示为编辑后的内容

2. 当前的变更没有描述
   直接隐式处理，会直接把当前的内容合并到父提交里面

### jj squash -r 'description("jj first commit")..@' --into 'description("jj first commit")'

`-r 'description("jj first commit")..@'` 选择从那个提交之后一直到当前（@）的所有提交。 

`--into 'description("jj first commit")'` 把选中的这些提交的内容，全部“挤压”进这个指定的目标提交里。

### jj log

查看提交日志，等价于 `git log`

@ 符号表示工作副本提交。每行第一个 ID（例如上面的“tloqwtuw”）是change ID，第二个 ID 是commit ID。您可以将任一 ID 传递给以修订版本作为参数的命令。

但是通常建议选择change ID，因为当提交被重写时，change ID 会保持不变。默认情况下， jj log 会列出本地提交，并添加一些远程提交以提供上下文。`~` 表示该提交有父提交，但这些父提交未包含在图中。
```shell
❯ jj log          
@  ntuktkwl xxxxx@163.com 2025-12-20 17:59:42 af9c1bac
│  (no description set)
○  wvmtpotp xxxxx@163.com 2025-12-20 17:55:51 git_head() 65c118b1
│  (no description set)
○  lxoomtww xxxxx@163.com 2025-12-20 17:55:01 c3775734
│  (empty) squash 1
○  sozpywzr xxxxx@163.com 2025-12-20 17:54:56 77c89dd3
│  (no description set)
○  zpvxkqmx xxxxx@163.com 2025-12-20 17:52:09 e2b2b8e2
│  (empty) sq1
○  sllnswrt xxxxx@163.com 2025-12-20 17:51:02 69b39424
│  (no description set)
│ ○  lrtsqmnl xxxxx@163.com 2025-12-20 17:49:46 a6374095
├─╯  (empty) (no description set)
○  tloqwtuw xxxxx@163.com 2025-12-20 17:49:46 c85d7904
│  jj first commit
◆  pkstknpr xxxxx@163.com 2025-12-20 16:27:42 main 25d8b3da
│  ===== jujustu 替代 git start：删除仓库重新开始 =====
~  #~ 表示该提交有父提交，但这些父提交未包含在图中。
```

#### git log --revisions / -r 

我们可以使用 --revisions / -r 标志来选择要列出的不同修订集。该标志接受一个 “revset” ，这是一个用于指定修订集的简单语言表达式，实现精确控制你想在图谱中看到哪些提交。
```shell
❯ jj log --revisions tloqwtuw
○  tloqwtuw xxxxx@163.com 2025-12-20 17:49:46 c85d7904
│  jj first commit
~
```
例如， `@` 指的是工作副本提交， `root()` 指的是根提交。 `bookmarks() ` 指的是书签指向的所有提交（类似于 Git 的分支）。

我们可以使用 `|` 表示并集， `&` 表示交集， `~` 表示差集。例如：

提交号 00000000 （变更 ID zzzzzzzz ）的提交是一个虚拟提交，被称为“根提交”。它是每个仓库的 root() 提交。 revset 中的函数与之匹配。

```shell
❯ jj log -r '@ | root() | bookmarks()'
@  ntuktkwl xxx@163.com 2025-12-20 18:11:02 24fea6d4
│  (no description set)
~  (elided revisions)
◆  pkstknpr xx@163.com 2025-12-20 16:27:42 main 25d8b3da
│  ===== jujustu 替代 git start：删除仓库重新开始 =====
~  (elided revisions)
◆  zzzzzzzz root() 00000000
```
此外，还有用于获取父节点`foo-`、子节点`foo+`、祖先节点`::foo`、后代节点`foo:::`和 DAG 范围`foo::bar`（等价于 `git log --ancestry-path`），范围`foo..bar` 与 Git 相同）。
```shell
# 查看所有历史
jj log -r "all()"
# 只看某个分支及其祖先
jj log -r "main"
# 或者包含它的祖先（直到根节点）
jj log -r "::main"
# 按作者或描述过滤
jj log -r "author(NGShiyu)"
jj log -r "description(fix)"
```
参见 [所有 revset 运算符和函数的 revset 文档](https://docs.jj-vcs.dev/latest/revsets/) 。

## 冲突处理（later）

## 操作日志（later）

## 提交代码基本工作流程

Jujustu提交代码需要先创建一个提交堆栈，只有当需要将堆栈推送到远程仓库时才需要创建书签。主要有两种工作流程：使用系统生成的书签名称或手动命名书签。

### jj bookmark set main -r @

把 main 书签移动到当前位置 告诉 jj：“我现在所在的这个提交（@），就是 main 分支的最新状态：就是为当前的变更指定一个分支

### jj git push

提交代码到远程仓库

## 一些其他的常用命令

### jj git push

### jj undo

将仓库的状态完全回滚到上一个jj命令执行之前的状态。

### jj abandon

如果你已经在新的 change 中（jj new 会自动把工作副本切换到新创建的 change），你可以直接“放弃”当前的这个空 change。删除当前的 change，并将工作副本（Working Copy）自动切回到它的父节点（即你执行 `jj new` 之前的那个位置）。

### jj edit [revsets]
```shell
jj edit @- # 回到之前的节点，但不想彻底删除刚才新建的 change（或者想稍后再处理它)
jj edit @+ # 从当前的所在节点向下跳一级到子节点进行编辑
jj edit ntuktkwl # 指定一个提交编辑
```
