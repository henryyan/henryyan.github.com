---
layout: post
title: "Activiti 5.10支持直接部署扩展名为bpmn的流程文件"
category: activiti
tags: 
 - activiti
 - 5.10
 - bpmn
 - 部署
---

## 1.黎明前夜（5.9及之前版本）

在5.9及其之前的版本Activiti不支持直接部署“bpmn”为扩展名的流程，所以之前在[这篇](/activiti/2012/07/18/how-to-pack-process-resources.html)文章中讲解如何打包bar文件时要求把bpmn重名为bpmn20.xml再打包。

不是了bpmn结尾的流程定义文件之后启动流程时会提示对应的流程不存在，这是因为Activiti未能识别bpmn扩展名的文件，它不知道如何处理当然也就没有作为流程定义存储到数据，最后你也就不能启动这个流程。

## 2.黎明前的迷惘

所以解决这个问题的办法就是在部署时重命名资源文件，如下典型的代码：

<pre class="brush:java">
String filename = "/Users/henryyan/project/foo.bpmn";
repositoryService.createDeployment()
  .addInputStream("foo.bpmn20.xml", new FileInputStream(filename)).deploy();
</pre>

上面的部署方式可以正常启动一个流程。

但是下面的代码就不能直接启动了。
<pre class="brush:java">
repositoryService.createDeployment().addClasspathResource("diagrams/Gateway.bpmn").deploy();
</pre>

Activiti会报错信息如下：
<pre>
org.activiti.engine.ActivitiException: no processes deployed with key 'AutoClaimForReject'
	at org.activiti.engine.impl.persistence.deploy.DeploymentCache.findDeployedLatestProcessDefinitionByKey(DeploymentCache.java:63)
	at org.activiti.engine.impl.cmd.StartProcessInstanceCmd.execute(StartProcessInstanceCmd.java:58)
	at org.activiti.engine.impl.cmd.StartProcessInstanceCmd.execute(StartProcessInstanceCmd.java:31)
	at org.activiti.engine.impl.interceptor.CommandExecutorImpl.execute(CommandExecutorImpl.java:24)
	at org.activiti.engine.impl.interceptor.CommandContextInterceptor.execute(CommandContextInterceptor.java:42)
	at org.activiti.engine.impl.interceptor.LogInterceptor.execute(LogInterceptor.java:33)
	at org.activiti.engine.impl.RuntimeServiceImpl.startProcessInstanceByKey(RuntimeServiceImpl.java:54)
</pre>

## 3.站在山坡看日出

从5.10版本开始我可以直接部署bpmn扩展名的流程定义文件了，顺便说一下bpmn是Activiti Designer 5.9（[Designer的重大变更说明](/activiti/2012/05/01/activiti-designer-5.8-to-5.9.html)）之后默认的扩展名，部分设计器也是默认以bpmn作为扩展名。

现在就可以这样部署流程定义文件了：

<pre class="brush:java">
String filename = "/Users/henryyan/project/foo.bpmn";
repositoryService.createDeployment()
  .addInputStream("foo.bpmn", new FileInputStream(filename)).deploy();
</pre>

当然这个看着不太爽，因为仅仅就是一个资源名称的更改（由foo.bpmn20.xml改为foo.bpmn）。

来点优雅的，借助CDI：

<pre class="brush:java">
@Test
@Deployment(resources = { "diagrams/foo.bpmn" })
public void startProcess() throws Exception {
	RuntimeService runtimeService = activitiRule.getRuntimeService();
	ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("foo");
	…
}
</pre>