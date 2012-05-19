---
layout: post
title: "从Activiti Designer5.8升级到5.9遇到的问题"
category: activiti
tags: 
 - activiti
 - designer
 - 5.9
 - 5.8
---

## 1.罗嗦几句

前几天升级了Activiti Designer 5.9版本，然后发现几个变动，有新功能也有不如人意的变动，因为5.9版本和5.8版本在设计文件上存在很大差异，所以今天也要说明如何从5.8转向5.9版本。

## 2.Activiti Designer5.9于5.8差异

* **修复：** 5.8版本中Eclipse快捷键(复制、粘帖)被更改为(Ctrl+Insert、Shift+Insert)，JIRA参加：[http://jira.codehaus.org/browse/ACT-992?focusedCommentId=297621](http://jira.codehaus.org/browse/ACT-992?focusedCommentId=297621)，Activiti社区：[http://forums.activiti.org/en/viewtopic.php?f=8&t=2701](http://forums.activiti.org/en/viewtopic.php?f=8&t=2701)

* **新增：** 可以快速生成针对流程定义的单元测试类，便于测试设计的流程定义是否能正常运行，So Good；

* **改动：** 5.9版本之前的设计器会创建一个**activiti**结尾的文件用来设计流程定义，保存时自动创建**foo.bpmn20.xml**文件和**foo.png**文件；而**5.9**版本仅仅只有一个文件，以**bpmn**结尾，而且保存时不会自动生成foo.png文件v_v。

关于Activiti 5.9的更新内容参见：[http://activiti.org/readme.html](http://activiti.org/readme.html)

## 3.从5.8版本迁移到5.9

### 3.1 在5.9版本的流程设计界面中打开5.8版本之前的流程定义文件

* 把之前的foo.activiti、foo.png文件删除

* 把foo.bpmn20.xml更改为foo.bpmn，因为bpmn文件的内容和foo.bpmn20.xml一样，只不过扩展名不同罢了

### 3.2 怎么生成流程图片

这个的确很头大，因为不能自动生成了，所以只能自己手动操作生成图片文件，而且这个操作是必须的，否则部署流程图会出现乱码问题，而且也影响美观（解决乱码问题后，自动生成的图片没有圆角，参考：[http://www.kafeitu.me/2012/03/22/workflow-activiti-action.html](http://www.kafeitu.me/2012/03/22/workflow-activiti-action.html)）。

**手动操作方法**：用Activiti Designer打开foo.bpmn文件，然后**右键**选择**Export Diagram...**，在弹出的对话框中设置图片的参数即可，一般使用默认就可以了。

### 3.3 怎么打包流程文件

Eclipse切换到**Activiti**视图，右键项目选择**Create deployment artifacts**，会自动在项目的根目录下面的**deployments**文件夹中生成foo.bar文件；

如果有监听器(Listener)或者JavaDelegate实现类还会生成foo.jar文件，包含FooListener等class文件。

## 4.之前打包流程文件的方法

我们是用ant脚本分模块分文件打包的，每个zip包中包含bpmn20.xml和png图片；所以现在只能先把流程图导出到和**foo.bpmn**所在的目录，最后再用ant脚本打包。

## 5.结束语

由原来的foo.activiti变成了foo.bpmn的确是进步，直接编辑最终的bpmn20.xml文件，如果之前需要手动修改bpmn20.xml内容，下次用GUI方式设计流程定义的时候可能会丢失手动添加的内容(有些功能设计器还没有界面操作)。

官方明确表示：不再自动生成图片了；[http://forums.activiti.org/en/viewtopic.php?f=8&t=3867](http://forums.activiti.org/en/viewtopic.php?f=8&t=3867)

不过大家可以多去这个帖子表达自己的请求：[http://forums.activiti.org/en/viewtopic.php?f=8&t=3867&start=0](http://forums.activiti.org/en/viewtopic.php?f=8&t=3867&start=0) 有可能下个版本能恢复也不一定。

如果有懂Eclipse Plugin开发的可以先把5.9之前的自动生成图片功能加上去。

## 6.更新记录

1. <font color='red'>2012-05-19</font>：已经在**5.9.2**版本修复次不能自动生成图片问题，**_等待更新_**；JIRA：[https://jira.codehaus.org/browse/ACT-1210](https://jira.codehaus.org/browse/ACT-1210)
