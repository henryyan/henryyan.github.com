--- 
layout: post
title: "Ubuntu安装ORACLE-XE"
wordpress_id: 1529
wordpress_url: http://www.wsria.com/?p=1529
date: 2011-07-15 15:52:49 +08:00
tags: 
 - ubuntu
 - oracle-xe
---
最近开发环境迁移到了Linux的发行版Ubuntu，但是目前正在开发的系统是使用的Oracle数据库，从网上找了一对资料都是很麻烦的，又是乱码又是一堆的配置，后来google到原来有一个ubuntu版本的……
<h3>环境说明</h3>
操作系统：Ubuntu 11.04 X86
<h3>一、安装Oracle-Xe</h3>
Oracle 为 Ubuntu 用户设立了专门的 apt 源服务器，运行下面的命令：
<pre>
sudo apt-add-repository "deb http://oss.oracle.com/debian unstable main non-free"
</pre>
这时不要急于更新，还要将该源服务器的公钥添加到本地密钥库中，先下载公钥 ：
<pre>
sudo wget http://oss.oracle.com/el4/RPM-GPG-KEY-oracle
</pre>
<!--more-->
下载完成后，添加到密钥库中
<pre>
sudo apt-key add RPM-GPG-KEY-oracle
</pre>
现在我们可以执行更新的命令了
<pre>
sudo apt-get update
</pre>
更新完毕候从仓库中搜索一下oracle相关的软件：
<pre>
sudo apt-cache search oracle
</pre>
看到三个我们需要的结果：
<pre>
oracle-xe - Oracle Database 10g Express Western European Edition
oracle-xe-client - Oracle Client 10g Express Edition
oracle-xe-universal - Oracle Database 10g Express Universal Edition
</pre>
因为是开发需要所以我安装了<b>oracle-xe</b>，运行命令：
<pre>
sudo apt-get install libaio1
sudo apt-get install oracle-xe
</pre>
到此安装完成，下面的配置才是关键的。
<h3>二、配置Oracle</h3>
在/etc/profile中添加oracle相关配置：
<pre>
sudo vi /etc/profile
</pre>
添加如下内容：
<pre>
# oracle settings
export ORACLE_HOME=/usr/lib/oracle/xe/app/oracle/product/10.2.0/server
export ORACLE_SID=XE
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:$LD_LIBRARY_PATH 
export TNS_ADMIN=/usr/lib/oracle
</pre>
在配置的过程中遇到了问题，因为我参考的资料没有设置<strong>ORACLE_SID</strong>所以导致数据不能访问，安装后默认的SID是<strong>XE</strong>；
<h3>三、配置TNS</h3>
<pre>
sudo vi /usr/lib/oracle/tnsnames.ora
</pre>
添加如下内容：
<pre>
orcl =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = XE)
    )
  )
</pre>
其中SERVICE_NAME和ORACLE_SID一致，orcl可以自定义
<h3>四、Ubuntu下sqlplus上下光标键乱码解决方法</h3>
遇到如题所述的问题时，可以这样解决该问题：
1、安装插件： sudo apt-get install rlwrap
2、在~/.bashrc中添加：alias sqlplus='rlwrap sqlplus'
3、重新键入sqlplus命令即可尽情享用上下左右光标键了
<h3>五、中文乱码问题解决</h3>
在~/.bashrc中添加：
<pre>
export NLS_LANG=american_america.utf8
</pre>

<h3>六、代替win下面的plsql developer工具</h3>
在linux下面可以使用oracle官方开发的sql developer，下载地址：
<a href="http://www.oracle.com/technetwork/developer-tools/sql-developer/downloads/index.html" target="_blank">下载sql developer</a>
