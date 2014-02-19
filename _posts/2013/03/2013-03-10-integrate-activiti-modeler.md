---
layout: post
title: "整合Activiti Modeler到业务系统（或BPM平台）"
category: activiti
tags:
 - activiti
 - Activiti Modeler
 - 整合
---

## 1. 为什么要整合

Activiti 5.10版本把原本独立的Activiti Modeler模块整合到了Activiti Explorer中，两者相结合使用起来很方便，通过Modeler设计的流程模型可以直接部署到引擎，也可以把已经部署的流程转换为Model从而在Modeler中编辑。

在实际应用中也有这样的需求，把Modeler整合到业务系统中可以供管理员使用，或者作为BPM平台的一部分存在，很遗憾官方没有给出如何整合Modeler的文档。

## 2. 整合工作

### 2.1 下载源码

首先需要从Github下载源码：[https://github.com/Activiti/Activiti](https://github.com/Activiti/Activiti)；可以直接用Git克隆，也可以下载zip格式的压缩包。

![Activit源码结构](/files/2013/03/activiti-source-tree.png)

### 2.2 复制文件

> 复制的所有文件均在**activiti-webapp-explorer2**目录中。

1. **src/main/resources**中的**editor.html、stencilset.json、plugins.xml**到项目**源码的源码根目录**，保证编译之后在classes根目录
2. **src/main/webapp**中的**api、editor、explorer、libs**到项目的webapp目录（与WEB-INF目录同级）

### 2.3 添加依赖
<pre class="brush:xml">
<dependency>
	<groupId>org.activiti</groupId>
	<artifactId>activiti-explorer</artifactId>
	<version>5.14</version>
	<exclusions>
		<exclusion>
			<artifactId>vaadin</artifactId>
			<groupId>com.vaadin</groupId>
		</exclusion>
		<exclusion>
			<artifactId>dcharts-widget</artifactId>
			<groupId>org.vaadin.addons</groupId>
		</exclusion>
		<exclusion>
			<artifactId>activiti-simple-workflow</artifactId>
			<groupId>org.activiti</groupId>
		</exclusion>
	</exclusions>
</dependency>
<dependency>
	<groupId>org.activiti</groupId>
	<artifactId>activiti-modeler</artifactId>
	<version>5.14</version>
</dependency>
</pre>

### 2.4 添加Java类

添加一个**ExplorerRestApplication.java**类保存到项目中，注册了一些REST路由。

<pre class="brush:java">
package org.activiti.explorer.rest.application;

import org.activiti.editor.rest.application.ModelerServicesInit;
import org.activiti.rest.api.DefaultResource;
import org.activiti.rest.application.ActivitiRestApplication;
import org.activiti.rest.filter.JsonpFilter;
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

### 2.5 配置web.xml

在web.xml文件中添加如下配置：

<pre class="brush:xml">
<!-- Restlet adapter, used to expose modeler functionality through REST -->
<servlet>
	<servlet-name>RestletServlet</servlet-name>
	<servlet-class>org.restlet.ext.servlet.ServerServlet</servlet-class>
	<init-param>
		<!-- Application class name -->
		<param-name>org.restlet.application</param-name>
		<param-value>org.activiti.explorer.rest.application.ExplorerRestApplication</param-value>
	</init-param>
</servlet>

<!-- Catch all service requests -->
<servlet-mapping>
	<servlet-name>RestletServlet</servlet-name>
	<url-pattern>/service/*</url-pattern>
</servlet-mapping>
</pre>

### 2.6 控制器

使用Spring MVC做了一个简单的封装，也可以使用其他的MVC实现。

<pre class="brush:java">
package me.kafeitu.demo.activiti.web.workflow;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 流程模型控制器
 * 
 * @author henryyan
 */
@Controller
@RequestMapping(value = "/workflow/model")
public class ModelController {

  protected Logger logger = LoggerFactory.getLogger(getClass());

  @Autowired
  RepositoryService repositoryService;

  /**
   * 模型列表
   */
  @RequestMapping(value = "list")
  public ModelAndView modelList() {
    ModelAndView mav = new ModelAndView("workflow/model-list");
    List<Model> list = repositoryService.createModelQuery().list();
    mav.addObject("list", list);
    return mav;
  }

  /**
   * 创建模型
   */
  @RequestMapping(value = "create")
  public void create(@RequestParam("name") String name, @RequestParam("key") String key, @RequestParam("description") String description,
          HttpServletRequest request, HttpServletResponse response) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      ObjectNode editorNode = objectMapper.createObjectNode();
      editorNode.put("id", "canvas");
      editorNode.put("resourceId", "canvas");
      ObjectNode stencilSetNode = objectMapper.createObjectNode();
      stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
      editorNode.put("stencilset", stencilSetNode);
      Model modelData = repositoryService.newModel();

      ObjectNode modelObjectNode = objectMapper.createObjectNode();
      modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME, name);
      modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION, 1);
      description = StringUtils.defaultString(description);
      modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, description);
      modelData.setMetaInfo(modelObjectNode.toString());
      modelData.setName(name);
      modelData.setKey(StringUtils.defaultString(key));

      repositoryService.saveModel(modelData);
      repositoryService.addModelEditorSource(modelData.getId(), editorNode.toString().getBytes("utf-8"));

      response.sendRedirect(request.getContextPath() + "/service/editor?id=" + modelData.getId());
    } catch (Exception e) {
      logger.error("创建模型失败：", e);
    }
  }

  /**
   * 根据Model部署流程
   */
  @RequestMapping(value = "deploy/{modelId}")
  public String deploy(@PathVariable("modelId") String modelId, RedirectAttributes redirectAttributes) {
    try {
      Model modelData = repositoryService.getModel(modelId);
      ObjectNode modelNode = (ObjectNode) new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
      byte[] bpmnBytes = null;

      BpmnModel model = new BpmnJsonConverter().convertToBpmnModel(modelNode);
      bpmnBytes = new BpmnXMLConverter().convertToXML(model);

      String processName = modelData.getName() + ".bpmn20.xml";
      Deployment deployment = repositoryService.createDeployment().name(modelData.getName()).addString(processName, new String(bpmnBytes)).deploy();
      redirectAttributes.addFlashAttribute("message", "部署成功，部署ID=" + deployment.getId());
    } catch (Exception e) {
      logger.error("根据模型部署流程失败：modelId={}", modelId, e);
    }
    return "redirect:/workflow/model/list";
  }

  /**
   * 导出model的xml文件
   */
  @RequestMapping(value = "export/{modelId}")
  public void export(@PathVariable("modelId") String modelId, HttpServletResponse response) {
    try {
      Model modelData = repositoryService.getModel(modelId);
      BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
      JsonNode editorNode = new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
      BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(editorNode);
      BpmnXMLConverter xmlConverter = new BpmnXMLConverter();
      byte[] bpmnBytes = xmlConverter.convertToXML(bpmnModel);

      ByteArrayInputStream in = new ByteArrayInputStream(bpmnBytes);
      IOUtils.copy(in, response.getOutputStream());
      String filename = bpmnModel.getMainProcess().getId() + ".bpmn20.xml";
      response.setHeader("Content-Disposition", "attachment; filename=" + filename);
      response.flushBuffer();
    } catch (Exception e) {
      logger.error("导出model的xml文件失败：modelId={}", modelId, e);
    }
  }

}
</pre>

### 2.7 注意事项

如果使用Spring代理引擎，并且在项目中同时有activiti.cfg.xml文件（不管在main/resources还是test/resources目录），在activiti.cfg.xml里面的引擎中添加下面的配置参数，否则会导致打开Modeler的编辑页面时读取数据返回**204**状态码。

<pre class="brush:xml">
<property name="processEngineName" value="test"></property>
</pre>

引擎默认名称为default，ProcessEngines.getDefaultProcessEngine()查询时会先检索main/resources，然后再检索test/resources的activiti.cfg.xml和activiti-context.xml文件，所以当main/resources监测不到指定文件时就会导致该引擎被当做web应用的引擎对象，这样会导致有两个引擎，所以把引擎的名称改为非默认的“default”。

## 3. 中文乱码问题解决办法

在JVM参数中添加参数：

> -Dsun.jnu.encoding=UTF-8 -Dfile.encoding=UTF-8

**参考**：[在Activiti Modeler中设计的流程包含奇数个中文时不能部署问题](http://forums.activiti-cn.org/forum.php?mod=viewthread&tid=50&fromuid=2)

## 4. 效果截图

在最新的kft-activiti-demo版本（1.7.0）中已经集成了Activiti Modeler，可以在线访问，也可以下载源码学习如何配置。

登录[http://demo.kafeitu.me/kft-activiti-demo](http://demo.kafeitu.me/kft-activiti-demo)后选择**流程管理**->**模型工作区**菜单项即可。

![kft-activiti-demo中的效果截图](/files/2013/03/kft-activiti-demo-model-workspace.png)
![kft-activiti-demo中的效果截图](/files/2013/03/kad-modeler.png)