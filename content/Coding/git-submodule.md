---
Title: git submodule的用法
Date: 2018-02-03 10:20
Modified: 2018-02-03 19:30
Category: 工具集
Tags: git, submodule
Slug: git-submodule
Authors: JT Guo
Summary: 参考 http://www.cnblogs.com/nicksheng/p/6201711.html， 用于项目 中的 项目
---
# 常用命令

```bash
git clone <repository> --recursive #递归的方式克隆整个项目
git submodule add projectB.git projectB #添加子模块
git submodule init #初始化子模块
git submodule update #更新子模块
git submodule foreach git pull #拉取所有子模块
```

## 如何使用

### 1. 创建带子模块的版本库

例如我们要创建如下结构的项目

```bash
project
    |--moduleA
    |--readme.txt
```

创建project版本库，并提交readme.txt文件

```bash
git init --bare project.git
git clone project.git project1cd project1
echo "This is a project." > readme.txt
git add .
git commit -m "add readme.txt"
git push origin master
cd ..
```

<!--more-->

创建moduleA版本库，并提交a.txt文件

```bash
git init --bare moduleA.git
git clone moduleA.git moduleA1
cd moduleA1
echo "This is a submodule." > a.txt
git add .
git commit -m "add a.txt"
git push origin master
cd ..
```

在project项目中引入子模块moduleA，并提交子模块信息

```bash
cd project1
git submodule add ../moduleA.git moduleA
git status
git diff
git add .
git commit -m "add submodule"
git push origin master
cd ..
```

使用git status可以看到多了两个需要提交的文件，其中.gitmodules指定submodule的主要信息，包括子模块的路径和地址信息，moduleA指定了子模块的commit id，使用git diff可以看到这两项的内容。这里需要指出父项目的git并不会记录submodule的文件变动，它是按照commit id指定submodule的git header，所以.gitmodules和moduleA这两项是需要提交到父项目的远程仓库的。

```bash
On branch master
Your branch is up-to-datewith'origin/master'.
Changes to be committed:  (use "git reset HEAD ..."to unstage)
    new file:   .gitmodules
    new file:   moduleA
```

### 2. 克隆带子模块的版本库

方法一，先clone父项目，再初始化submodule，最后更新submodule，初始化只需要做一次，之后每次只需要直接update就可以了，需要注意submodule默认是不在任何分支上的，它指向父项目存储的submodule commit id。

```bash
git clone project.git project2
cd project2
git submodule init
git submodule update
cd ..
```

方法二，采用递归参数--recursive，需要注意同样submodule默认是不在任何分支上的，它指向父项目存储的submodule commit id。

```bash
git clone project.git project3 --recursive
git submodule update --init --recursive
```

### 3. 修改子模块

修改子模块之后只对子模块的版本库产生影响，对父项目的版本库不会产生任何影响，如果父项目需要用到最新的子模块代码，我们需要更新父项目中submodule commit id，默认的我们使用git status就可以看到父项目中submodule commit id已经改变了，我们只需要再次提交就可以了。

```bash
cd project1/moduleA
git branch
echo"This is a submodule." > b.txt
git add .
git commit -m "add b.txt"
git push origin master
cd ..
git status
git diff
git add .
git commit -m "update submodule add b.txt"
git push origin master
cd ..
```

### 4. 更新子模块

更新子模块的时候要注意子模块的分支默认不是master。
方法一，先pull父项目，然后执行```git submodule update```，注意moduleA的分支始终不是master。

```bash
cd project2
git pull
git submodule update
cd ..
```

方法二，先进入子模块，然后切换到需要的分支，这里是master分支，然后对子模块pull，这种方法会改变子模块的分支。

```bash
cd project3/moduleA
git checkout master
cd ..
git submodule foreach git pull
cd ..
```

### 5. 删除子模块

网上有好多用的是下面这种方法

```bash
git rm --cached moduleA
rm -rf moduleA
rm .gitmodules
vim .git/config
```

删除submodule相关的内容，例如下面的内容

```bash
[submodule "moduleA"]      url = /Users/nick/dev/nick-doc/testGitSubmodule/moduleA.git
```

然后提交到远程服务器

```bash
git add .
git commit -m"remove submodule"
```

但是我自己本地实验的时候，发现用下面的方式也可以，服务器记录的是.gitmodules和moduleA，本地只要用git的删除命令删除moduleA，再用git status查看状态就会发现.gitmodules和moduleA这两项都已经改变了，至于.git/config，仍会记录submodule信息，但是本地使用也没发现有什么影响，如果重新从服务器克隆则.git/config中不会有submodule信息。

```bash
git rm moduleA
git status
git commit -m"remove submodule"
git push origin master
```