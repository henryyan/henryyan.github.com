---
layout: post
title: "新版Activiti Modeler发布以及教程"
category: activiti
tags:
 - activiti
 - Activiti Modeler
 - Activiti Explorer
 - 打包
---


## 1.新版Activiti Modeler简介
在Activiti 5.6版本之前把Activiti Modeler作为压缩包的一部分，但是后来不再这么做而是需要开发人员自己根据Signavio打包Activiti Modeler，我之前层写过一篇博文讲解如何打包：[《如何使用Signavio打包Activiti Modeler》](/activiti/2012/06/07/how-to-build-and-run-activiti-modeler-use-signavio.html)。

**但是**现在不需要自己打包了，官方已经基于Signavio开发了新版的Activiti Modeler，新版的特点如下：

1. 完全针对Activiti定制开发，支持目前Activiti引擎支持的BPMN2.0规范模型；
2. 不需要开发人员自己打包，直接提供一个war包部署到Web Server（tomcat、jboss、jetty等）就可以使用；
3. 整合到Activiti Explorer中可以把Activiti Modeler设计的流程定义直接部署到Activiti Explorer中；
4. 和第三点相关，可以直接以已经部署的流程定义为基础创建模型，重新设计之后再部署到Activiti Explorer中

这些新特性对于使用Activiti的开发者来说真是一个好消息；之前很多人抱怨说Signavio不好用，原因有两个：没有针对Activiti的特性支持、浏览器不支持IE（稍后我会单独说说这个话题）。但是现在你可以像使用Activiti Designer一样使用Activiti Modeler，而且比Activiti Designer更好用，再加上Activiti Modeler和Activiti Explorer两者的结合更方便流程的管理。

按照**惯例**在发布Activiti引擎后应该随之发布对应版本的Activiti Designer，因为有些引擎支持的新特性需要它提供可视化设计的支持，但是……5.10版本的Activiti Designer一再延期到时很多开发者很不爽，可以看看我在官网论坛发的帖子[
When will it be released 5.10 version of the designer?](http://forums.activiti.org/en/viewtopic.php?f=8&t=4470) 。**但是**好消息又来了，**trademak**（Activiti项目的Team Leader，[@tijsrademakers](https://twitter.com/tijsrademakers)）发布消息说他们把开发Activiti Designer的人员调去开发新版的Activiti Modeler了……这可是一个额外的消息呀，最后很多人表示根本不在意料之中，好吧，继续由我带领你人事一下新版Activiti Modeler。在这篇帖子里面还提到了新版的（5.10）Activiti Designer也会在近期发布，到时我会在微博和QQ群发布消息。

## 2.Activiti源码仓库转移到Github

从开始使用Activiti的时候我就想说为什么不用Github呢？本来一个很明显的bug我可以fork之后修改然后提交pull request，svn很难让开发者参与进去。

在很多人的期待与建议之后官方终于决定把源码迁移到Github（9月21号），果断Fork并Star，地址：

[https://github.com/Activiti/Activiti](https://github.com/Activiti/Activiti)

会用Git的读者可以在日后参与进来修复Bug提交自己的Request，不会Git的读者建议去学习一下，如果需要下载最新的源码也可以通过下载Zip包的方式获取：[https://github.com/Activiti/Activiti/zipball/master](https://github.com/Activiti/Activiti/zipball/master)

## 3.获取新版Activiti Modeler
在Activiti的下载页面添加了新的下载项（Activiti Explorer），等等……新版的Activiti Modeler呢？

新版Activiti Modeler基于Signavio，重新命名为：KISBPM，意为：**keep it simple**，官网[http://www.kisbpm.com/](http://www.kisbpm.com/)

----
笔者Fork的Activiti源码提供最新的中文国际化支持，地址：

[https://github.com/henryyan/Activiti](https://github.com/henryyan/Activiti)

----

### 3.1 官方提供的War包

刚刚已经提到了，现在两者合并在一起了，下载Activiti Explorer之后就可以直接使用Activiti Modeler了，下载地址：

[http://activiti.org/alpha/activiti-explorer.war](http://activiti.org/alpha/activiti-explorer.war)

下载之后直接部署到Web容器中，数据库无需配置使用内置的h2，如果读者需要更改数据库可以把war解压后把文件夹复制到容器的应用目录（例如tomcat的webapps目录），然后更改**db.properties**里面的配置，就是普通的JDBC属性。

### 3.2 从Github获取最新源码手动打包

官方打包的war包可能会存在延迟（非最新的源码），这个时候可以自己从Github获取源码打包，当然离不开Maven的支持（别问我为什么……）。

获取之后的目录结构如下：

![Activiti源码目录结构](/files/2012/09/activiti-source-floder.png)

Activiti Modeler包含在**activiti-webapp-explorer2**模块中，读者可以导入Eclipse（需要m2eclipse插件支持）查看源码

对应目录`modules/activiti-webapp-explorer2/src/main/webapp/editor`

在终端中进入项目根目录，执行以下命令：

<pre class="brush:shell">
mvn clean install -PbuildWebappDependencies
</pre>

执行完成之后在modules/activiti-webapp-explorer2/target目录可以看到**activiti-webapp-explorer2-5.11-SNAPSHOT.war**，然后把这个文件重命名为**activiti-explorer.war**部署到tomcat或者其他的Web Server。

### 3.3 直接用Maven的Jetty插件启动应用

<pre class="brush:shell">
➜ ~/Activiti/modules/activiti-webapp-explorer2 (git) mvn clean package jetty:run
</pre>

然后就可以访问Explorer了，地址：[http://localhost:8080/activiti-explorer2](http://localhost:8080/activiti-explorer2)

## 4.访问Activiti Explroer和Activiti Modeler

使用过Activiti的读者想必已经了解了Activiti Explorer，在用户手册里面有说明如何使用，今天重点说说如何使用Activiti Modeler。

### 4.1 新加的Activiti Modeler菜单
使用用户`kermit/kermit`登陆系统，在菜单“Process”中多出了一个“**Model Workspace**”模块，这个就是Activiti Modeler的入口。

![Activiti Modeler的菜单](/files/2012/09/activiti-explorer-modeler-menu.png)

下图是点击了“Model Workspace”之后的页面。
![Activiti Modeler的菜单2](/files/2012/09/activiti-explorer-modeler-menu2.png)

### 4.2 使用Activiti Modeler创建新的模型

![Activiti Modeler创建新模型对话框](/files/2012/09/activiti-modeler-new-model.png)

点击“create”之后进入模型设计器，下图：

![Activiti Modeler加载页面](/files/2012/09/activiti-modeler-loading.png)

加载完成之后进入首页，风格和以往不同，这次是绿色调有点小清新……

![Activiti Modeler主页面](/files/2012/09/activiti-modeler-main-page.png)

## 5.使用Activiti Modeler设计流程

先说一下设计器的操作三部曲：

1. 从左侧的仓库中选择组件（可以展开多个分类）
2. 拖拽组建到工作区并调整位置
3. 点击组件在右侧的“Attributes”边栏中设置属性

本文这种说说和原版的Signavio不同的地方。

1. 移除了非BPMN2.0规范的支持
2. 添加了针对Activiti扩展功能的支持
3. 补充了Signavio中缺少的规范支持（例如边界事件）

截图说明添加的扩展属性支持。

### 5.1 对用户任务扩展支持

![Activiti Modeler对Activiti扩展属性的支持](/files/2012/09/activiti-modeler-activiti-assignee.png)

### 5.2 添加执行、监听器

![Activiti Modeler对Activiti扩展属性的支持-监听器](/files/2012/09/activiti-modeler-activiti-listener.png)

### 5.3 activiti:initiator的支持

之前写过一篇博文：[activiti:initiator的作用及其使用](/activiti/2012/09/14/activiti-initiator.html)

Activiti Modeler同样提供了支持:

![Activiti Modeler对Activiti扩展属性的支持-activiti:initiator](/files/2012/09/activiti-modeler-initiator.png)

### 5.4 表单支持

![Activiti Modeler对Activiti表单支持](/files/2012/09/activiti-modeler-form.png)

formkey同样也是支持的，设置**formkey**属性即可。

### 5.5 补充了对边界事件的支持

在Signavio中缺少对边界事件（Boundary Event）的支持，导致我在测试的不得不寻找其他的工具代替Signavio，现在Activiti添加了对边界事件的支持，下图：

![Activiti Modeler对Activiti表单支持](/files/2012/09/activiti-modeler-boundary-event.png)

### 5.6 部署到Activiti Explorer中

紧密结合的作用就是可以直接把设计好的流程部署到Activiti Explorer（实际使用的时候把Activiti Explorer的数据库配置到真是环境就可以作为后台管理使用了）中。

在Activiti Modeler中保存后回到Activiti Explorer界面（浏览器回退即可），然后在列表中就看到多了一个刚刚设计的流程。

![Activiti Modeler对Activiti表单支持](/files/2012/09/activiti-explorer-model-list.png)

----
现在可以点击按钮“Deploy process definition”部署到引擎中。

![Activiti Modeler对Activiti表单支持](/files/2012/09/activiti-explorer-process-definition-list.png)

### 5.7 对于Activiti Modeler的说明

现在仅仅是alpha版本，官方给出的说明是在下个版本（也就是5.11，预计在12.1日发布）发布的时候发布正式版本，目前大多数功能都可以正常使用。有兴趣的可以紧跟官方的更新，重复第3节中打包的任务，使用最新的版本^_^。

	目前只是第一版，还有些功能还不完善，可以先尝鲜等慢慢完善。
	另外官方日后会推出完整版的使用说明。

## 6.浏览器兼容的争论

因为Activiti Modeler是基于Signavio的，所以浏览器方面就有限制了，不支持IE浏览器，这对国内大多数人来说可能不能接受，也是有一部分人放弃使用Signavio的原因。

说说国内厂商对设计器的要求吧：

1. 支持IE
2. 支持BPMN2.0规范
3. 方便二次开发以便整合公司的基础框架、组件

----

* **定制开发的项目**：这样的项目一般不需要让用户自己设计流程，而是由业务需求人员设计再交由开发人员添加代码逻辑以及其他的完善任务，业务需求人员和开发人员仅仅是少数，安装一个非IE也不难吧。
* **可以让用户自定义的产品**：有些厂商喜欢拿**完全自定义**忽悠客户，从表单设计到流程设计全部交由用户，我一向不赞成这样的设计……，流程图可以画出来，里面的逻辑谁处理？不是每个用户都和程序员一样知道如何应用设计器设计可以**正常**运行的流程，在ZF单位还有部分人不熟悉点操作呢……
* **统一的开发平台**：提供统一的开发架构培训一批人，有一个统一的流程管理系统（类似于Activiti Modeler和Activiti Explorer的关系），都是开发人员安装个非IE也不成问题吧，而且大多数程序员是不喜欢用IE的。

对于浏览器上的争论，我的观点就是：尽量不要让用户参与流程设计（只让他们提供业务需求），少数人安装个非IE浏览器就和喝杯咖啡一样。



