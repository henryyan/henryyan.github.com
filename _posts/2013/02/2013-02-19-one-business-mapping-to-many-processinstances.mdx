---
layout: post
title: "突破限制：单个业务对应多个流程实例"
category: activiti
tags: 
 - activiti
 - 流程实例
---

## 1. 业务与流程实例关系

如果启动流程的时候传递了参数**businessKey**作为业务ID，引擎要求和流程定义对象（**ProcessDefinition**）联合唯一，对于*运行时*和*历史*流程实例表分别有两个联合唯一约束：ACT_UNIQ_RU_BUS_KEY、ACT_UNIQ_HI_BUS_KEY。

	startProcessInstanceByKey(String processDefinitionKey, String businessKey, Map<.String,Object> variables)
	
对于这个限制在大多数情况下是合理的，也可以避免同一个业务启动多个流程实例的情况；但是对于下面的两个需求这个限制就是拦路虎了：

1. 第一次运行流程最后流程异常终止了（包括多种情况，删除了），但是要保留历史流程数据，并且要以同一个业务记录启动一个流程实例
2. 一个业务根据某种规则拆分多个独立的流程，例如多个申请单，每个申请单需要一个独立的流程处理

上面的两种情况显然会被数据库约束拦在外面，那是不是没有解决办法呢？

第二个需求是一个网友咨询我的，这样的需求立即勾起了对具有一定挑战性问题的思考，所以有了这篇博文。

## 2. 突破限制

解决的办法也不复杂，利用BPMN2.0的**调用活动**并且开启多实例作为主流程的一个活动，而调用活动所引用的**Call element**才是真正处理业务流程的流程。

![image](/files/2013/02/master-process.png) __________________ ![image](/files/2013/02/business-process.png)

通过这两个流程图基本可以想到我要如何实现了，主流程的“调用实际业务”活动是**多实例**的，所以无论一个业务拆分多少个都是可以实现的。

### 2.1 流程定义XML

主流程的流程定义XML：
<pre class="brush:xml">
<process id="master" name="My process" isExecutable="true">
  <startEvent id="startevent1" name="Start"></startEvent>
  <callActivity id="callactivity1" name="调用实际业务" calledElement="business">
    <extensionElements>
      <activiti:in source="user" target="user"></activiti:in>
    </extensionElements>
    <multiInstanceLoopCharacteristics isSequential="false" activiti:collection="${users}" activiti:elementVariable="user"></multiInstanceLoopCharacteristics>
  </callActivity>
  <sequenceFlow id="flow1" sourceRef="startevent1" targetRef="callactivity1"></sequenceFlow>
  <endEvent id="endevent1" name="End"></endEvent>
  <sequenceFlow id="flow2" sourceRef="callactivity1" targetRef="endevent1"></sequenceFlow>
</process>
</pre>

实际业务流程的XML：
<pre class="brush:xml">
<process id="business" name="My process" isExecutable="true">
  <startEvent id="startevent1" name="Start"></startEvent>
  <sequenceFlow id="flow1" sourceRef="startevent1" targetRef="usertask1"></sequenceFlow>
  <endEvent id="endevent1" name="End"></endEvent>
  <sequenceFlow id="flow2" sourceRef="usertask1" targetRef="endevent1"></sequenceFlow>
  <userTask id="usertask1" name="用户任务" activiti:assignee="${user}"></userTask>
</process>
</pre>

### 2.2 单元测试

流程定义的完整XML文件可以从这里下载：

1. [master.bpmn](https://github.com/henryyan/activiti-study/blob/234bfaf2060aeb80373da381a7b33147c00078c1/src/test/resources/diagrams/qun/oneBusinessToManyProcess/business.bpmn)
2. [business.bpmn](https://github.com/henryyan/activiti-study/blob/234bfaf2060aeb80373da381a7b33147c00078c1/src/test/resources/diagrams/qun/oneBusinessToManyProcess/master.bpmn)

单元测试模拟了解决方案，**突破**了一对一的限制；值得*注意*的是：查询待办任务时要以**business**作为业务流程而不是**master**。

<script src="https://gist.github.com/henryyan/4978686.js"></script>
