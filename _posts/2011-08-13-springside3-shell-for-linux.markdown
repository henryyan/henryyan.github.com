--- 
layout: post
title: "Linux下springside3快捷脚本（quick-start、generate-project）"
wordpress_id: 1580
wordpress_url: http://www.wsria.com/?p=1580
date: 2011-08-13 20:59:56 +08:00
tags: 
 - springside
---
<h3>一、交代背景</h3>
使用Springside（一下简称SS）有段时间了，之前一直都是用windows开发，正好SS提供了很方便一键安装（quick-start）和一键生成（generate-project）脚本（bat格式）；前段时间全面切换环境到Ubuntu，因为培训新员工的缘故需要给他们讲解SS（因为我们用SS作为公司的基础架构），所以我在本地需要操作SS，但是脚本仅限于Windows，好在这段时间看了一部分Bash的书籍，所以决定自己根据bat脚本修改一个bash的脚本。
<h3>二、quick-start.sh</h3>

<pre>
复制以下脚本保存为quick-start.sh
</pre>
<!--more-->
<pre>
#!/bin/bash

# 脚本名称：quick-start.sh
# 作者：咖啡兔
# 博客：http://www.wsria.com
# 日期：2011-08-13
# 有更好的建议或写法请联系：yanhonglei[at]gmail.com

echo [INFO] 确保默认JDK版本为JDK6.0及以上版本,已配置JAVA_HOME.
echo [INFO] 如不能连接Maven官方网站, 修改本文件去掉下面一行的注释.

#设置临时变量
MVN=mvn
ANT=ant
MAVEN_OPTS="$MAVEN_OPTS -XX:MaxPermSize=128m"
SS_DIR=$(dirname $(cd ${0%/*} && echo $PWD/${0##*/}))
ANT="$SS_DIR/tools/ant/apache-ant-1.8.1/bin/ant"

#cd $(dirname `which $0`)意思是进入shell所在的目录
cd $SS_DIR
if [ -d "tools/ant/apache-ant-1.8.1/" ]; then
	ANT="$SS_DIR/tools/ant/apache-ant-1.8.1/bin/ant"
fi
echo Maven命令为$MVN
echo Ant命令为$ANT

echo [Step 1] 复制tools/maven/central-repository 到 ~/.m2/repository
cp -r "tools/maven/central-repository" ~/.m2/repository

echo [Step 2] 安装SpringSide3 所有modules, examples项目及mini項目生成模板到本地Maven仓库, 生成Eclipse项目文件.
$MVN clean install -Dmaven.test.skip=true
$MVN eclipse:clean eclipse:eclipse

echo [Step 3] 启动H2数据库.
cd tools/h2
$MVN exec:java &
cd ../../
# 等待5秒钟，因为遇到过问题：启动下面的web应用的时候H2还未启动完成，如果机器性能低请增加等待时间
sleep 5

echo [Step 4] 为Mini-Service 初始化数据库, 启动Jetty.
cd examples/mini-service
$ANT -f bin/build.xml init-db 
$MVN -Djetty.port=8083 jetty:run &
cd ../../

echo [Step 5] 为Mini-Web 初始化数据库, 启动Jetty.
cd examples/mini-web
$ANT -f bin/build.xml init-db 
$MVN -Djetty.port=8084 jetty:run &
cd ../../

echo [Step 6] 为Showcase 生成Eclipse项目文件, 编译, 打包, 初始化数据库, 启动Jetty.
cd examples/showcase
$ANT -f bin/build.xml init-db
$MVN -Djetty.port=8085 jetty:run &
cd ../../

echo [INFO] SpringSide3.0 快速启动完毕.
echo [INFO] 可访问以下演示网址:
echo [INFO] http://localhost:8083/mini-service
echo [INFO] http://localhost:8084/mini-web
echo [INFO] http://localhost:8085/showcase
</pre>


<pre>不要忘记为脚本添加执行权限：
<pre>
chmod a+x generate-project.sh
</pre>
</pre>

<hr/>

<pre><strong>脚本不足</strong>：
启动数据库和3个演示项目之后按Ctrl+C不能停止进程，因为进程都是在后台运行的，脚本运行完成后使用：
<pre>ps -e | grep java</pre>
然后结束这些java进程，或者使用：
<pre>sudo netstat -tulnp | grep java</pre>
根据端口结束进程：
<pre>kill -9 xxx</pre>
</pre>

<pre>目前能力有限，如果有更好的办法解决上面这个问题欢迎回复完善此文章！</pre>
如果出现以下错误信息，请下载maven-ant-tasks.jar，<a href="http://maven.apache.org/ant-tasks/download.html" target="_blank">下载地址</a>：
<pre>
Buildfile: /home/kafeitu/work/sources/springside/springside-3.3.4/examples/mini-web/bin/build.xml

BUILD FAILED
/home/kafeitu/work/sources/springside/springside-3.3.4/examples/mini-web/bin/build.xml:4: Problem: failed to create task or type antlib:org.apache.maven.artifact.ant:dependencies
Cause: The name is undefined.
Action: Check the spelling.
Action: Check that any custom tasks/types have been declared.
Action: Check that any <presetdef>/<macrodef> declarations have taken place.
No types or tasks have been defined in this namespace yet

This appears to be an antlib declaration. 
Action: Check that the implementing library exists in one of:
        -/home/kafeitu/work/tools/apache/ant/apache-ant-1.8.2/lib
        -/home/kafeitu/.ant/lib
        -a directory added on the command line with the -lib argument


Total time: 0 seconds
</pre>
<h3>三、generate-project.sh</h3>
这个比较简单，请复制以下脚本保存到generate-project.sh
<pre>
echo [INFO] 确保已用mvn install安裝tools/maven/archetype中的mini-web项目模板
gpdir=generated-projects
cd $(dirname `which $0`)
if [ ! -d "$gpdir" ]; then
	mkdir $gpdir
fi
cd $gpdir
mvn archetype:generate -DarchetypeCatalog=local
</pre>

<pre>不要忘记为脚本添加执行权限：
<pre>
chmod a+x generate-project.sh
</pre></pre>
<h3>四、结束语</h3>
好了，两个简单的脚本OK了，希望能帮助你解决问题，期待高手的意见和参与！
