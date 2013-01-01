---
layout: post
title: "让Activiti记录变量历史信息"
category: activiti
tags:
 - activiti
 - history
 - 变量
---

可能你在苦恼这个问题，因为在跟踪已结束流程的时候需要获取流程办理中设置的变量值（可以分析每个节点办理的详细状态），今天我们就来探索一下如何实现。

## 1.Activiti表结构设计

Activiti的表结构设计分为两种类型：运行时(ACT_RU)、历史(ACT_HI)。

### 1.1 运行时变量

所有运行时的变量都保存在表：**ACT_RU_VARIABLE**中，这些变量可以在启动流程、完成任务、动态添加的方式插入到数据库，以便流程在处理中可以根据变量的值决定流程的走向。

### 1.2 历史变量呢？

为什么没有**ACT_HI_VARIABLE**这张表呢？

我在开始的时候也是苦恼为什么没有这张表，导致在跟踪历史流程信息的时候不能获取变量。

## 2.了解历史级别

Activit默认提供了4中历史级别：

* **none**: 不保存任何历史记录，可以提高系统性能；

* **activity**：保存所有的流程实例、任务、活动信息；

* **audit**：也是Activiti的**默认**级别，保存所有的流程实例、任务、活动、表单属性；

* **full**： 最完整的历史记录，除了包含**audit**级别的信息之外还能保存详细，例如：流程变量。

对于几种级别根据对功能的要求选择，如果需要日后跟踪详细可以开启**full**。

## 3.配置历史级别

### 3.1 在XML中配置
在引擎Bean**processEngineConfiguration**中配置：

<pre class="brush:xml">
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	<property name="history" value="full" />
</bean>
</pre>

### 3.2 动态配置

<pre class="brush:java">
ProcessEngine processEngine = ProcessEngineConfiguration
  .createProcessEngineConfigurationFromResourceDefault()
  .setHistory(ProcessEngineConfiguration.HISTORY_FULL)
  .buildProcessEngine();
</pre>

## 4.读取历史变量

现在再重启你的应用，启动流程或者在任务**complete**之后查看**ACT_HI_DETAIL**表的数据已经记录了。

![开始full历史级别后保存的历史信息](/files/2012/05/activiti-history-detail.png)

### 4.1 Java代码-5.10版本之前

<pre class="brush:java">
List<HistoricDetail> list = historyService.createHistoricDetailQuery().processInstanceId(processInstance.getId()).list();
for (HistoricDetail historicDetail : list) {
	HistoricVariableUpdate variable = (HistoricVariableUpdate) historicDetail;
    System.out.println("variable: " + variable.getVariableName() + " = " + variable.getValue());
}
</pre>

### 4.2 Java代码-5.11版本之后
5.11版本在变量保存方面做了变动，单独创建了一张表**ACT_HI_VARINST**保存变量，可以通过下面的代码读取变量。参见：[Activiti 5.11发布](/activiti/2012/12/05/activiti-5-11-release.html)

![5.11添加的表ACT_HI_VARINST](/files/2012/05/activiti-history-variable.png)

<pre class="brush:java">
List<HistoricVariableInstance> list = historyService.createHistoricVariableInstanceQuery().processInstanceId(processInstanceId).list();
for (HistoricVariableInstance variableInstance : list) {
  System.out.println("variable: " + variable.getVariableName() + " = " + variable.getValue());
}
</pre>

## 5.只读取表单字段
<pre class="brush:java">
List<HistoricDetail> formProperties = historyService.createHistoricDetailQuery().processInstanceId(processInstance.getId()).formProperties().list();
for (HistoricDetail historicDetail : formProperties) {
  HistoricFormProperty field = (HistoricFormProperty) historicDetail;
  System.out.println("field id: " + field.getPropertyId() + ", value: " + field.getPropertyValue());
}
</pre>