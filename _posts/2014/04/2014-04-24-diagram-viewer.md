---
layout: post
title: "集成Diagram Viewer跟踪流程"
category: activiti
tags: 
 - Activiti
 - Diagram Viewer
---

首先这是一篇迟来的教程，因为从5.12版本（目前最新版本为5.15.1）开始就已经提供了Diagram Viewer这个流程图跟踪组件，不管如何总归有人需要用到，所以我觉得还是要和大家分享一下。

## 1. 前言

目前被大家所采用的流程图跟踪有两种方式：

* 一种是由引擎后台提供图片，可以把当前节点标记用红色
* 一种是比较灵活的方式，先用引擎接口获取流程图（原图），然后再通过解析引擎的Activity对象逐个解析（主要是判断哪个是当前节点），最后把这些对象组成一个集合转换成JSON格式的数据输出给前端，用Javascript和Css技术实现流程的跟踪

这两种方式在kft-activiti-demo中都有演示，这里就不介绍了，参考流程跟踪部门代码即可。

## 2. Diagram Viewer简介

Diagram Viewer是官方在5.12版本中添加的新组件，以[Raphaël](http://raphaeljs.com)为基础库，用REST（参考：《[如何使用Activiti Rest模块](/activiti/2013/01/12/kft-activiti-demo-rest.html)》）方式获取JSON数据生成流程图并把流程的处理过程用不同的颜色加以标注，最终的效果如下图所示。

![](/files/2014/04/diagram-viewer.jpg)

在应用中使用时也很方便，把这个组件的源码复制到项目中再配置一个REST拦截器，最后拼接一个URL即可；举个例子：

> http://demo.kafeitu.me/kft-activiti-demo/diagram-viewer/index.html?processDefinitionId=leave-jpa:1:22&processInstanceId=27

这个URL中有两个参数：

* processDefinitionId: 流程定义ID
* processInstanceId: 流程实例ID

## 3. 集成Diagram Viewer

### 3.1 创建REST路由类

REST路由类源码在官方的Activiti Explorer里面有提供，代码如下：

<pre class="brush:java">
package org.activiti.explorer.rest;

import org.activiti.rest.common.api.DefaultResource;
import org.activiti.rest.common.application.ActivitiRestApplication;
import org.activiti.rest.common.filter.JsonpFilter;
import org.activiti.rest.diagram.application.DiagramServicesInit;
import org.activiti.rest.editor.application.ModelerServicesInit;
import org.restlet.Restlet;
import org.restlet.routing.Router;

public class ExplorerRestApplication extends ActivitiRestApplication {
  
  public ExplorerRestApplication() {
    super();
  }
  /**
   * Creates a root Restlet that will receive all incoming calls.
   */
  @Override
  public synchronized Restlet createInboundRoot() {
    Router router = new Router(getContext());
    router.attachDefault(DefaultResource.class);
    ModelerServicesInit.attachResources(router);
    DiagramServicesInit.attachResources(router);
    JsonpFilter jsonpFilter = new JsonpFilter(getContext());
    jsonpFilter.setNext(router);
    return jsonpFilter;
  }

}
</pre>

把这个路由配置到**web.xml**中：

<pre class="brush:xml">
<servlet>
    <servlet-name>ExplorerRestletServlet</servlet-name>
    <servlet-class>org.restlet.ext.servlet.ServerServlet</servlet-class>
    <init-param>
        <!-- Application class name -->
        <param-name>org.restlet.application</param-name>
        <param-value>org.activiti.explorer.rest.ExplorerRestApplication</param-value>
    </init-param>
</servlet>

<servlet-mapping>
	<servlet-name>ExplorerRestletServlet</servlet-name>
	<url-pattern>/service/*</url-pattern>
</servlet-mapping>
</pre>

### 3.2 复制Diagram Viewer组件

在官方提供的Zip文件（可以从[www.activiti.org/download.html](http://www.activiti.org/download.html)下载）中有一个**wars**目录，用压缩工具解压**activiti-explorer.war**文件，目录结构如下图：

![](/files/2014/04/activiti-explorer-tree.jpg)
![](/files/2014/04/diagram-viewer-tree.jpg)

把**diagram-viewer**复制到项目的**webapp**目录（或者是WebRoot目录）下，在项目中需要跟踪的地方拼接访问**diagram-viewer/index.html**的URL即可，别忘记了刚刚介绍的两个重要参数。

> http://demo.kafeitu.me/kft-activiti-demo/diagram-viewer/index.html?processDefinitionId=leave-jpa:1:22&processInstanceId=27

URL中有两个参数：

* processDefinitionId: 流程定义ID
* processInstanceId: 流程实例ID

----

这是一个独立的页面，你可以直接打开它或者把它嵌入在一个对话框里面（kft-activiti-demo就是用的嵌入方式）。