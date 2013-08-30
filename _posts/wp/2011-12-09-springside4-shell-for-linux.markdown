--- 
layout: post
title: "Linux下springside4快捷脚本（quick-start、generate-project）"
wordpress_id: 1605
wordpress_url: http://www.wsria.com/?p=1605
date: 2011-12-09 10:24:25 +08:00
tags: 
 - springside
---
<h3>一、前言</h3>
尝鲜的同学得意了，特意编写了在linux下面运行的快捷脚本shell，对于springside3的脚本请访问：<a href="http://www.wsria.com/archives/1580" title="Linux下springside3快捷脚本（quick-start、generate-project）" target="_blank">Linux下springside3快捷脚本（quick-start、generate-project）</a>
<p>
generate-project脚本在springside3和springside4一样，请参考上面的地址！
</p>
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
# 日期：2011-12-09
# Email:yanhonglei[at]gmail.com

echo [INFO] 确保默认JDK版本为JDK6.0及以上版本,已配置JAVA_HOME.
echo [INFO] 如不能连接Maven官方网站, 修改本文件去掉下面一行的注释.

#设置临时变量
MAVEN_OPTS="$MAVEN_OPTS -XX:MaxPermSize=128m"
SS_DIR=$(dirname $(cd ${0%/*} && echo $PWD/${0##*/}))
ANT="$SS_DIR/tools/ant/apache-ant-1.8.2/bin/ant"

#cd $(dirname `which $0`)意思是进入shell所在的目录
cd $SS_DIR
if [ -d "tools/ant/apache-ant-1.8.2/" ]; then
	ANT="$SS_DIR/tools/ant/apache-ant-1.8.2/bin/ant"
fi

echo [Step 1] 安装SpringSide4 所有modules, examples项目及mini項目生成模板到本地Maven仓库, 生成Eclipse项目文件.
mvn clean install -Pmodules -Dmaven.test.skip=true
mvn eclipse:clean eclipse:eclipse

echo [Step 2] 启动H2数据库.
cd tools/h2
gnome-terminal -e "mvn exec:java" &
cd ../../

echo [Step 3] 为Mini-Service 初始化数据库, 启动Jetty.
cd examples/mini-service
ant -f bin/db/build.xml init-db 
gnome-terminal -e "mvn -Djetty.port=8083 jetty:run" &
cd ../../

echo [Step 4] 为Mini-Web 初始化数据库, 启动Jetty.
cd examples/mini-web
ant -f bin/db/build.xml init-db 
gnome-terminal -e "mvn -Djetty.port=8084 jetty:run" &
cd ../../

echo [Step 5] 为Showcase 生成Eclipse项目文件, 编译, 打包, 初始化数据库, 启动Jetty.
cd examples/showcase
ant -f bin/db/build.xml init-db
gnome-terminal -e "mvn -Djetty.port=8085 jetty:run" &
cd ../../

echo [INFO] SpringSide4.0 快速启动完毕.
echo [INFO] 可访问以下演示网址:
echo [INFO] http://localhost:8083/mini-service
echo [INFO] http://localhost:8084/mini-web
echo [INFO] http://localhost:8085/showcase
</pre>
