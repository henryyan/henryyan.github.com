---
layout: post
title: "剖析Activiti的Activity"
category: activiti
tags: 
 - activiti
 - Activity
 - 剖析
---

## 1. 窥视Activity内部

在设计流程时每一个组件在Activiti中都可以称之为——Activity，部署流程时引擎把XML文件保存到数据库，当启动流程、完成任务时会从数据库读取XML并转换为Java对象，很多人想在处理任务时获取任务的一些配置，例如某个任务配置了哪些监听器或者条件Flow配置了什么条件表达式。

## 2. 代码

下面的代码做了简单的演示，根据不同的Activity类型输出属性，读者可以继续探索其他不同类型Activity的属性，最终可以获取到所有Activity的属性。

<script src="https://gist.github.com/8578924.js"></script>

## 3. 输出结果示例

<pre>
{taskDefinition=org.activiti.engine.impl.task.TaskDefinition@19c6e4d1, default=null, name=部门领导审批, documentation=null, type=userTask}
{conditionText=${!deptLeaderPass}, condition=org.activiti.engine.impl.el.UelExpressionCondition@50d8628f, name=不同意, documentation=null}
{conditionText=${deptLeaderPass}, condition=org.activiti.engine.impl.el.UelExpressionCondition@2e2ec3c0, name=同意, documentation=null}
{taskDefinition=org.activiti.engine.impl.task.TaskDefinition@3589f0, default=null, name=调整申请, documentation=null, type=userTask}
{taskDefinition=org.activiti.engine.impl.task.TaskDefinition@3af2ebab, default=null, name=人事审批, documentation=null, type=userTask}
{conditionText=${hrPass}, condition=org.activiti.engine.impl.el.UelExpressionCondition@224e45c9, name=同意, documentation=null}
{conditionText=${!hrPass}, condition=org.activiti.engine.impl.el.UelExpressionCondition@40c7a0b7, name=不同意, documentation=null}
{taskDefinition=org.activiti.engine.impl.task.TaskDefinition@72086f9a, default=null, name=销假, documentation=null, type=userTask}
{conditionText=${reApply}, condition=org.activiti.engine.impl.el.UelExpressionCondition@7d721f3, name=重新申请, documentation=null}
{conditionText=${!reApply}, condition=org.activiti.engine.impl.el.UelExpressionCondition@3cf5dc8a, name=结束流程, documentation=null}
{name=Start, documentation=null, type=startEvent}
{name=End, documentation=null, type=endEvent}
</pre>