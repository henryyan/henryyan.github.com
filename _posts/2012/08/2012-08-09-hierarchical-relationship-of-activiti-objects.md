---
layout: post
title: "谈谈Activiti中流程对象之间的关系"
category: activiti 
tags: 
 - activiti
 - 层级
 - ProcessInstance
 - Execution
 - Task
 - Activity
---

场景模拟（请假流程）：

* 员工申请请假
* 部门领导审批
* 人事审批
* 员工销假

本文用次例介绍在工作流中出现的几个对象及其之间的关系，以及在Activiti中各个对象是如何关联的。

在线演示实例：[http://aws.kafeitu.me:8080/kft-activiti-demo](http://aws.kafeitu.me:8080/kft-activiti-demo)

在开始之前先看看下图，对整个对象结构有个了解，再结合下面的详细介绍理解。

![](/files/2012/08/activiti-objects.png)

<center>图1 Activiti中几个对象之间的关系</center>

## 1.ProcessInstance

员工开始申请请假流程，通过runtimeService.startProcessInstance()方法启动，引擎会创建一个**流程实例（ProcessInstance）**。

简单来说流程实例就是根据一次（一条）业务数据用**流程驱动的入口**，两者之间是**一对一**的关系。

擎会创建一条数据到**ACT_RU_EXECUTION**表，同时也会根据**history**的级别决定是否查询相同的历史数据到**ACT_HI_PROCINST**表。

启动完流程之后业务和流程已经建立了关联关系，第一步结束。

启动流程和业务关联区别：

* 对于**自定义表单**来说启动的时候会传入**businessKey**作为业务和流程的关联属性
* 对于**动态表单**来说不需要使用businessKey关联，因为所有的数据都保存在引擎的表中
* 对于**外部表单**来说businessKey是可选的，但是一般不会为空，和自定义表单类似

关于各种表单之间的区别请参考：[比较Activiti中三种不同的表单及其应用](/activiti/2012/08/05/diff-activiti-workflow-forms.html)

## 2.Execution

初学者最搞不懂的就是ProcessInstance与Execution之间的关系，要分两种情况说明。

Execution的含义就是一个流程实例（ProcessInstance）具体要执行的过程对象。

不过在说明之前先声明两者的对象**映射关系**：

ProcessInstance（**1**）--->Execution(**N**)，其中**N >= 1**。 

**值相等的情况：**

除了在流程中启动的子流程之外，流程启动之后在表**ACT_RU_EXECUTION**中的字段**ID_**和**PROC_INST_ID_**字段值是相同的。

![ProcessInstance和Execution相等的情况](/files/2012/08/process-instance_exection_same.png)

<center>图2 ID_和PROC_INST_ID_相等</center>

**值不相等的情况：**

不相等的情况目前只会出现在子流程中（包含：嵌套、引入），例如一个购物流程中除了下单、出库节点之外可能还有一个**付款子流程**，在实际企业应用中付款流程通常是作为公用的，所以使用子流程作为主流程（购物流程）的一部分。

当任务到达子流程时引擎会自动创建一个付款流程，但是这个流程有一个特殊的地方，在数据库可以直观体现，如下图。

![ProcessInstance和Execution不相等的情况](/files/2012/08/process-instance_exection_diff.png)

<center>图3 ID_和PROC_INST_ID_不相等</center>

上图中有两条数据，第二条数据（嵌入的子流程）的**PARENT_ID_**等于第一条数据的**ID_**和**PROC_INST_ID_**，并且两条数据的**PROC_INST_ID_**相同。

上图还有一点特殊的地方，字段**IS_ACTIVE_**的值一个是0一个是1，说明正在执行子流程主流程挂起。

## 3.Task

刚刚说了ProcessInstance是和业务一对一关联的，和业务数据最亲密；Task是和用户最亲密的（UserTask），用户每天的待办事项就是一个个的Task对象。

从**图1**中看得出Execution和Task是一对多关系，Task可以是任何类型的Task实现，可以是用户任务（UserTask）、Java服务（ServiceTask）等，在实际流程运行中只不过面向对象不同，用户任务需要有人完成（complete），Java服务需要有系统自动执行（execution）。

![](/files/2012/08/task-db.png)

<center>图4 表ACT_RU_TASK</center>

Task是在流程定义中**看到**的最大单位，每当一个task完成的（complete）时候会引擎把当前的任务移动到历史中，然后插入下一个任务插入到ACT_RU_TASK中。

从图4中可以看出

## 4.Activity

Activity——活动。

![](/files/2012/08/activity-db.png)

<center>图5 表ACT_HI_ACTINST</center>

Activity包含了流程中所有的活动数据，例如开始事件（图5中的第1条）、各种分支（排他、并行等，图5中的第2条数据）、以及刚刚提到的Task执行记录（如图5中的第3、4条数据）。

有些人认为Activity和Task是多对一关系，其实不是，从上图中可以看出来根本没有Task相关的字段。