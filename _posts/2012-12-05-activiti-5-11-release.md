---
layout: post
title: "Activiti 5.11发布"
category: activiti
tags:
 - activiti
 - bpmn2.0
 - 发布
---

## 1. 圣诞大礼包

这是我第一次为Activiti的发布撰文，因为这次的发布我觉得很有必要和大家分享，这其中包含了我期待的新特性和已知问题的修复；而且还有一个重量级的模块[Activiti Modeler](/activiti/2012/09/30/new-version-of-activiti-modeler.html)。

在5.8版本之前一直以每两个月一版的的频率发布，但是在5.8~5.10之间波动比较大，5.9和5.10都是5个月才发布一版，不过从5.11开始又开始恢复每两个月一版的频率了，我认为短周期的发布有利于占领市场，对于开发者来说能尽快修复比较严重的问题。

5.11版本在代码管理方面做了很大调整，首先把源码由原来的svn转移到了[Github](https://github.com/Activiti/Activiti)有利于引擎的发展，可以让更多的开源爱好者参与进来，大家一起捉虫，想Activiti Team提交自己的想法，Github可以很好的满足这些；通过Github的“[Fork](https://github.com/Activiti/Activiti/fork)”我们可以很容易的做到这些。

## 2. 新特性及优化

1. **新模块Activiti Modeler**：添加了Web版本的流程定义设计器—Activiti Modeler到Activiti Explorer中，而且两者可以无缝结合；可以把Modeler设计的流程定义部署到Exploer中，也可以以已部署的流程定义为基础进行修改后重新部署。具体的使用可以参考[这里](/activiti/2012/09/30/new-version-of-activiti-modeler.html)。

2. **汉化Activiti Explorer**：本人有幸参与并完成了汉化工作，[汉化介绍](/activiti/2012/09/30/activiti-explorer-i18n-for-chinese.html)。

3. **添加Native Query**：允许通过本地SQL方法查询Activiti的对象；在这之前查询一直是一个比较头疼的事情，因为开发人员只能使用一些Query对象显示调用设置属性的方法过滤，如果想做到自定义条件查询没有这类接口提供；现在可以使用下面的方式灵活组装查询条件。参考手册的Query API部分。

4. **历史变量查询功能增强**：在5.11之前的版本中变量和表单属性（表单的字段，动态表单和外置表单）保存在同一张表中**ACT_HI_DETAIL**，以DETAIL的TYPE区分（**FormProperty**和**VariableUpdate**）；在5.11中把两者做了分离，添加了一张表**ACT_HI_VARINST**专门用来存储变量（也就是在ACT_HI_DETAIL中类型为VariableUpdate类型的记录），这样表单的字段和变量就区分开来了（表单字段类型是**字符型**，变量有**具体的类型**）；并且专门添加了一个变量实例接口**HistoricVariableInstance**，以及对应的变量实例查询对象**HistoricVariableInstanceQuery**。

5. **运行时变量删除**：允许通过API方式删除流程实例或者任务的相关变量，调用方式：runtimeService.removeVariable('foo')

6. **改进挂起与激活状态**：在5.9版本时我曾在JIRA提交了一个改进意见[ACT-1228](http://jira.codehaus.org/browse/ACT-1228)，不过最后被关闭了……在5.11中终于支持了这一特性，当挂起一个流程实例的时候同时也把相关的任务挂起；原来针对流程定义的挂起与激活功能也进行了优化，可以选择当挂起或者激活某个流程定义时是否挂起相关的流程实例，并且允许定时执行挂起与激活任务（利用Job，定时器）。如此，对于一些流程实例或者流程定义暂时不需要处理时就可以利用挂起功能，在待办任务列表仅显示处于激活状态的即可。

7. **优化对DB2和MSSQL的支持**：在SQL脚本方面做了优化。

8. **允许在Java Delegate中调用引擎Service接口**：当为某个活动添加了一个Java Service任务设置了Java Delegate时如果需要获取引擎的7个Service，只能通过自己写工具类的方式获取，或者用Spring代理监听或者Java Delegate类用注入的方式实现。**现在**可以通过**DelegateExecution**的对象获取，详细请参考[这里](http://www.jorambarrez.be/blog/2012/10/25/call-a-service-in-a-service-tas/)。

9. **结构调整**：抽取独立的模块（jar包）activiti-explorer、activiti-rest，对应的activiti-webapp-explorer2依赖activiti-explorer，activiti-webapp-rest2依赖activiti-rest；如此我们可以很容的把这两个模块集成到现有系统中。创建新的模块：activiti-bpmn-converter、activiti-bpmn-model、activiti-json-converter作为基础的组件，提供bpmn文件的解析以及转换功能（稍后会写篇文章专门讲解如何使用这些基础组件）。

除了以上的改进和新特性之外还修复了大量的Bug，完整的Changlog请参考[JIRA](http://www.activiti.org/readme.html)。

## 3. 下载新版本

5.11版本下载地址：[https://github.com/downloads/Activiti/Activiti/activiti-5.11.zip](https://github.com/downloads/Activiti/Activiti/activiti-5.11.zip)

	压缩包中的wars目录包含两个文件，activiti-rest模块可以单独部署了，修改数据库配置就可以作为自己的REST服务使用。

Github上的5.11分支：[https://github.com/Activiti/Activiti/tree/activiti-5.11](https://github.com/Activiti/Activiti/tree/activiti-5.11)

## 4. 升级建议

5.11版本是一个改进版本，添加了很多有用的新特性，很值得升级；当然在升级产品环境之前做好充分的测试并备份数据。

## 5. 版本5.12前瞻

1. 在5.11发布之前我曾在JIRA提交了一个关于Activiti Explorer中流程图的一个Bug-[ACT-1469](http://jira.codehaus.org/browse/ACT-1469)，是的，又被关闭了；不过后来在twitter上和Activiti的Team Leader 交流了一下，我分享了我的做法并得到了他的肯定，而且想让我参与到开发中用Javascript和Css方式实现流程图的跟踪功能。

2. 另外国内开发者遇到的流程图中文乱码问题也考虑在5.12版本中给出解决方案，这一点我也和[Tijs](http://twitter.com/tijsrademakers)进行了讨论，我的想法是在引擎配置中添加一个字体名称的设置项，对于英文字符集之外的国家就可以通过这个配置使用本地语言的字体以解决乱码问题。
