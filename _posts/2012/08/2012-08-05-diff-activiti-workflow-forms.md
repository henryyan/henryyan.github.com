---
layout: post
title: "比较Activiti中三种不同的表单及其应用"
category: activiti
tags:
 - activiti
 - 表单
 - 动态表单
 - 外置表单
 - 普通表单
---

## 开篇语

这个恐怕是初次接触工作流最多的话题之一了，当然这个不是针对Activiti来说的，每个工作流引擎都会支持多种方式的表单。目前大家讨论到的大概有三种。

1. 动态表单
2. 外置表单
3. 普通表单

具体选择哪种方式只能读者根据自己项目的实际需求结合现有技术或者架构、平台选择！！！

## 1.动态表单

这是程序员**最喜欢**的方式，同时也是客户**最讨厌**的……因为表单完全没有布局，所有的表单元素都是顺序输出显示在页面。

此方式需要在流程定义文件(bpmn20.xml)中用**activiti:formProperty**属性定义，可以在开始事件（Start Event）和Task上设置，而且支持变量自动替换，语法就是UEL。

<pre class="brush: xml">
<startEvent id="startevent1" name="Start">
  <extensionElements>
    <activiti:formProperty id="name" name="Name" type="string"></activiti:formProperty>
  </extensionElements>
</startEvent>
<userTask id="usertask1" name="First Step">
  <extensionElements>
    <activiti:formProperty id="setInFirstStep" name="SetInFirstStep" type="date"></activiti:formProperty>
  </extensionElements>
</userTask>
</pre>

下面是一个简单的动态表单的单元测试，读者可以下载运行以便更明确执行过程和判断动态表单能不能在企业项目中使用。

* [DymaticForm.bpmn](/files/2012/08/DymaticForm.bpmn)
* [ProcessTestDymaticForm.java](/files/2012/08/ProcessTestDymaticForm.java)

下载之后复制到eclipse工程里，更改里面的路径配置使用JUnit测试即可。

当流程需要一些特殊处理时可以借助Listener或者Delegate方式实现。

	注意：表单的内容都是以key和value的形式数据保存在引擎表中！！！

## 2.外置表单

这种方式常用于基于工作流平台开发的方式，代码写的很少，开发人员只要把表单内容写好保存到**.form**文件中即可，然后配置每个节点需要的表单名称（form key），实际运行时通过引擎提供的API读取Task对应的form内容输出到页面。

此种方式对于在经常添加新流程的需求比较适用，可以快速发布新流程，把流程设计出来之后再设计表单之后两者关联就可以使用了。例如公司内部各种简单的审批流程，没有业务逻辑处理，仅仅是多级审批是否通过等等情况

当流程需要一些特殊处理时可以借助Listener或者Delegate方式实现。

Activiti Explorer就是使用的这种方式，表单信息都配置在流程定义文件中。

代码片段：
<pre class="brush:xml">
<process id="FormKey" name="FormKey">
    <startEvent id="startevent1" name="Start" activiti:formKey="diagrams/form/start.form"></startEvent>
    …
</process>
</pre>

同样也提供了单元测试：

* [FormKey.bpmn20.xml](/files/2012/08/FormKey.bpmn20.xml)
* [start.form](/files/2012/08/start.form)
* [first-step.form](/files/2012/08/first-step.form)
* [ProcessTestFormKey.java](/files/2012/08/ProcessTestFormKey.java)

----

	注意：表单的内容都是以key和value的形式数据保存在引擎表中！！！

## 3.普通表单

这个是最灵活的一种方式，常用于业务比较复杂的系统中，或者业务比较固定不变的需求中，例如ERP系统。

普通表单的特点是把表单的内容存放在一个页面（jsp、jsf、html等）文件中，存放方式也有两种（一体式、分离式）：

1.**一体式**：把整个流程涉及到的表单放在一个文件然后根据处理的任务名称匹配显示，kft-activiti-demo的普通表单模式就是一体式的做法，把表单内容封装在一个div里面，div的ID以节点的名称命名，点击“办理”按钮时用对话框的方式把div的内容显示给用户。

2.**分离式**：对于非Ajax应用来说比较常用，每个任务对应一个页面文件，点击办理的时候根据任务的ID动态指定表单页面。

本博客发布的Activiti入门Demo中有演示：[Activiti快速入门项目-kft-activiti-demo](/activiti/2012/05/26/kft-activiti-demo.html)

和以上两种方式比较有两点区别：

1. **表单**：和第二种外置表单类似，但是表单的显示、表单字段值填充均由开发人员写代码实现。
2. **数据表**：数据表单独设计而不是和前两种一样把数据以key、value形式保存在引擎表中。

## 4.从业务数据和流程关联比较

1. **动态表单**：引擎已经自动绑定在一起了，不需要额外配置。
2. **外置表单**：和业务关联是可选的，提供的例子中是没有和业务关联的，如果需要关联只需要在提交StartForm的时候设置businessKey即可。
3. **普通表单**：这个应该是**必须**和业务关联，否则就是无头苍蝇了……，关联方式可以参考：[工作流引擎Activiti使用总结](/activiti/2012/03/22/workflow-activiti-action.html)中的**2.3 业务和流程的关联方式**

## 5.结束语

	技术只是辅助工具，只能决定这件事能不能做，如何选择要看应用场合，希望简单的比较能提供一点思路。

这是我使用Activiti以来对几种表单的划分，仅供参考，抛砖引玉，如果有异议请留言或者直接联系我一起探讨！