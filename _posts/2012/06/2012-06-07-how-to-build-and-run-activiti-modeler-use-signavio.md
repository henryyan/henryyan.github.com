---
layout: post
title: "如何使用Signavio打包Activiti Modeler"
category: activiti 
tags: 
 - activiti
 - signavio
 - activiti-modeler
---

## 1.简单说明Activiti Modeler

Activiti Modeler是用来设计BPMN2.0规范的可视化设计器，使用开源的Signavio源码构建打包。

在Activiti 5.6版本之前安装包里面自带Activiti Modeler，之后就需要手动打包了，最近很多人询问如何打包运行，所以写此博文详细说明。

## 2.下载Signavio

Signavio托管在googlecode上，地址：[http://code.google.com/p/signavio-core-components/](http://code.google.com/p/signavio-core-components/)，可以通过Svn Checkout方式下载源码：
<pre class="brush:shell">
svn checkout http://signavio-core-components.googlecode.com/svn/trunk/ signavio-core-components
</pre>

## 3.配置打包任务属性

Signavio是通过ant构建打包的，在打包之前需要更改一下build.properties文件的属性值。

* **version**：这个版本随便定义，我是按照Activiti的最新版本定义的，例如当前**最新的版本号**是5.9；

* **war**：这个属性定义打包的war文件的名称，即：foo.war，我们设置为**activiti-modeler**；

* **configuration**：**最重要**的一个属性，定义打包的风格，默认支持三种：default, Activiti, jBPM；其实说风格也是**授权**，因为Activiti Modeler是Signavio捐赠给Activiti的。这里我们定义为**Activiti**，对应的配置目录在signavio-core-components/configuration/Activiti；

* **host**：这里顾名思义就是要配置运行时的域名以及端口号，根据自己的实际配置设置；可以定义为https协议。

* **fileSystemRootDirectory**：**重要**，属性的含义是制定保存workspace工作去的目录；这个属性导致很多人启动服务失败，因为制定的目录不存在导致Signavio报错；所以要事先准备好一个目录用来保存设计的文件（流程定义）；**注意**：不要使用反斜杠（\），而是所有的操作系统都使用**正斜杠**（/）来定义目录，例如：/home/henryyan/work/workspace/signavio

## 4.执行打包

支持多种打包、部署方式，也支持多种Web容器（JBoss、Tomcat）。

### 4.1 all-in-one方式

这个也是最常用的方式，在signavio-core-components目录执行命令：
<pre>ant build-all-in-one-war</pre>

执行完命令之后在signavio-core-components/target目录就出生成**activiti-modeler.war**，现在就可以把这个war包部署到tomcat或者其他容器中运行了。

### 4.2 直接部署到Web容器

需要设置属性：

* **dir-tomcat-webapps**：此属性在运行下面的命令的时候会用到，含义为指定打包文件部署的容器web根目录，例如我的tomcat配置：/home/henryyan/work/tools/apache/tomcat/tomcat-6.0.32-activiti-modeler/webapps

* **dir-jboss-webapps**：同dir-tomcat-webapps，只不过容器类型不同而已。

可以通过如下命令直接打包+运行设计器：
<pre>ant build-and-deploy-all-in-one-war-to-tomcat</pre>
等待任务结束之后在**dir-tomcat-】webapps**的属性值对应的目录中就看到了**activiti-modeler.war**文件了，现在你可以启动tomcat访问了。

## 4.3 Windows打包报错

又是烦人的编码问题，如图：

![](/files/2012/06/activiti-modeler-windows-build-error.png)

不过好在有人遇到过，我把解决办法搬过来整理分享给大家。解决办法就是设置编码为UTF-8。

官网的WIKI特别之处了**UTF-8 Encoding Configuration**。

	A lot of users face issues regarding an invalid encoding that may result in corrupted model files. 
	That is why it is very important that you ensure the usage of UTF-8 encoding in the whole application stack.

用编辑器打开signavio-core-components/ editor/build.xml文件。

1. 找到&lt;target name="com.signavio.editor.js.concat">，紧随其后添加一行配置代码：&lt;property name="charset" value="utf-8"/>标签中的&lt;concat destfile='${build}/oryx.debug.js'>修改为&lt;concat destfile='${build}/oryx.debug.js' encoding="${charset}" outputencoding="${charset}">。
2.	找到&lt;target name='com.signavio.editor.js.compress代码处，更改次target内的&lt;java dir="${build}" jar="${root}/lib/yuicompressor-**2.4.2**.jar" fork="true" failonerror="true" output='${compress.temp}'>；将其中的yuicompressor-2.4.2.jar更改为yuicompressor-**2.4.7**.jar。
3.	signavio默认使用yuicompressor-2.4.2版本压缩javascript和css文件，为了解决编码问题我们需要使用最新版本替换**2.4.2**版本，笔者在撰稿的时候最新的yuicompressor版本为**2.4.7**，读者也可以直接下载最新版本。访问[http://yuilibrary.com/download/yuicompressor/](http://yuilibrary.com/download/yuicompressor/) 下载第一个版本的压缩包，解压提取**build/yuicompressor-2.4.7.jar**文件并复制到signavio-core-components/yuicompressor/**editor/lib**目录中。再次执行打包命令**ant build-all-in-one-war**一切正常，截图证明。

![](/files/2012/06/activiti-modeler-windows-build-success.png)