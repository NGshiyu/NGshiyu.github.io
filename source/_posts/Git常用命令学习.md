---
title: Git常用命令学习
categories:
  - [学习笔记]
  - [速查手册]
  - [开发工具]
tags:
  - Git
  - 速查手册
published: true
date: 2025-11-18 14:15:18
---

# Git

## 基础命令

### git commit

- Git 提交当前本地仓库代码

### [git add .]

- 提交当前的文件到临时仓库

### git checkout -b [branchName]

- Git 创建并且切换到分支

### git checkout [branchName]

- Git 切换分支

### git merge [branchName]

- 将[branchName]分支内容合并到当前所在分支

### git branch  --delete(-d) [branchName]

- 删除本地[branchName]分支

### git push [remoteName] -d [branchName]

- 删除远程仓库分支 `git push origin -d yangyangSheep`

### git branch -r

- 仅显示远程分支

### git rebase [branchName]

- 将当前的分支的工作“复制”到所选[branchName]分支上

> Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。
> Rebase 的优势就是可以创造更线性的提交历史，如果只允许使用 Rebase 的话，代码库的提交历史将会变得异常清晰。
> 移动以后会使得两个分支的功能看起来像是按顺序开发，但实际上它们是并行开发的。
> 原本的 branchName 分支上的提交记录<font color="#error">依然存在</font> ，而当前分支的提交是我们 <font color="#error">Rebase</font> 到 <font color="#error">master</font> 分支上的 <font color="#error">提交记录的副本</font>

### 查看git用户名和邮箱地址命令

- git config user.name
- git config user.email

#### 修改用户名和邮箱地址

- git config --global user.name "username"
- git config --global user.email "email"
- 当git注册时的邮箱发生变化后，可以通过config命令进行修改。

---

## 高级命令

### HEAD概述

### git show HEAD

- 查看当前的HEAD的父母的消息
- `^` 查看上一个
- `~[num]` 查看上`num`个的父母的消息

### git checkout [commitName]

- 分离 Head
- 将 Head 指向具体的提交而并非是一个分支

> HEAD 是一个对当前检出记录的符号引用 —— 也就是指向你正在其基础上进行工作的提交记录。  
> HEAD 总是指向当前分支上最近一次提交记录。大多数修改提交树的 Git 命令都是从改变 HEAD 的指向开始的。  
> HEAD 通常情况下是指向分支名的（如 bugFix）。在你提交时，改变了 bugFix 的状态，这一变化通过 HEAD 变得可见。  
> 如果想看 HEAD 指向，可以通过 `cat .git/HEAD` 查看， 如果 HEAD 指向的是一个引用，还可以用 `git symbolic-ref HEAD` 查看它的指向。但是该程序不支持这两个命令）  
> 分离的 HEAD 就是让其指向了某个具体的提交记录而不是分支

### git checkout HEAD^ / git checkout HEAD~3 / git checkout [j25g24v3.....]

- Head 相对引用
- `git checkout HEAD^` 将当前的 HEAD 指向向上移动 1 个位置，让 HEAD 指向上一个提交记录
- `git checkout HEAD~3`将当前的 HEAD 指向向上移动(一次后退)3 个位置，让 HEAD 指向从当前的指向<font color="#error">向上移动3次</font>提交记录
- `git checkout j25g24v3.....`将当前的 HEAD 强制指向<font color="#error">j25g24v3.....</font>提交记录

> `git log` 来查查看提交记录的哈希值  
> Git 对哈希的处理很智能。你只需要提供能够唯一标识提交记录的前几个字符即可。因此我可以仅输入 fed2.... 而不是一长串字符

### git branch -f [branchName] HEAD~3 / git branch -f [branchName] c5qe8qd1..... /  git branch -f [branchName] [branchName2]

- `git branch -f [branchName] HEAD~3`
    - 将[branchName]分支强制指向 <font color="#error">当前 HEAD 位置向上 3 个</font> 的提交记录
- `git branch -f [branchName] c5qe8qd1.....`将[branchName]分支强制指向 <font color="#error">c5qe8qd1...</font> 的提交记录
- `git branch -f [branchName] [branchName2]`将[branchName]分支强制指向 <font color="#error">[branchName2]</font> 的指向位置

### git reset HEAD^ / git revert HEAD

- `git reset HEAD^`
    - 将当前所在的分支指向 HEAD 的上一个提交记录（c1），但是远程仓库的分支指向仍然是未移动之前的记录(c2)，对于本地仓库而言，c2 如同没有提交过一样，在 `reset` 后， C2 所做的变更还在，但是处于未加入暂存区状态；但是对于远程仓库而言，是无效的
- `git revert HEAD`
    - 将当前所在的分支从 `HEAD` <font color="#error">当前所指向的分支的提交记录的上一份提交记录</font>复制一份过来,变成一个新的提交，但是本次提交其实是和`revert`前的上一份提交记录保持一致的，也就是说这一次操作其实是用来撤销最后一次的提交的

### 版本回退测试

1. 首先做一个无用提交
2. 无用提交(~~xxxxxxx~~)
3. 回滚无用提交
4. 回滚之后的提交仍然可以正常运行

### 回滚的操作步骤
```shell
//查看当前所有的提交历史
git log --all
//查看当前的提交历史 --pretty=oneline 仅仅展示一行
git log --pretty=oneline 
//回滚到指定id的提交 
git reset --hard 54ef6 
//强制提交使得远程仓库和当前的本地一样
git push origin HEAD --force
//不需要回退的情况下进行找回已经回退掉的代码操作
//查看命令操作的历史
git reflog
//回滚掉回滚
git reset --hard id
git push origin HEAD --force
```

### git pull --allow-unrelated-histories

> 在本地项目提交为git项目的时候，做好git创建的时候，pull会失败，因为本地和远程的关系未建立，先允许拉取历史记录

### git merge master --allow-unrelated-histories

> 合并无关历史

---
## 移动提交记录（整理提交记录）

### Git Cherry-pick  [cada1... caada2... daag3...]

- 将<font color="#error">一些</font>提交复制到当前所在的位置（HEAD）下面

### git rebase -i HEAD~4

- `交互式 rebase` 选取当前位置向前num个提交记录进行后续操作
- `交互式 rebase` 指的是使用带参数 --interactive 的 rebase 命令, 简写为 -i
- 如果你在命令后增加了这个选项, Git 会打开一个 UI 界面并列出将要被复制到目标分支的备选提交记录，它还会显示每个提交记录的哈希值和提交说明，提交说明有助于你理解这个提交进行了哪些更改。在实际使用时，所谓的 UI 窗口一般会在文本编辑器 —— 如 Vim —— 中打开一个文件。
- 当 rebase UI界面打开时, 你能做3件事:
  1. 调整提交记录的顺序（通过鼠标拖放来完成）
  2. 删除你不想要的提交（通过切换 pick 的状态来完成，关闭就意味着你不想要这个提交记录）
  3. 合并提交，它允许你把多个提交记录合并成一个。
  
---
## 代码统计

### 查看git上的个人代码量（指定username）
```bash
git log --author="username" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -
```

### 统计每个人增删行数
```bash
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

### 统计每个人的代码提交次数
```bash
git shortlog -s -n
```

### 查看仓库提交者排名前5
```bash
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5
```

### 贡献值统计
```bash
git log --pretty='%aN' | sort -u | wc -l
```

### 提交数统计
```bash
git log --oneline | wc -l
```

### 添加或修改的代码行数
```bash
git log --stat|perl -ne 'END { print $c } $c += $1 if /(\d+) insertions/'
```

### 统计分支代码

```bash
git log  [branchName]  --pretty=tformat:  --numstat  -- . ":(exclude)*/test/*" ":(exclude)*/mock/*" ":(exclude)*/dal/*" ":(exclude)*/model/*" ":(exclude)*/dto/*" ":(exclude)*/enum/*" ":(exclude)*/enums/*" | grep "\(.java\)$" | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```  

### 统计分支代码（时间：从2021-02-01到2022-02-01）

```bash
git log [branchName] --since=2021-02-01 --until=2022-02-01 --pretty=tformat:  --numstat  -- . ":(exclude)*/test/*" ":(exclude)*/mock/*" ":(exclude)*/dal/*" ":(exclude)*/model/*" ":(exclude)*/dto/*" ":(exclude)*/enum/*" ":(exclude)*/enums/*" | grep "\(.java\)$" | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'  
```

### 统计某一个作者的代码量（时间段参考上面自加）

```bash
git log --author="你的Git名称" --pretty=tformat: --numstat -- . ":(exclude)*/test/*" ":(exclude)*/mock/*" ":(exclude)*/dal/*" ":(exclude)*/model/*" ":(exclude)*/dto/*" ":(exclude)*/enum/*" ":(exclude)*/enums/*" | grep "\(.java\)$" | awk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "added lines: %s removed lines : %s total lines: %s\n",add,subs,loc }'
```

### 统计当前项目工程总的代码行数

```bash
git ls-files | xargs cat | wc -l
# 下面的git命令单独细分每个文件的代码行数，相当于把上面命令细化：
git ls-files | xargs wc -l
# 统计Java代码总行数
find . "(" -name "*.java" ")" -print | xargs wc -l
# 统计其他文件行数
find . "(" -name "*.m" -or -name "*.mm" -or -name "*.cpp" -or -name "*.h" -or -name "*.rss" ")" -print | xargs wc -l
```

---

## 高级话题

### 迁移全量代码到新仓库操作步骤

```bash
git clone --mirror 老代码仓库URL

cd xxx.git

git remote add NEW-REMOTE[新仓库别名]  新代码仓库URL

git push NEW-REMOTE[新仓库别名] --mirror
```

### ssh相关操作

> Permission denied（publickey）一般有两种原因。
>
> 1. 客户端与服务端未生成 ssh key
> 2. 客户端与服务端的ssh key不匹配

#### 生成ssh key

```shell
ssh-keygen -t rsa -C "这里换上你的邮箱"
ssh-keygen -t rsa -C "Gitee_SSH_Key_这里换上你的设备名称"
ssh-keygen -t rsa -C "Gitee_SSH_Key_这里换上你的设备名称"
ssh-keygen -t rsa -C "Github_SSH_Key_这里换上你的设备名称"
ssh-keygen -t rsa -C "Github_SSH_Key_这里换上你的设备名称"

ssh-keygen -t rsa -C "Gitee_SSH_Key_MateBookWork"
ssh-keygen -t rsa -C "Github_SSH_Key_MateBookWork"

# 注意ssh和-keygen之间没有空格
# 之后需要输入密码等，不管一路回车即可。
# 默认的就会在C/User/CurrentUser/.ssh/id_rsa下面生成 id_rsa 和 id_rsa.pub两个文件。

# 执行命令后需要进行3次或4次确认：
# 1. 确认秘钥的保存路径（如果不需要改路径则直接回车）；
# 2.如果上一步置顶的保存路径下已经有秘钥文件，则需要确认是否覆盖（如果之前的秘钥不再需要则直接回车覆盖，如需要则手动拷贝到其他目录后再覆盖）；
# 3.创建密码（如果不需要密码则直接回车）；
# 4.确认密码；

# 创建完成之后需要将[公钥]配置到对应的代码仓库平台
```

#### Permission denied (publickey)

> 这个错误的意思权限不够,使用config配置文件解决  
> 查看ssh连接状态  
> ![查看ssh连接状态.png](./picture/查看ssh连接状态.png)

```bash
# 查看ssh连接状态的步骤
ssh -v git@github.com
# 检查连接是否成功
ssh -T git@github.com
# 若未成功，则继续查看连接状态
# 如果还是访问不对的文件
# 需要将指定的密钥文件添加到 ssh 连接队列中去
ssh-add -K ~/.ssh/Mobro_Chu

# 如果报了一个含有 Could not open a connection to your authentication agent. 的错误，则表示没有 代理权限。增加代理权限即可。
# 非 windows 系统
ssh-agent bash 
# windows 系统
eval `ssh-agent` 

# 其他命令
ssh-add -l # 查看 ssh key 队列中有哪些 key
ssh-add -D # 删除所有的 ssh key
```

#### 为不同的仓库添加不通的ssh key

> 在当前用户文件夹下的.ssh文件夹中添加config文件，内容如下：
> ```editorconfig
> # gitee
> Host gitee.com
> HostName gitee.com
> User ff-gitee
> PreferredAuthentications publickey
> IdentityFile ~/.ssh/???_Gitee_SSH_key
> # github
> Host github.com
> HostName github.com
> User ff-github
> PreferredAuthentications publickey
> IdentityFile ~/.ssh/???_Github_SSH_key
> ```

#### git在windows中的known_hosts问题

使用git连接之前配置好的公司内部git服务器时遇到无连接权限问题。根据提示发现是服务器切换了内部ip地址，因此需要在known_hosts文件夹中重新设置ip。  
1.首先进入.ssh文件夹，该目录下共有4个文件，分别为config，id_rsa，id_rsa.pub，known_hosts（如果没有可以手动创建）  
2.备份删除id_rsa，id_rsa.pub  
3.在config文件最后一行添加StrictHostKeyChecking no语句  
4.打开git命令行窗口重建秘钥  
ssh-keygen -t rsa -C "xxx@xxx.com"  
5.这时，在known_hosts文件中会发现多了一些数据，然后将新生成的id_rsa.pub内容复制到git网站的SSH KEY中  
6.在命令行中输入：git remote show origin  
若输出我们配置的origin信息，表示问题已经解决，接下来便可以通过git命令clone或push仓库数据。

如果是第一次在window中配置git，可按照以下步骤配置：  
1.在需要建立关系的文件夹下打开git命令行窗口（在该文件夹下点击鼠标右键）  
2.初始化git：git init  
3.配置个人信息：git config --global user.email "xxx@xxx.com"  
git config --global user.name "xxx"  
接下来的步骤与上面第4步开始的步骤相同。
