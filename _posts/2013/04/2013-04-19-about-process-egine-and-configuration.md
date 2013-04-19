---
layout: post
title: "谈谈Activiti的引擎与引擎配置对象"
category: activiti
tags: 
 - activiti
 - 引擎配置对象
 - ProcessEngineConfiguration
---

## 1. 引擎配置对象ProcessEngineConfiguration

引擎配置是配置Activiti的第一步，无论你使用Standalone还是Spring管理引擎都可以在配置文件中配置参数，虽然目前Activiti支持多种引擎配置对象，但是均继承自一个基础的配置对象（抽象类）*org.activiti.engine.ProcessEngineConfiguration*。

除了基础的引擎配置对象之外还有一下几个具体的实现，不同的场合使用不用的引擎实现，均继承自*org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl*

1. **StandaloneProcessEngineConfiguration：**标准的单机引擎配置对象，默认读取activiti.cfg.xml文件的配置
2. **StandaloneInMemProcessEngineConfiguration**：用于测试环境，jdbcUrl配置为jdbc:h2:mem:activiti，数据库的DDL操作配置：create-drop，在日常的快速测试中经常用到
3. **JtaProcessEngineConfiguration：**顾名思义，支持JTA
4. **SpringProcessEngineConfiguration：**这个恐怕是用的最多的一个，由Spring代理创建引擎，最最重要的是如果把引擎嵌入到业务系统中可以做到业务事务与引擎事务的统一管理

至于引擎中可以配置哪些属性在手册里面已经介绍了一部分，还有一部分隐藏的属性未介绍，如果有需要可以查看每个引擎中的**setter**方法覆盖默认值。

## 2.配置引擎的别名以及获取引擎对象

Activiti允许创建多个引擎，每个引擎用别名区分，可以在引擎配置对象中设置一下属性，默认的引擎别名为：**default**。

### 2.1 标准方式

<pre class="brush:xml">
<property name="processEngineName" value="myProcessEngine"></property>
</pre>
其中的**myProcessEngine**即为引擎的别名，当需要获取引擎对象时可以通过下面的代码获取：

<pre class="brush:java">
ProcessEngine myProcessEngine = ProcessEngines.getProcessEngine("myProcessEngine");
</pre>

当然如果只有一个引擎获取就更简单了，下面的代码可以直接获取一个默认的引擎对象。
<pre class="brush:java">
ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
// 等价于 ProcessEngines.getProcessEngine("default");
</pre>

### 2.2 Spring方式

如果使用了Spring代理引擎可以使用“Spring”风格方式获取引擎对象，例如下面的配置：
<pre class="brush:xml">
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	<property name="dataSource" ref="dataSource"></property>
    <property name="transactionManager" ref="transactionManager"></property>
    <property name="databaseSchemaUpdate" value="true"></property>
    <property name="jobExecutorActivate" value="false"></property>
    ...
</bean>
</pre>

<pre class="brush:java">
@Controller
@RequestMapping(value = "/workflow")
public class ActivitiController {
	@Autowired
	ProcessEngineFactoryBean processEngineFactoryBean;
	
	@RequestMapping(value = "/print")
  	public ModelAndView processList(HttpServletRequest request) {
  		ProcessEngine processEngine = processEngineFactoryBean.getObject();
  	}
}
</pre>

### 2.3 在引擎外部设置引擎配置对象

或许这个小节的标题看不懂了。。。

原因是这样的，众所周知，在默认的配置情况下部署包含中文的流程文件会导致中文乱码（Linux、Windows，Mac平台没问题），所以需要覆盖引擎默认的字体配置属性（活动的字体与输出流文字字体），例如下面的配置：
<pre class="brush:xml">
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	<property name="activityFontName" value="宋体"></property>
    <property name="labelFontName" value="宋体"></property>
    ...
</bean>
</pre>
字体名称根据平台的不同其值也不同，例如在Windows平台下可以使用诸如**宋体**、**微软雅黑**等，但是在Linux平台下引擎没有这些字体（或者名称不同）需要特殊设置，kft-activiti-demo的在线demo部署在Ubuntu Server上，而且是纯英文系统没有中文字体，为了解决部署后以及流程跟踪时的中文乱码问题我从Windows平台复制了宋体字体文件解决，字体的文件名为**simsun.ttc**，使用的配置如下所示：
<pre class="brush:xml">
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	<property name="activityFontName" value="simsun"></property>
    <property name="labelFontName" value="simsun"></property>
    ...
</bean>
</pre>

这样就解决了部署流程时的中文乱码问题，但是没有解决流程跟踪时的乱码问题。。。

原因在于流程图生成工具类**ProcessDiagramGenerator**会从当前的ThreadLocal中获取引擎配置对象，但是目前仅仅是引擎自动在内部实现时把引擎配置对象设置到ThreadLocal中，所以很多人遇到在Struts(2）或者Spring MVC中直接调用下面的代码得到的图片是乱码：
<pre class="brush:java">
InputStream imageStream = ProcessDiagramGenerator.generateDiagram(bpmnModel, "png", activeActivityIds);
</pre>

既然知道引擎从ThreadLocal中获取引擎配置对象，而且我们已经获取了引擎对象（也就是说可以从中获取引擎配置对象），解决问题的办法很简单，手动把引擎配置对象设置到ThreadLocal中就解决问题了；下面的代码在kft-activiti-demo的ActivitiController类中。
<pre class="brush:java">
@RequestMapping(value = "/process/trace/auto/{executionId}")
public void readResource(@PathVariable("executionId") String executionId, HttpServletResponse response)
throws Exception {
  ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
  .processInstanceId(executionId).singleResult();
  BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
  List<String> activeActivityIds = runtimeService.getActiveActivityIds(executionId);
  // 不使用spring请使用下面的两行代码
  //    ProcessEngineImpl defaultProcessEngine = (ProcessEngineImpl) ProcessEngines.getDefaultProcessEngine();
  //    Context.setProcessEngineConfiguration(defaultProcessEngine.getProcessEngineConfiguration());
  // 使用spring注入引擎请使用下面的这行代码
  Context.setProcessEngineConfiguration(processEngine.getProcessEngineConfiguration());

  InputStream imageStream = ProcessDiagramGenerator.generateDiagram(bpmnModel, "png", activeActivityIds);

  // 输出资源内容到相应对象
  byte[] b = new byte[1024];
  int len;
  while ((len = imageStream.read(b, 0, 1024)) != -1) {
    response.getOutputStream().write(b, 0, len);
  }
}
</pre>

关键就在于在调用生成流程图的方法之前调用一次Context.setProcessEngineConfiguration()方法即可，这样引擎就可以获取到引擎配置对象，从而获取到自定义的字体名称属性，乱码问题自然没有了。

## 3. 结束语

本文大概介绍了一下引擎配置对象以及如何获取引擎对象，并且就大家关注最多的中文乱码问题给出了完美解决办法，想了解引擎配置对象的本文可以作为一个引子，打开你探索引擎内部的大门；里面有很多属性都可以配置，花点时间研究会有意外收获，引擎的架构做的很棒，想玩转它就多花点时间探索它的奥秘，通过引擎配置对象可以打造完全定制化的引擎工作方式。
