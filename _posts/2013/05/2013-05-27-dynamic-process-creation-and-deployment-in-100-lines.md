---
layout: post
title: "利用100行代码动态创建并部署流程"
category: activiti 
tags: 
 - activiti
 - 动态
 - 部署
---

英文原文：[Dynamic Process Creation and Deployment in 100 Lines of Code](http://stacktrace.be/blog/2013/03/dynamic-process-creation-and-deployment-in-100-lines/)

这是一篇迟到的博文，几个月前我就准备把它整理出来发布，由于时间原因就搁置了。。。

## 1. 关于Activiti中的BPMN Model

在5.12版本中把各个模块进行了大幅度的划分，值得一提的就是activiti-bpmn-的几个模块（activiti-bpmn-converter、activiti-bpmn-layout、activiti-bpmn-model）。

* activiti-bpmn-model：包含了BPMN2.0规范中部分对应的Java定义（也包括Activiti自己扩展的），描述了一些基本属性、结构；
* activiti-bpmn-converter：该模块负责对Model对象与XML进行互转；
* activiti-bpmn-layout：可以根据流程定义文件中的XML定义生成BPMN DI信息（定义了流程中每一个活动的坐标、宽度、高度等）。

## 2. activiti-dynamic-process

Activiti团队核心成员**frederikheremans**创建了[activiti-dynamic-process](https://github.com/frederikheremans/activiti-dynamic-process)项目，该项目利用以上的几个模块演示了如何动态创建流程并部署运行，这几个步骤仅仅用了100行代码（还可以继续精简，但是这不是重点，重点在于体现Activiti的灵活性）。

<pre class="brush:java">
@Test
public void testDynamicDeploy() throws Exception {
  // 1. Build up the model from scratch
  BpmnModel model = new BpmnModel();
  Process process = new Process();
  model.addProcess(process);
  process.setId("my-process");

  process.addFlowElement(createStartEvent());
  process.addFlowElement(createUserTask("task1", "First task", "fred"));
  process.addFlowElement(createUserTask("task2", "Second task", "john"));
  process.addFlowElement(createEndEvent());

  process.addFlowElement(createSequenceFlow("start", "task1"));
  process.addFlowElement(createSequenceFlow("task1", "task2"));
  process.addFlowElement(createSequenceFlow("task2", "end"));

  // 2. Generate graphical information
  new BpmnAutoLayout(model).execute();

  // 3. Deploy the process to the engine
  Deployment deployment = activitiRule.getRepositoryService().createDeployment()
    .addBpmnModel("dynamic-model.bpmn", model).name("Dynamic process deployment")
    .deploy();

  // 4. Start a process instance
  ProcessInstance processInstance = activitiRule.getRuntimeService()
    .startProcessInstanceByKey("my-process");

  // 5. Check if task is available
  List tasks = activitiRule.getTaskService().createTaskQuery()
    .processInstanceId(processInstance.getId()).list();

  Assert.assertEquals(1, tasks.size());
  Assert.assertEquals("First task", tasks.get(0).getName());
  Assert.assertEquals("fred", tasks.get(0).getAssignee());

  // 6. Save process diagram to a file  
  InputStream processDiagram = activitiRule.getRepositoryService()
    .getProcessDiagram(processInstance.getProcessDefinitionId());
  FileUtils.copyInputStreamToFile(processDiagram, new File("target/diagram.png"));

  // 7. Save resulting BPMN xml to a file
  InputStream processBpmn = activitiRule.getRepositoryService()
    .getResourceAsStream(deployment.getId(), "dynamic-model.bpmn");
  FileUtils.copyInputStreamToFile(processBpmn, 
    new File("target/process.bpmn20.xml"));
}

protected UserTask createUserTask(String id, String name, String assignee) {
  UserTask userTask = new UserTask();
  userTask.setName(name);
  userTask.setId(id);
  userTask.setAssignee(assignee);
  return userTask;
}

protected SequenceFlow createSequenceFlow(String from, String to) {
  SequenceFlow flow = new SequenceFlow();
  flow.setSourceRef(from);
  flow.setTargetRef(to);
  return flow;
}

protected StartEvent createStartEvent() {
  StartEvent startEvent = new StartEvent();
  startEvent.setId("start");
  return startEvent;
}

protected EndEvent createEndEvent() {
  EndEvent endEvent = new EndEvent();
  endEvent.setId("end");
  return endEvent;
}
</pre>

部署后获取流程图如下所示：
![](/files/2013/05/diagram.png)

## 3. 实现步骤

按照从代码清单中的7步依次分析：

1. 利用BPMN-Model创建了开始、结束事件、2个用户任务以及其他的输出流；
2. 利用BpmnAutoLayout类生成BPMN DI信息，这样在部署时引擎可以根据BPMN DI信息生成流程图；
3. 创建DeploymentBuilder对象调用addBpmnModel方法直接通过Model对象部署流程；
4. 启动流程；
5. 获取所有用户任务，并验证任务的信息；
6. 导出流程图，如果没有执行第二步操作导不出流程图；
7. 导出流程定义文件（XML格式，包含BPMN DI信息）

## 4. 抛砖引玉

利用这个Demo可以在不借助可视化流程设计器的情况下动态设计流程，进一步提升了应用的灵活性；当然如果你熟悉了以上的几个模块也可以自己扩展实现特定功能，例如Activiti中的Email Task就是一个特殊的活动类型，它继承于Service Task，所以你也可以参考它做自己的实现。