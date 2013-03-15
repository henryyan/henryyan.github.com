---
layout: post
title: "Activiti 5.12发布"
category: activiti
tags:
 - activiti
 - bpmn2.0
 - 发布
---

## 1. 5.12版本重要改变

1. 在Activiti Explorer中添加了基于Javascript的流程图查看功能，由[Raphaël](http://raphaeljs.com/)提供画图支持，支持全部浏览器；这个功能是我在5.11版本发布之后提出的，后来Tijs说让我帮忙做一个，最后用jQuery实现了（和[kft-activiti-demo](/activiti/2012/05/26/kft-activiti-demo.html)里面的跟踪效果一样，后来tijs告诉我有人在做了，所以我就取消了这个任务），效果图在下面。
2. 统一了BPMN解析，可以应用于引擎、Activiti Designer、Activiti Modeler。
3. 添加Activiti Kickstar到Activiti Explorer，让不懂BPMN规范的人也可以设计简单流程（设计的流程都是顺序流，设计的时候不要在assignee<办理人>字段填写值，否则会报错）。
4. 简化并扩充了Activiti Camel模块。
5. 在Activiti Explorer中添加了报表功能，可以以用户、任务、流程等维度生成图形报表。
6. 添加auto-layout模块，可以应用与KickStart和Modeler（还未验证）。
7. 添加了针对Script Task的Execution监听解析。
8. 支持流程定义缓存，可以减少数据库读取。
9. 一些其他的Bug修复。

## 2. 详细Release Notes

<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1565'>ACT-1565</a>] -         activiti-bpmn-converter BaseBpmnXMLConverter ignores defaultFlow for Gateways
</li>
</ul>
        
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://jira.codehaus.org/browse/ACT-863'>ACT-863</a>] -         HistoricVariableUpdate#getValue() throws NPE for JPA entities
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-995'>ACT-995</a>] -         Not possible to update/overwrite a JPA entity in workflow
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1025'>ACT-1025</a>] -         Methods deleteDeployment(String deploymentId, ...) and deleteDeploymentCascade(String deploymentId, ...) do not throw an exception with passed a non-existent deployementId
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1026'>ACT-1026</a>] -         Inclusive gateway isn&#39;t properly joining sequence flows coming from call activities
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1040'>ACT-1040</a>] -         TaskManager.findTaskById does not utilize session cache
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1054'>ACT-1054</a>] -         Unable to complete user task coming from parallel gateway
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1196'>ACT-1196</a>] -         Invalid login screen localization on non-utf-8 based hosts
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1204'>ACT-1204</a>] -         InclusiveGateway with two subprocesses does not join correctly
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1317'>ACT-1317</a>] -         Wrong task event generated when setting assignee to null
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1345'>ACT-1345</a>] -         method name orderByHistoricActivityInstanceStartTime in class HistoricTaskInstanceQuery should be orderByHistoricTaskInstanceStartTime
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1372'>ACT-1372</a>] -         User Task with form: form will be not displayed if the value expression in next line used
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1377'>ACT-1377</a>] -         removeVariables() in VariableScopeImpl does not consider parent scopes
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1414'>ACT-1414</a>] -         ClassCastException when completing a referenced sub process after Boundary Event with cancelActivity = false
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1417'>ACT-1417</a>] -         Fix Explorer session serialization
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1418'>ACT-1418</a>] -         NullPointerException if throw a not catched exception/error
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1470'>ACT-1470</a>] -         Import definition type fails with CxfWSDLImporter when using complex data types
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1477'>ACT-1477</a>] -         In user guide error api for form property from history detail
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1479'>ACT-1479</a>] -         activiti-engine has invalid symbolic name
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1486'>ACT-1486</a>] -         The ability to add an attachment to a process instance is broken
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1494'>ACT-1494</a>] -         Get garbled string when render form in chines
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1499'>ACT-1499</a>] -         Form properties not initialized when null or empty
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1502'>ACT-1502</a>] -         Custom font name in the engine for diagram
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1504'>ACT-1504</a>] -         Cannot create new user and membership in JavaDelegate using identityService
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1512'>ACT-1512</a>] -         HistoricVariableUpdates no longer returned when using postgres
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1516'>ACT-1516</a>] -         BPMN Converter: Adding a listener to a script task produces erroneous XML content.
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1524'>ACT-1524</a>] -         Variable update detection does not work for byte[]
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1528'>ACT-1528</a>] -         All variables are deleted after delete a history processinstance
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1533'>ACT-1533</a>] -         Undeployment of old process versions deletes jobs for TimerStartEvents
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1540'>ACT-1540</a>] -         HistoricVariableInstance does not expose taskId, nor does HistoricVariableQuery expose querying based on taskId
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1546'>ACT-1546</a>] -         Impossible to assign default flow on exclusive gateways
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1553'>ACT-1553</a>] -         Refactor BpmnParse to use separate handlers for each bpmn element
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1555'>ACT-1555</a>] -         ProgrammaticBeanLookup doesn&#39;t regard alternatives
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1556'>ACT-1556</a>] -         BpmnDeployer creates duplicates identity links when deploying processes with initiation authorization active
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1579'>ACT-1579</a>] -         Process engine can be DoS&#39;ed when deploying unsafe XML
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1586'>ACT-1586</a>] -         ExecutionQuery returns wrong results when using multi instance on a receive task
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1596'>ACT-1596</a>] -         Not generated boundary event in diagram created by RaphaÃ«l
</li>
</ul>
            
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1274'>ACT-1274</a>] -         Remove SEVERE level logging for expected exception in taskservice.claim()
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1324'>ACT-1324</a>] -         Add specific exceptions for common error scenarios (TaskNotFoundException if a task if not found etc)
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1463'>ACT-1463</a>] -         Review rest-response codes and error-body response
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1498'>ACT-1498</a>] -         IntermediateCatchEventActivitiBehaviour name does not match other ActivityBehavior&#39;s
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1505'>ACT-1505</a>] -         Should throw an exception if the picture is not generated
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1561'>ACT-1561</a>] -         Add the ability to register a TaskListener for all event types
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1568'>ACT-1568</a>] -         Query API documentation out of sync with codebase
</li>
</ul>
    
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://jira.codehaus.org/browse/ACT-432'>ACT-432</a>] -         Terminate end event
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1164'>ACT-1164</a>] -         Add possibility to hook in own implementation of BusinessRuleTask
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1493'>ACT-1493</a>] -         Make DeploymentCache pluggable and allow to set cache limit
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1511'>ACT-1511</a>] -         Extract ActivityBehavior and Task/ExecutionListener instantiation in a pluggable factory
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1518'>ACT-1518</a>] -         Add generic simple workflow creator API to activiti
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1537'>ACT-1537</a>] -         Allow to configure whether script variables are stored as process variables
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1569'>ACT-1569</a>] -         Introduce process instance scope for signal events
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1571'>ACT-1571</a>] -         Auto layout for BPMN 2.0 processes
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1572'>ACT-1572</a>] -         Designer should generate XML with delegationExpression
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1574'>ACT-1574</a>] -         Loop type for subprocess in Modeler
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1580'>ACT-1580</a>] -         Add method to retrieve BpmnModel (Pojo version of BPMN 2.0 process) to RepositoryService
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1588'>ACT-1588</a>] -         Native query support paging
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1593'>ACT-1593</a>] -         Basic reporting for Explorer
</li>
</ul>
        
<h2>        Task
</h2>
<ul>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1031'>ACT-1031</a>] -         Rename JobQuery methods
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1397'>ACT-1397</a>] -         Remove Account related service operations from IdentityService
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1465'>ACT-1465</a>] -         Document services in userguide
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1538'>ACT-1538</a>] -         Move BpmnParseListener to public API package
</li>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1581'>ACT-1581</a>] -         Refactor ProcessDiagramGenerator to take BpmnModel as input instead of ProcessDefinitionEntity
</li>
</ul>
        
<h2>        Wish
</h2>
<ul>
<li>[<a href='https://jira.codehaus.org/browse/ACT-1362'>ACT-1362</a>] -         Extend JPAEntityMappings to support UUID as Id
</li>
</ul>


## 3. 值得关注的重要Bug及新功能

1. 移除了**org.activiti.engine.impl.bpmn.parser.BpmnParseListener**以及相关类，取而代之的是在引擎中配置实现监听器触发方式，在用户手册的第17章有详细介绍。
2. 在5.11版本中最严重的一个Bug应该属于[ACT-1528](https://jira.codehaus.org/browse/ACT-1528)，当删除一个流程实例时这个Bug会导致整个ACT_HI_VARINST表被清空！！！  如果使用5.11的建议升级到5.12，或者自己打补丁。
3. 自动生成的图片导致中文乱码，这个问题在5.12里面我已经彻底解决了，解决办法是在引擎里面配置属性**activityFontName**，配置成中文字体的文件名就可以了。
4. 支持终止结束事件。
5. Native Query是在5.11版本中添加的，很好的解决了固定API查询不够灵活的问题，但是不支持分页查询，只能自己在sql中添加分页语句与参数；在5.12版本发布之前我提交了支持分页查询的代码，代码也合并到了master分支，但是在发布之前又还原了（因为不支持db2与sqlserver分页），我又紧急修复提交，可惜最终没有合并到5.12中，不过5.12发布之后我发布了5.12.1版本用于弥补这一遗憾（后面公布地址）。

## 4. 我的Activiti分支5.12.1

### 4.1 Maven仓库
使用Maven的方式发布，托管在Github，在仓库中添加如下配置：

<pre class="brush:xml">
<repository>
	<id>henryyan-mavenrepo</id>
	<url>https://raw.github.com/henryyan/mavenrepo/master/releases</url>
</repository>
</pre>

### 4.2 直接下载源码

1. [activiti-engine-5.12.1.jar](https://raw.github.com/henryyan/mavenrepo/master/releases/org/activiti/activiti-engine/5.12.1/activiti-engine-5.12.1.jar)
2. [activiti-bpmn-model-5.12.1.jar](https://raw.github.com/henryyan/mavenrepo/master/releases/org/activiti/activiti-bpmn-model/5.12.1/activiti-bpmn-model-5.12.1.jar)
3. [activiti-bpmn-converter-5.12.1.jar](https://raw.github.com/henryyan/mavenrepo/master/releases/org/activiti/activiti-bpmn-converter/5.12.1/activiti-bpmn-converter-5.12.1.jar)
4. [activiti-spring-5.12.1.jar](https://raw.github.com/henryyan/mavenrepo/master/releases/org/activiti/activiti-spring/5.12.1/activiti-spring-5.12.1.jar)

## 5. 对5.13版本的期待

	支持更多BPMN2.0规范！！！

## 6. 附图
![image](/files/2013/03/activiti-explorer-diagram-viewer.png)
![image](/files/2013/03/activiti-explorer-report.png)


