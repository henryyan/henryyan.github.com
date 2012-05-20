---
layout: post
title: "Activiti设置流程发起用户信息"
category: activiti
tags: 
 - activiti
 - 启动
---

先来看一段API调用：
<pre class="brush:java">
List hpis = historyService.createHistoricProcessInstanceQuery()
			.startedBy(userCode).list();

</pre>
查询结果为空，这是为什么？

## 1.原因说明
当通过runtimeService接口启动(startProcessInstance[Byxxx])流程的时候会设置一个变量，代码片段(ProcessDefinitionEntity.java#createProcessInstance)：
<pre class="brush:java;first-line: 85;highlight:[85,87]">
String initiatorVariableName = (String) getProperty(BpmnParse.PROPERTYNAME_INITIATOR_VARIABLE_NAME);
if (initiatorVariableName!=null) {
	String authenticatedUserId = Authentication.getAuthenticatedUserId();
	processInstance.setVariable(initiatorVariableName, authenticatedUserId);
}
</pre>

从上面的代码片段中可以看出在启动流程的时候引擎会先从Authentication读取**已认证**用户信息；现在我们只要能设置认证用户的ID就可以了。

## 2.解决问题
查看API发现接口**IdentityService**有一个方法：_setAuthenticatedUserId_(String authenticatedUserId)，正是这个方法在其接口实现类：**org.activiti.engine.impl.IdentityServiceImpl**#_setAuthenticatedUserId_中调用了_Authentication.setAuthenticatedUserId()_。

解决办法很简单只要在启动流程之前调用API即可：**identityService.setAuthenticatedUserId(userId);**

<pre class="brush:java">
identityService.setAuthenticatedUserId(userId);
processInstance = runtimeService.startProcessInstanceByKey("leave", entityId, variables);
</pre>

当流程启动之后可以到表**ACT_HI_PROCINST**中查看字段**START_USER_ID_**的值来验证是否生效。

## 3.结束
问题很简单，但是官网的手册没有提到，希望让遇到问题的人少走弯路。
