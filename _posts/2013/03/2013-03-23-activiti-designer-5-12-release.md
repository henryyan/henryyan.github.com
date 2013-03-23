---
layout: post
title: "Activiti Designer 5.12.0 发布"
category: activiti
tags:
 - activiti
 - Activiti Designer
---

[Activiti 5.12发布](/activiti/2013/03/10/kft-activiti-demo-release-1-7.html)之后Activiti Designer迎来了[5.12.0](http://bpmn20inaction.blogspot.com/2013/03/activiti-designer-5120.html)版本，该版本虽然没有添加对BPMN2.0规范支持，但是在使用方面大大提升，很值得升级！

## 1. 打开无BPMN DI信息的流程文件自动排列

可能很多使用Activiti的人都遇到一个问题，有些流程文件没有BPMN DI信息（用于描述流程中每一个组件的XY坐标、宽度、高度），所以要以图片形式查看流程就麻烦了，在Activiit源码中有大量的bpmn20.xml文件用于测试引擎，而且都没有附带BPMN DI信息，所以要看懂流程图就要有扎实的BPMN规范基础然后把xml在脑海中转换为图片形式。。。

现在不需要了，利用Activiti中新增的**activiti-bpmn-layout**模块可以自动根据流程定义xml生成BPMN DI信息，现在可以在**foo.bpmn20.xml**文件或者任何包含了流程定义信息的文件上**右键**选择“Open with”-> "Other…"-> "Activiti Diagram Editor"，单击“OK”后就可以看到流程图了，自己稍作调整（输出流的坐标不太准确）保存，再次用"XML Editor"打开就可以看到BPMN DI的XML配置了。

![打开无BPMN DI信息的流程文件自动排列](/files/2013/03/activiti-designer-no-bpmn-di-auto-layout.png)

## 2. 可视化关联调用活动（Call Activity）

在之前的版本中如果在流程中添加一个调用活动需要手动输入流程的ID，这样可能会导致出错。现在可以用GUI交互的方式设置，Designer可以从当前工作区中扫描所有扩展名为**“bpmn”**的文件，选择一个后在对话框中就可以看到该流程的ID，确定后就设置完成了；当然如果需要查看已经关联的**bpmn**文件也可以单击右箭头查看，使用起来非常方便，不容易出错。

![可视化关联调用活动（Call Activity）](/files/2013/03/activiti-designer-callactivity-gui-way.png)

## 3. 去繁从简--简化Message和Signal设置

**以往**的版本中如果添加了消息或者信号类型的事件需要先在流程属性（设置流程ID的界面）中添加Message和Signal，之后再选择对应的事件在属性中的下拉框中选择已经定义的Message或Signal。

**现在**不需要这么麻烦了，不需要实现定义而是在需要的地方直接输入Message或者Signal的ID即可，引擎会自动添加**message**和**signal**定义。

Tijs也做了说明：设置消息或者信号需要的仅仅是一个“**id**”属性，所以没必要这么麻烦；**请注意**：自动添加的消息、信号标签的**id**、**name**属性值相同，即“ Ref Id”的值，如果两个值不同请以XML视图修改。

## 4. 修复不智能的保存提示

**以往**的版本中一直有一个Bug，虽然不影响使用但是很烦人……。有时打开一个流程，选择了一个组件后再失去焦点文件的状态即标志为已被修改（文件名后面有星号），当你关闭流程文件时就会提示保存V_V。

**现在**这个Bug已经修复！！！

除了以上的几点之外还有一些其他的问题修复，具体可以到JIRA查看完整的changelog。