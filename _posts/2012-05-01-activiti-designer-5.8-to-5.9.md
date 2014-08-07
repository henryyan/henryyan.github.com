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

## 6.Activiti Designer 5.9之后版本中设置自动生成图片

5.9版本中禁用了自动生成图片功能之后在5.9.2中又恢复了此功能，但是需要配置之后才能使用，配置方式比较简单。

Windows->Preferences->Activiti->Save，勾选复选框，如下图：

![Eclipse中设置自动生成图片](/files/2012/05/activiti-designer-5.9-auto-generate-image.png)

## 7.Activiti Designer 5.9.3中缺失的两个快捷菜单

在官网提供的用户手册中介绍到了两个快捷菜单：“Create deployment artifacts”和“Import BPMN20 file”。

好像是5.9版本就移除了，我一直不用这两项功能所以没注意。

### 7.1 可能不合理的功能移除：Create deployment artifacts

为什么说可能呢？从两方面解释：

* **不合理**：不能快速打包bar文件了，需要自己手动把资源文件压缩成zip（bar就是zip文件）；尤其是5.9之后不能想5.9之前那样自动生成bpmn20.xml文件，不过读者可以参考手动打包：![如何打包Activiti的流程及图片文件](/activiti/2012/07/18/how-to-pack-process-resources.html)
* **合理**：从开始使用Designer我就觉得这是一个很鸡肋的功能，因为默认是把整个项目中设计的所有流程都打包到一个文件中，不能部分打包。在实际使用中都是一个一个流程设计的，打包流程资源文件肯定是分开的，一个模块打包一个bar文件，这样在部署应用之后只要部署单个流程就可以了，而不是每次都把所有的流程都部署一遍。

### 7.2 合理的功能移除：Import BPMN20 file

说合理是因为5.9版本之前因为存在.activiti文件，此功能就是通过bpmn20.xml转换为.activiti文件；但是在5.9中已经抛弃了.activiti文件而用bpmn代替，可以接受。

	不过有些人可能会需要这两项功能，论坛也有人提出了这个疑问，同时我也提交了JIRA希望还原这两项功能。

## 8.更新记录

1. <font color='red'>2012-05-19</font>：**Fixed**：已经在**5.9.2**版本修复次不能自动生成图片问题；JIRA：[https://jira.codehaus.org/browse/ACT-1210](https://jira.codehaus.org/browse/ACT-1210)

2. <font color='red'>2012-05-25</font>，**Bug**：安装了5.9.2版本插件之后在JAVAEE视图不能显示项目列表，JIRA:[https://jira.codehaus.org/browse/ACT-1227](https://jira.codehaus.org/browse/ACT-1227)

3. <font color='red'>2012-05-27</font>，**Bug**：流程的标签定位不正确问题，JIRA：[http://jira.codehaus.org/browse/ACT-1233](http://jira.codehaus.org/browse/ACT-1233)，因为重复报告已被关闭：[http://jira.codehaus.org/browse/ACT-1200](http://jira.codehaus.org/browse/ACT-1200)
