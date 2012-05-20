---
layout: post
title: "我是如何在Linux(Ubuntu)上工作的？"
category: linux
tags: 
 - Linux
 - Ubuntu
 - 工作
---

这篇文章是我一直想要写的，因为其他事情的优先级高于本文所以只能一拖再拖，最终我安静的坐下来完成了它。

我为什么选择使用Linux呢，我又是怎么使用Linux的呢？本文将一一道来。

有从Windows迁移到Linux的同学最好的一个办法：**删除Windows，安装Linux**。

## 1.选择Linux

从Windows环境迁移到Linux已经一年多了，早已适应Linux，作为一个Linuxer我想说说我的迁移过程以及平常怎么用Linux工作(主要是Java开发)。

Linux环境的确让我眼前一亮，原来系统可以这么用，Shell可以这么强大，原来很多操作可以不用鼠标。。。

迁移原因有几点：

1. 很多服务器都是安装的Linux系统
2. Linux有非常强大的Shell功能
3. Linux相对Windows来说比较稳定
4. 像_Geeker_一样工作

## 2.从Windows迁移

迁移工作从选择Linux发行版开始、备份数据、安装发行版、配置工作环境等几个步骤。

	当然如果你需要玩游戏（例如Dota），又不想用wine虚拟Windows环境，那么你可以选择保留windows作双系统，Linux会自动识别爽系统（鄙视Win）。

## 2.1 选择Linux发行版本

据不完全统计目前Linux的发行版本有上千中，因为Linux是开源的任何人、任何组织都可以创建自己的OS，你完全可以把一个Linux发行版修改一个名称作为自己的个人OS，在Linux世界里我们享受自由。

下面介绍几个目前使用比较广泛的Linux桌面发行版本：

### 2.1.1 Ubuntu

Ubuntu是2004年9月首次公布的。可以说是目前最流行的发行版，被广泛的Linuxer所选择。

**主页**: http://www.ubuntu.com/

有易用的**Unity**桌面环境。

每5年发布一个LTS（长期支持版本）版本，本文就是在Ubuntu 12.04 LTS上撰写。

很有意思的是Ubuntu官方为了能让用户体验节目风格，专门用HTML5技术做了一个体验网页，效果和真实环境一样，体验地址：[http://www.ubuntu.com/tour/en/](http://www.ubuntu.com/tour/en/)

### 2.1.2. Fedora

**主页**: http://fedoraproject.org/

基于**Red Hat**的发行版本。

使用gnome-shell作为桌面环境。

### 2.1.3 其他发行版

除了这两个主流的桌面环境之外还有基于Ubuntu扩展的两个发行版本：

1. [Linux Mint](http://linuxmint.com/)，改进了Gnome-Shell，可以使用Gnome2或者Gnome3的桌面风格。

2. [Linux Deepin](http://www.linuxdeepin.com/)，**国人**发起的项目，同样是基于Ubuntu的发行版本，截图欣赏：[http://www.linuxdeepin.com/feature#software](http://www.linuxdeepin.com/feature#software)。

3. 另外Ubuntu还有[KUbuntu](http://www.kubuntu.org/)、[LUbuntu](http://lubuntu.net/)

### 2.1.4 我的选择

我从Ubuntu 9.10版本开始体验Ubuntu，后来的11.04正式作为工作环境使用，也正是在这个版本中发布了Unity风格桌面环境，陆续更新了几个版本之后Unity的功能越来越多也同时可以支持更多的自定义功能。

这里有一点要说说关于Ubuntu的中文名称：业界最多的中文使用名称为**乌班图**，在_**12.04 LTS**_这个版本中正式定义了中文名称：**友邦托**。

### 2.2 系统分区

首先你要准备好空白分区，然后根据硬盘大小再自己计算划分，说一下我的分区方式：

* 根分区(**/**)，一般我设置为20G，安装一些软件配置

* 交换分区(**Swap**)，我内存为6G，设置了2G

* Home分区(**/home**)，剩下的全部给home分区，保存用户自己的数据

这样的好处就是当升级系统的时候只要把**根分区**备份格式化即可，用户数据还是保留，和windows的安装一样（只格式化C盘，其他盘不动）。

## 3.桌面环境及软件

### 3.1 Shell的选择

一般的Linux发行版本都会默认使用[Bash](http://www.gnu.org/software/bash/)，我刚刚开始的时候也是使用Bash作为默认Shell；使用过程中有遇到了一些使用上不太舒服的地方，例如：自动完成功能不尽人意等；关于Bash和Zsh的区别我就不废话了，网络上这样的文章一大堆，本文给出一个我接触到[Zsh](http://www.zsh.org)时看到的文章，也是作为默认配置的来源：[终极Shell——Zsh](http://linuxtoy.org/archives/zsh.html)。

Zsh的确好用，但是配置起来比较复杂，之后又在Github上发现了[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)，oh-my-zsh项目是为了解决zsh的繁琐配置而发起的，例如要启用Git仓库的状态显示功能，直接在_.zshrc_文件中添加git到_plugin_配置即可。

对于oh-my-zsh的安装配置请参考本博客的文章：[我最喜爱的工具-oh-my-zsh](http://www.kafeitu.me/shell/2012/03/25/oh-my-zsh.html)

我的zsh(oh-my-zsh)配置分享：
<pre class="brush:shell">
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="kafeitu"

# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Comment this out to disable weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# hashs
#路径别名 进入相应的路径时只要 cd ~xxx
hash -d WWW="/home/lighttpd/html"
hash -d ARCH="/mnt/arch"
hash -d PKG="/var/cache/pacman/pkg"
hash -d E="/etc/env.d"
hash -d C="/etc/conf.d"
hash -d I="/etc/rc.d"
hash -d X="/etc/X11"
hash -d BK="/home/r00t/config_bak"
hash -d down="/home/henryyan/Downloads"
hash -d ss4="/home/henryyan//work/sources/springside/springside4"
hash -d aia="/home/henryyan/work/books/activiti-in-action"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(ant mvn svn git git-flow)

source $ZSH/oh-my-zsh.sh
source ~/.bash_aliases
source /etc/envs

# Customize to your needs...
export CXF_HOME=/home/henryyan/work/sources/cxf/apache-cxf-2.6.0
export MULE_HOME=/home/henryyan/work/sources/mule/mule-standalone-3.2.0
export PATH=$PATH:$CXF_HOME/bin:$MULE_HOME/bin
</pre>

其中使用hash定义的别名有两种办法进入：

* cd ~foo

* 直接输入foo回车即可

### 3.2 必要软件安装与配置

很多人在计划迁移Linux环境的时候问的最多的问题就是在Linux下面有和windows对应的软件吗？我的回答是：**有**，而且有很多软件比Win的还好用。

关于选择什么软件，如何配置，请移步参考：

* [Ubuntu 12.04 配置指南](http://www.bentutu.com/2012/04/ubuntu-12-04-configure-guide.html/)

* [安装 Ubuntu 12.04 (Precise) 之后](http://wowubuntu.com/after-install-ubuntu-precise.html)

* [Ubuntu 12.04安装完全指南](http://www.onesl.com/web/ylsh/2012031801.html)

呵呵，大家都很热心……

### 3.3 我推荐的一些软件

* 多线程下载：sudo apt-get install axel，必备

* 系统服务管理：sudo apt-get install sysv-rc-conf，必备；在11.10版本的时候还有一个rcconf，但是12.04中不能用了

* Shell下面的浏览器：sudo apt-get install elinks，有时有用……

* Shell下面音乐播放器：sudo apt-get install cmus，我很少用GUI界面的音乐播放器；我在IPOD上安装了一个软件用来SSH登录我的笔记本，早上在床上用IPOD控制电脑播放音乐……^_^

* 任务管理器：sudo apt-get install htop，比自带的top好用

* 另类终端guake，可以一键隐藏/显示，适用于一些后台任务（我的cmus就是用guake运行的）：sudo apt-get install guake

## 4.工作环境

上面的软件列表文章提到的是作为一个普通用户迁移需要使用的软件和一些配置，本章节说说作为一个Developer的开发环境。

我一直从事Java开发（截至到本文发布时整5年时间），使用的开发工具有：Eclipse、Git、Maven、Ant、Shell、Firefox、Virtualbox等等

### 4.1 环境变量配置

一般会把环境变量配置在**/etc/profile**或者**/etc/environment**中，我创建了单独的**/etc/envs**文件用来保存环境变量，然后在**/etc/profile**的尾部**source /etc/envs**即可。

我的/etc/envs配置：
<pre class="brush:shell">
export ANT_HOME=/opt/devtools/ant/apache-ant
export M3_HOME=/opt/devtools/maven/apache-maven
export JAVA_HOME=/opt/devtools/jdk/jdk1.6
export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:$LD_LIBRARY_PATH
export ORACLE_SID=XE
export NLS_LANG=AMERICAN_AMERICA.ZHS16GBK
export PATH=$PATH:$JAVA_HOME/bin:$M3_HOME/bin:$ORACLE_HOME:$ORACLE_HOME/bin:$ANT_HOME/bin
</pre>

### 4.1.1 环境变量规则

我一般都会为应用创建一个软链接，这样当有新版本发布的时候更改软链接的target即可生效。例如：
<pre class="brush:shell">
➜ henryyan@hy-hp  /opt/devtools/maven  ls -l
total 7756
lrwxrwxrwx 1 root devtools      18  4月 29 01:11 apache-maven -> apache-maven-3.0.4
dr-xrwxr-x 6 root devtools    4096  4月 29 01:11 apache-maven-3.0.3
-r-xrwxr-x 1 root devtools 3054807  4月 29 01:11 apache-maven-3.0.3-bin.tar.gz
-r-xrwxr-x 1 root devtools      26  4月 29 01:11 apache-maven-3.0.3-bin.tar.gz:Zone.Identifier
dr-xrwxr-x 6 root devtools    4096  4月 29 01:11 apache-maven-3.0.4
-r-xrwxr-x 1 root devtools 4873043  4月 29 01:11 apache-maven-3.0.4-bin.tar.gz
</pre>

### 4.2 配置Java

JDK下载页面：[http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

在下载页面选择**.bin**结尾的文件下载，然后放到安装目录，例如：/opt/devtools/java
<pre class="brush:bash">
sh jdk-6u31-linux-x64.bin
ln -s jdk1.6.0_31 jdk1.6
</pre>

安装完成后需要设置默认的JDK：
<pre class="brush:bash">
sudo update-alternatives --install "/usr/bin/java" "java" "/opt/devtools/jdk/jdk1.6/bin/java" 1
</pre>

如果要安装JDK7请移步：[Ubuntu 12.04下配置JDK7](http://www.linuxidc.com/Linux/2012-05/59858.htm)

### 4.3 配置Ant
<pre class="brush:bash">
cd /opt/devtools/ant
axel -a http://labs.renren.com/apache-mirror/ant/binaries/apache-ant-1.8.3-bin.tar.gz
tar xzvf apache-ant-1.8.3-bin.tar.gz
ln -s apache-ant-1.3.2 ant
</pre>

### 4.4 配置Maven

<pre class="brush:shell">
cd /opt/devtools/ant
axel -a http://labs.renren.com/apache-mirror/maven/binaries/apache-maven-3.0.4-bin.tar.gz
tar xzvf apache-maven-3.0.4-bin.tar.gz
ln -s apache-maven-3.0.4 maven
</pre>

### 4.5 安装、配置Git

请移步之前的博文：[在Ubuntu(Debian)上安装最新版Git](http://www.kafeitu.me/git/2012/04/10/install-lastest-git-on-ubuntu.html)

Git的CLI交互方式已经很好用了，而且自带GUI工具；如果不差钱可以购买[SmartGit](http://www.syntevo.com/smartgit/index.html)；Eclipse中可以安装Egit（我仅仅用来查看文件的修改状态、还原文件的修改）。

另外再推荐一个文本模式的Git浏览器工具-**Tig**：sudo apt-get install tig

### 4.6 安装Eclipse

我们公司的主要业务就是开发各种B/S的管理系统，例如ERP、OA等；Eclipse专门有一个版本针对JAVAEE开发人员--Eclipse IDE for Java EE Developers,。

**下载地址**：[http://www.eclipse.org/downloads/](http://www.eclipse.org/downloads/)

关于插件方面就不介绍了，有需要的可以交流。

	新版的Eclipse自带了Maven插件，但是没有安装**Maven Integration WTP**，需要自己手动安装。

有几个插件推荐：

* Path Tools：[http://marketplace.eclipse.org/content/path-tools](http://marketplace.eclipse.org/content/path-tools)，快速打开指定目录、文件的终端窗口

* viPlugin：[http://marketplace.eclipse.org/content/viplugin](http://marketplace.eclipse.org/content/viplugin)，VIM控必备

### 4.7 安装数据库

数据库用的最多的就是Mysql和Oracle，Mysql安装相对来说简单的多，但是Oracle就有点麻烦了。

#### 4.7.1 Mysql

<pre class="brush:shell">
sudo apt-get install mysql-server
</pre>

#### 4.7.2 Oracle

为了节省性能、安装方便我们团队的笔记本上都安装的Oracle XE 11.2 BETA版本，但是Oracle官方没有DEB包，只有RPM版本所以就使用工具把RPM转换为DEB格式，已经上传到Ubuntu One上，下载地址：[http://ubuntuone.com/3PcJd18MAIMp700SOAIDhz](http://ubuntuone.com/3PcJd18MAIMp700SOAIDhz)。

	顺便说一下我使用Ubuntu One第一版的时候很是郁闷，上传速度慢，占用内存过大（超过4G），所以放弃；不过在Ubuntu 12.04 LTS版本中使用QT从重写了界面性能提升很多而且稳定，值得使用。

下载完成之后就可以安装了，不过在安装之前先设置一些环境变量到**/etc/profile**（如果你和我一样创建了/etc/envs那就添加到这个文件中）：
<pre class="brush:shell">
export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:$LD_LIBRARY_PATH
export ORACLE_SID=XE
export NLS_LANG=AMERICAN_AMERICA.ZHS16GBK
</pre>

开始安装：
<pre class="brush:shell">
sudo apt-get install libaio1
sudo dpkg -i oracle-xe_11.2.0-1.5_amd64.deb
</pre>

在安装的过程中会提示输入**sys、system**的密码，请务必记住！

安装完成之后会提示运行配置oracle的命令：
<pre class="brush:shell">
sudo /etc/init.d/oracle-xe configure
</pre>
根据提示设置一些端口号之类的参数即可完成安装。

##### 4.7.2.1 让sqlplus更好用

默认sqlplus中按方向键会显示回显字符，解决的办法安装**rlwrap**：
<pre class="brush:shell">
sudo apt-get install rlwrap
</pre>
然后在shell中配置sqlplus的别名：bash(.bashrc), zsh(.zshrc)
<pre class="brush:shell">
alias sqlplus='rlwrap sqlplus'
</pre>

##### 4.7.2.2 解决中文乱码问题

请参考我的Evernote：[更改Oracle字符集](https://www.evernote.com/shard/s22/sh/dd2125b1-c9c2-4833-93ee-5e90d7b765bf/a1f3036d30b0ecfaaacf149a1702639f)

##### 4.7.2.3 Oracle可视化客户端-SqlDeveloper

SqlDeveloper是Oracle使用Java开发的Oracle客户端程序，可以和Windows的PL/SQL Developer媲美，而且不需要安装 Oracle Client，唯一不足就是占用内存大。

**下载**：[http://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html](http://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html)

下载完成之后解压运行目录中的**sqldeveloper.sh**即可。

#### 4.7.2.4 SqlDeveloper中文乱码问题

苦B呀，怎么那么多乱码……那也要解决：[https://www.evernote.com/shard/s22/sh/cdfacf4e-e5db-4686-9e0e-d8203c13b670/a861d9c1851ae8e6027fd86e763ab348](https://www.evernote.com/shard/s22/sh/cdfacf4e-e5db-4686-9e0e-d8203c13b670/a861d9c1851ae8e6027fd86e763ab348)

乱码问题在于字体，你可以把Windows下面的字体复制过来，或者直接使用系统自带的开源字体**文泉雅黑**。

### 4.8 简单配置应用为服务

在开发的时候会使用Tomcat、Nexus等服务，启动服务的时候每次都要进入指定目录运行启动命令，把这些东西作为系统级别的Service再也不用这么麻烦了。

例如我本地安装的Nexus配置(/etc/init.d/nexus)：

<pre class="brush:shell">
#!/bin/bash
# nexus auto-start
#
# description: Auto-start Nexus
# processname: nexus
# pidfile: /var/run/nexus.pid

case $1 in
start)
   	sudo /home/nexus/nexus-2.0.4-1/bin/jsw/linux-x86-64/nexus start
    ;;
stop)
    sudo /home/nexus/nexus-2.0.4-1/bin/jsw/linux-x86-64/nexus stop
    ;;
restart)
	sudo /home/nexus/nexus-2.0.4-1/bin/jsw/linux-x86-64/nexus restart
    ;;
console)
   	sudo /home/nexus/nexus-2.0.4-1/bin/jsw/linux-x86-64/nexus console
    ;;
*)
    echo 'Usage:nexus start|stop|restart|console'
    ;;
esac

exit 0
</pre>

然后再使用前面介绍的**sysv-rc-conf**设置为自启动。

### 4.9 为应用设置启动图标

Eclipse、SqlDeveloper都是通过解压方式安装的，不能自动加入到Unity的Luncher中，添加一个文件即可实现，例如我的Eclpse配置：

** sudo vi /usr/share/applications/eclipse-javaee.desktop**

内容如下：
<pre class="brush:shell">
[Desktop Entry]
Name=Eclipse With JAVAEE
Comment=Eclipse With JAVAEE
Exec=/opt/devtools/eclipse/eclipse-jee-indigo/eclipse
Icon=eclipse
Terminal=false
Type=Application
StartupNotify=true
Name[en_US]=Eclipse With JAVAEE
Comment[en_US]=Eclipse With JAVAEE
</pre>

其中的**Icon**属性是图标名称，可以指定到觉得路径，我这样的配置方式是使用系统默认提供的图标。

### 4.10 浏览器

差点忘记了，这么重要的世界之窗……

我们的系统都是基于jQuery的，所以对于多个浏览器之间差异不大，在开发阶段先用Firefox调试（Firebug）；因为客户的环境都是IE(无视IE6)，当在Firefox下面调试完成一个功能模块之后在虚拟机环境中使用IE调试一下就可以了，所以虚拟机不是一直打开的。

### 4.11 安装系统后

分享一下我的Evernote的《安装、配置Ubuntu》：[https://www.evernote.com/shard/s22/sh/9892aab0-8cd9-4998-95a7-4ef4ee34c2ee/33b425a0953d9ba64a822dc219b43586](https://www.evernote.com/shard/s22/sh/9892aab0-8cd9-4998-95a7-4ef4ee34c2ee/33b425a0953d9ba64a822dc219b43586)

不过记得有点乱，不知道是什么软件Google之

## 5.学习Linux

工欲善其事，必先利其器……

### 5.1 Shell

Linux强大的地方在于Shell，几乎无所不能，这个必须要学习，市面上有很多这样的书籍可以选择，我保证你学会了Shell命令之后再也不想碰_有点软_公司的CMD了。

基本的操作学会之后可以试着写写脚本，当你上司让你做一个任务的时候你只要运行一下脚本就可以在一旁喝着咖啡等着任务结束。

闲暇有空的时候多浏览一下这个网站：[http://www.commandlinefu.com/commands/browse/sort-by-votes](http://www.commandlinefu.com/commands/browse/sort-by-votes)，在这里你会有意外的收获。

### 5.2 编辑器

是的，Linux有两个神奇（vim、emacs），我绝对不会讨论两者的优缺点，萝卜白菜各有所爱，我一开始就直接使用的VIM，现在也是……

PS：我的博文直接在VIM下面完成，然后git命令提交到github就完成了博文发表。

### 5.3 活跃的社区、博客

Ubuntu的社区可以说是最活跃的，人数也是最多的。

你有问题可以到[askubuntu.com](http://askubuntu.com)提问题。

国内的社区、博客也有很多，可以作为你的Google Reader的一个RSS源：

* [www.linuxidc.com](www.linuxidc.com)

* [http://www.lupaworld.com/](http://www.lupaworld.com/)

* [www.bentutu.com|笨兔兔](www.bentutu.com)

国外比较优秀的社区、博客：

* [http://www.webupd8.org/](http://www.webupd8.org/)

* [http://www.omgubuntu.co.uk/](http://www.omgubuntu.co.uk/)

## 6.结束语

浊文一篇，目的只有一个：让更多人有理由相信可以迁移开发环境到Linux。

内容不足之处可以留言、交流。
