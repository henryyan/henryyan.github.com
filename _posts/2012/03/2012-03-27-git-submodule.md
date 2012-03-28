---
layout: post
title: "Git Submoudle总结"
category: git
tags: 
 - scm
 - git
 - submodule
---

自从看了蒋鑫的《[Git权威指南](http://book.douban.com/subject/6526452/)》之后就开始使用Git Submodule功能，团队也都熟悉了怎么使用，多个子系统（模块）都能及时更新到最新的公共资源，把使用的过程以及经验和容易遇到的问题分享给大家。

## 1.对于公共资源各种程序员的处理方式

每个公司的系统都会有一套统一的系统风格，或者针对某一个大客户的多个系统风格保持统一，而且如果风格改动后要同步到多个系统中；这样的需求几乎每个开发人员都遇到，下面看看各个层次的程序员怎么处理：

假如对于系统的风格需要几个目录：css、images、js。

* **普通**程序员，把最新版本的代码逐个复制到每个项目中，如果有N个项目，那就是要复制**N x 3**次；如果漏掉了某个文件夹没有复制…@（&#@#。

* **文艺**程序员，使用Git Submodule功能，执行：**git submodule update**，然后冲一杯咖啡悠哉的享受着。

----
引用一段《[Git权威指南](http://book.douban.com/subject/6526452/)》的话：
项目的版本库在某些情况虾需要引用其他版本库中的文件，例如公司积累了一套常用的函数库，被多个项目调用，显然这个函数库的代码不能直接放到某个项目的代码中，而是要独立为一个代码库，那么其他项目要调用公共函数库该如何处理呢？分别把公共函数库的文件拷贝到各自的项目中会造成冗余，丢弃了公共函数库的维护历史，这显然不是好的方法。

## 2.开始学习Git Submodule

“工欲善其事，必先利其器”！

既然文艺程序员那么轻松就搞定了，那我们就把过程一一道来。

**说明**：本例采用**两个项目**以及**两个公共类库**演示对submodule的操作。因为在一写资料或者书上的例子都是一个项目对应1～N个lib，但是实际应用往往并不是这么简单。

### 2.1 创建Git Submodule测试项目

#### 2.1.1 准备环境
<pre class="brush: shell">
➜ henryyan@hy-hp  ~  pwd
/home/henryyan
mkdir -p submd/repos
</pre>

创建需要的本地仓库：
<pre class="brush: shell">
cd ~/submd/repos
git --git-dir=lib1.git init --bare
git --git-dir=lib2.git init --bare
git --git-dir=project1.git init --bare
git --git-dir=project2.git init --bare
</pre>

初始化工作区：
<pre class="brush: shell">
mkdir ~/submd/ws
cd ~/submd/ws
</pre>

#### 2.1.2 初始化项目

初始化project1：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws  git clone ../repos/project1.git 
Cloning into project1...
done.
warning: You appear to have cloned an empty repository.

➜ henryyan@hy-hp  ~/submd/ws  cd project1
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) echo "project1" > project-infos.txt
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ ls
project-infos.txt

➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ git add project-infos.txt 
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ git status
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   (use "git rm --cached <file>..." to unstage)
#
#	new file:   project-infos.txt
#
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ git commit -m "init project1"
[master (root-commit) 473a2e2] init project1
 1 files changed, 1 insertions(+), 0 deletions(-)
 create mode 100644 project-infos.txt
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) git push origin master
Counting objects: 3, done.
Writing objects: 100% (3/3), 232 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To /home/henryyan/submd/ws/../repos/project1.git
 * [new branch]      master -> master
</pre>

初始化project2：
<pre class="brush: shell">

➜ henryyan@hy-hp  ~/submd/ws/project1 cd ..
➜ henryyan@hy-hp  ~/submd/ws  git clone ../repos/project2.git 
Cloning into project2...
done.
warning: You appear to have cloned an empty repository.

➜ henryyan@hy-hp  ~/submd/ws  cd project2
➜ henryyan@hy-hp  ~/submd/ws/project2 git:(master) echo "project2" > project-infos.txt
➜ henryyan@hy-hp  ~/submd/ws/project2 git:(master) ✗ ls
project-infos.txt

➜ henryyan@hy-hp  ~/submd/ws/project2 git:(master) ✗ git add project-infos.txt 
➜ henryyan@hy-hp  ~/submd/ws/project2 git:(master) ✗ git status
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   (use "git rm --cached <file>..." to unstage)
#
#	new file:   project-infos.txt
#
➜ henryyan@hy-hp  ~/submd/ws/project2 git:(master) ✗ git commit -m "init project2"
[master (root-commit) 473a2e2] init project2
 1 files changed, 1 insertions(+), 0 deletions(-)
 create mode 100644 project-infos.txt
➜ henryyan@hy-hp  ~/submd/ws/project2 git:(master) git push origin master
Counting objects: 3, done.
Writing objects: 100% (3/3), 232 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To /home/henryyan/submd/ws/../repos/project2.git
 * [new branch]      master -> master
</pre>

#### 2.1.3 初始化公共类库

初始化公共类库lib1：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws  git clone ../repos/lib1.git 
Cloning into lib1...
done.
warning: You appear to have cloned an empty repository.
➜ henryyan@hy-hp  ~/submd/ws  cd lib1 
➜ henryyan@hy-hp  ~/submd/ws/lib1 git:(master) echo "I'm lib1." > lib1-features
➜ henryyan@hy-hp  ~/submd/ws/lib1 git:(master) ✗ git add lib1-features 
➜ henryyan@hy-hp  ~/submd/ws/lib1 git:(master) ✗ git commit -m "init lib1"
[master (root-commit) c22aff8] init lib1
 1 files changed, 1 insertions(+), 0 deletions(-)
 create mode 100644 lib1-features
➜ henryyan@hy-hp  ~/submd/ws/lib1 git:(master) git push origin master
Counting objects: 3, done.
Writing objects: 100% (3/3), 227 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To /home/henryyan/submd/ws/../repos/lib1.git
 * [new branch]      master -> master
</pre>

初始化公共类库lib2：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/lib1 git:(master) cd ..
➜ henryyan@hy-hp  ~/submd/ws  git clone ../repos/lib2.git 
Cloning into lib2...
done.
warning: You appear to have cloned an empty repository.
➜ henryyan@hy-hp  ~/submd/ws  cd lib2 
➜ henryyan@hy-hp  ~/submd/ws/lib2 git:(master) echo "I'm lib2." > lib2-features
➜ henryyan@hy-hp  ~/submd/ws/lib2 git:(master) ✗ git add lib2-features 
➜ henryyan@hy-hp  ~/submd/ws/lib2 git:(master) ✗ git commit -m "init lib2"
[master (root-commit) c22aff8] init lib2
 1 files changed, 1 insertions(+), 0 deletions(-)
 create mode 100644 lib2-features
➜ henryyan@hy-hp  ~/submd/ws/lib2 git:(master) git push origin master
Counting objects: 3, done.
Writing objects: 100% (3/3), 227 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To /home/henryyan/submd/ws/../repos/lib2.git
 * [new branch]      master -> master
</pre>

### 2.2 为主项目添加Submodules

#### 2.2.1 为project1添加lib1和lib2
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/lib2 git:(master) cd ../project1 
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ls
project-infos.txt
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) git submodule add ~/submd/repos/lib1.git libs/lib1
Cloning into libs/lib1...
done.
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ git submodule add ~/submd/repos/lib2.git libs/lib2
Cloning into libs/lib2...
done.
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ ls
libs  project-infos.txt
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ ls libs 
lib1  lib2

➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ git status 
# On branch master
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#	new file:   .gitmodules
#	new file:   libs/lib1
#	new file:   libs/lib2
#

# 查看一下公共类库的内容

➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) cat libs/lib1/lib1-features 
I'm lib1.
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) cat libs/lib2/lib2-features
I'm lib2.
</pre>
好了，到目前为止我们已经使用**git submodule add**命令为**project1**成功添加了两个公共类库（lib1、lib2），查看了当前的状态发现添加了一个新文件(**.gitmodules**)和两个文件夹(libs/lib1、libs/lib2)；那么新增的**.gitmodules**文件是做什么用的呢？我们查看一下文件内容便知晓了：
<pre class="brush: shell">
n@hy-hp  ~/submd/ws/project1 git:(master) ✗ cat .gitmodules 
[submodule "libs/lib1"]
	path = libs/lib1
	url = /home/henryyan/submd/repos/lib1.git
[submodule "libs/lib2"]
	path = libs/lib2
	url = /home/henryyan/submd/repos/lib2.git
</pre>
原来如此，**.gitmodules**记录了每个submodule的引用信息，知道在当前项目的位置以及仓库的所在。

好的，我们现在把更改提交到仓库。
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) ✗ git commit -a -m "add submodules[lib1,lib2] to project1"
[master 7157977] add submodules[lib1,lib2] to project1
 3 files changed, 8 insertions(+), 0 deletions(-)
 create mode 100644 .gitmodules
 create mode 160000 libs/lib1
 create mode 160000 libs/lib2

➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) git push
Counting objects: 5, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 491 bytes, done.
Total 4 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (4/4), done.
To /home/henryyan/submd/ws/../repos/project1.git
   45cbbcb..7157977  master -> master
</pre>

	假如你是第一次引入公共类库的开发人员，那么项目组的其他成员怎么Clone带有Submodule的项目呢，下面我们再clone一个项目讲解如何操作。

### 2.3 Clone带有Submodule的仓库

模拟开发人员B……
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1 git:(master) cd ~/submd/ws
➜ henryyan@hy-hp  ~/submd/ws  git clone ../repos/project1.git project1-b
Cloning into project1-b...
done.
➜ henryyan@hy-hp  ~/submd/ws  cd project1-b 
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) git submodule 
-c22aff85be91eca442734dcb07115ffe526b13a1 libs/lib1
-7290dce0062bd77df1d83b27dd3fa3f25a836b54 libs/lib2
</pre>
看到submodules的状态是hash码和文件目录，但是注意前面有一个减号：**-**，含义是该子模块还没有检出。

OK，检出project1-b的submodules……
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) git submodule init
Submodule 'libs/lib1' (/home/henryyan/submd/repos/lib1.git) registered for path 'libs/lib1'
Submodule 'libs/lib2' (/home/henryyan/submd/repos/lib2.git) registered for path 'libs/lib2'
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) git submodule update
Cloning into libs/lib1...
done.
Submodule path 'libs/lib1': checked out 'c22aff85be91eca442734dcb07115ffe526b13a1'
Cloning into libs/lib2...
done.
Submodule path 'libs/lib2': checked out '7290dce0062bd77df1d83b27dd3fa3f25a836b54'
</pre>

	读者可以查看：.git/config文件的内容，最下面有submodule的注册信息！

验证一下类库的文件是否存在：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) cat libs/lib1/lib1-features libs/lib2/lib2-features 
I'm lib1.
I'm lib2.
</pre>

	上面的两个命令(git submodule init & update)其实可以简化，后面会讲到！

### 2.3 修改Submodule

我们在开发人员B的项目上修改Submodule的内容。

先看一下当前Submodule的状态：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) cd libs/lib1
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1  git status
# Not currently on any branch.
nothing to commit (working directory clean)
</pre>
为什么是**Not currently on any branch**呢？不是应该默认在**master**分支吗？别急，一一解答！

Git对于Submodule有特殊的处理方式，在一个主项目中引入了Submodule其实Git做了3件事情：

* 记录引用的仓库

* 记录主项目中Submodules的目录位置

* 记录引用Submodule的**commit id**

在**project1**中push之后其实就是更新了引用的commit id，然后project1-b在clone的时候获取到了submodule的commit id，然后当执行**git submodule update**的时候git就根据**gitlink**获取submodule的commit id，最后获取submodule的文件，所以clone之后不在任何分支上；但是master分支的commit id和HEAD保持一致。

查看~/submd/ws/project1-b/libs/lib1的引用信息：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1  cat .git/HEAD 
c22aff85be91eca442734dcb07115ffe526b13a1
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1  cat .git/refs/heads/master               
c22aff85be91eca442734dcb07115ffe526b13a1
</pre>

现在我们要修改lib1的文件需要先切换到**master**分支：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1  git checkout master
Switched to branch 'master'
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1 git:(master) echo "add by developer B" >> lib1-features
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1 git:(master) ✗ git commit -a -m "update lib1-features by developer B"
[master 36ad12d] update lib1-features by developer B
 1 files changed, 1 insertions(+), 0 deletions(-)
</pre>

在主项目中修改Submodule提交到仓库稍微繁琐一点，在**git push**之前我们先看看**project1-b**状态：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) ✗ git status
# On branch master
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
#	modified:   libs/lib1 (new commits)
#
no changes added to commit (use "git add" and/or "git commit -a")
</pre>

**libs/lib1 (new commits)**状态表示**libs/lib1**有新的提交，这个比较特殊，看看**project1-b**的状态：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) ✗ git diff
diff --git a/libs/lib1 b/libs/lib1
index c22aff8..36ad12d 160000
--- a/libs/lib1
+++ b/libs/lib1
@@ -1 +1 @@
-Subproject commit c22aff85be91eca442734dcb07115ffe526b13a1
+Subproject commit 36ad12d40d8a41a4a88a64add27bd57cf56c9de2
</pre>

从状态中可以看出**libs/lib1**的commit id由原来的**c22aff85be91eca442734dcb07115ffe526b13a1**更改为**36ad12d40d8a41a4a88a64add27bd57cf56c9de2**

<pre>
注意：如果现在执行了git submodule update操作那么libs/lib1的commit id又会还原到c22aff85be91eca442734dcb07115ffe526b13a1，

这样的话刚刚的修改是不是就丢死了呢？不会，因为修改已经提交到了master分支，只要再git checkout master就可以了。
</pre>

现在可以把**libs/lib1**的修改提交到仓库了：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) ✗ cd libs/lib1
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1 git:(master) git push
Counting objects: 5, done.
Writing objects: 100% (3/3), 300 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To /home/henryyan/submd/repos/lib1.git
   c22aff8..36ad12d  master -> master
</pre>

现在仅仅只完成了一步，下一步要提交**project1-b**引用submodule的commit id：
<pre class="brush: shell">
➜ henryyan@hy-hp  ~/submd/ws/project1-b/libs/lib1 git:(master) cd ~/submd/ws/project1-b
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) ✗ git add -u
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) ✗ git commit -m "update libs/lib1 to lastest commit id"
[master c96838a] update libs/lib1 to lastest commit id
 1 files changed, 1 insertions(+), 1 deletions(-)
➜ henryyan@hy-hp  ~/submd/ws/project1-b git:(master) git push
Counting objects: 5, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 395 bytes, done.
Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
To /home/henryyan/submd/ws/../repos/project1.git
   7157977..c96838a  master -> master
</pre>

### 2.4 更新主项目的Submodules

### 2.5 让团队成员更新Submodules

### 2.6 新进员工加入团队，一次性Clone项目和Submodules

一般人使用的时候都是使用如下命令：
<pre class="brush: shell">
git clone /path/to/repos/foo.git
git submodule init
git submodule update
</pre>

	新员工不耐烦了，嘴上不说但是心里想：怎么那么麻烦？

上面的命令简直弱暴了，直接一行命令搞定：
<pre class="brush: shell">git clone --recursive /path/to/repos/foo.git</pre>

–**recursive**参数的含义：可以在clone项目时同时clone关联的submodules

## 3.移除Submodule
