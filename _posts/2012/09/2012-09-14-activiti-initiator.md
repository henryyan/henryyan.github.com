---
layout: post
title: "activiti:initiator的作用及其使用"
category: activiti 
tags: 
 - activiti
 - initiator
---

## 1.场景模拟

以[kft-activiti-demo](https://github.com/henryyan/kft-activiti-demo)中的请假流程为例，操作流程：

1. 用户A申请请假
2. 领导B驳回
3. 任务流转到“调整请假信息”节点

**问题来了**：如何把“调整请假信息”任务自动分配给申请请假的用户A呢？

## 2.救世主activiti:initiator

Activiti为此专门在**startEvent**上扩展了一个属性**activiti:initiator**用了解决这个问题。

下面的代码片段包含了这个属性：

<pre class="brush:xml;highlight:[2, 5, 12]">
<process id="leave" name="请假流程">
	<startEvent id="startevent1" name="Start" activiti:initiator="applyUserId"></startEvent>
    <userTask id="deptLeaderAudit" name="部门领导审批" activiti:candidateGroups="deptLeader"></userTask>
    <exclusiveGateway id="exclusivegateway5" name="Exclusive Gateway"></exclusiveGateway>
    <userTask id="modifyApply" name="调整申请" activiti:assignee="${applyUserId}">
      <extensionElements>
        <activiti:taskListener event="complete" delegateExpression="${afterModifyApplyContentProcessor}"></activiti:taskListener>
      </extensionElements>
    </userTask>
    <userTask id="hrAudit" name="人事审批" activiti:candidateGroups="hr"></userTask>
    <exclusiveGateway id="exclusivegateway6" name="Exclusive Gateway"></exclusiveGateway>
    <userTask id="reportBack" name="销假" activiti:assignee="${applyUserId}">
      <extensionElements>
        <activiti:taskListener event="complete" delegateExpression="${reportBackEndProcessor}"></activiti:taskListener>
      </extensionElements>
    </userTask>
</process>
</pre>

**分步理解:**

1. activiti:initiator设置一个**变量名称**（代码第2行），可以是任意的字符串，这一点是让很多初学者迷糊的地方不知道写什么，现在请记住一个变量。
2. 变量applyUserId应该保存申请用户的ID
3. 在需要设置申请用户才能办理的任务上设置**activiti:assginee=${applyUserId}**属性，参见第5、11行代码

为什么这么做呢？

在用户手册上其实专门讲解了这个属性的做作用以及使用方法，代码如下：

<pre class="brush:java">
identityService.setAuthenticatedUserId("kafeitu");
runtimeService.startProcessInstanceByKey("leave");
</pre>

* 第**1**行代码的作用就是设置当前的用户ID，**非常关键**，而且这行代码需要和**activiti:initiator**配合使用，不可分割……
* 第**2**行代码启动一个流程，在启动流程的时候会判断有没有**activiti:initiator**属性，如果有把属性**activiti:initiator**的值作为一个变量添加到流程实例中，本文中也就是**applyUserId**，`不要以为applyUserId是一个特殊的变量，它就是一个普通的变量而已`。

在流程XML中的第5、11行代码出使用${applyUserId}作为activiti:initiator的值，引擎会在创建任务的使用用变量applyUserId替换。


## 3.单元测试理解

请参考kft-activiti-demo中的单元测试：

* java: [LeaveWorkflowServiceTest.java](https://github.com/henryyan/kft-activiti-demo/blob/master/src/test/java/me/kafeitu/demo/activiti/service/oa/leave/LeaveWorkflowServiceTest.java)
* xml：[leave.bpmn](https://github.com/henryyan/kft-activiti-demo/blob/master/src/main/resources/diagrams/leave/leave.bpmn)

还可以在线运行请假流程：[http://demo.kafeitu.me/kft-activiti-demo](http://demo.kafeitu.me/kft-activiti-demo)体验一下这个过程。