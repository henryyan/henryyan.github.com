---
layout: post
title: "如何打包Activiti的流程资源文件(bpmn20.xml、form、png)"
category: activiti 
tags: 
 - activiti
 - 打包
 - bar
 - zip
 - bpmn
 - png
---

## 1.资源文件介绍
Activiti的流程定义文件可以直接部署bpmn20.xml、zip、bar文件，其中后面的zip和bar类型一样都是压缩文件格式，bpmn20.xml是符合bpmn2.0规范的xml定义。
今天要解决的问题就是帮助大家打包流程资源文件，其中肯能包括：bpmn20.xml、png、form等文件。

大多数开发人员都是用Activiti Designer来设计流程定义，可能业务人员使用了其他的流程设计器来描述业务，然后开发人员用Activiti Designer来“深加工”以便让计算机能读懂流程的走向及其逻辑。

如何打包是最近“Activiti中文”群里问的比较多的问题之一，因为太忙没用时间一一说明，这也是因为目前的5.9版本设计器导致的，主要是在5.9版本之前设计器会自动生成一个bpmn20.xml文件，而5.9版本中不再使用之前的.activiti文件，直接把设计与最终的流程定义文件合并为一个bpmn文件。具体的说明请参考《[从Activiti Designer5.8升级到5.9遇到的问题](/activiti/2012/05/01/activiti-designer-5.8-to-5.9.html)》。

下面我们以kft-activiti-demo项目中的请假流程为例介绍如何打包，项目结构如下图。

![kft-activiti-demo中的流程定义目录](/files/2012/07/kft-activiti-demo-leave-process.png "kft-activiti-demo中的流程定义目录")

## 2.打包Zip|Bar格式

### 2.1 手动打包

看了刚刚提到的文章应该明白**leave.bpmn**和在5.8版本中生成的bpmn20.xml一样，所以可以直接把leave.bpmn复制一份改名为**leave.bpmn20.xml**，然后手动把**leave.bpmn20.xml**和**leave.png**用压缩工具打包成**leave.zip**即可。

### 2.2 Ant脚本自动打包

用ant脚本无非就是代替手动操作让工具自动根据配置打包，我在kft-activiti-demo（master分支）项目中添加了此功能，把里面的代码拿出来分享给大家。

<pre class="brush:xml">
<?xml version="1.0" encoding="UTF-8"?>
<project name="kft-activiti-demo" default="welcome">
	<!-- properties from files -->
	<property file="${user.home}/.kafeitu/build.properties" />
	<property file="build.properties" />

	<!-- properties from key value -->
	<property name="workflow.diagrams" value="src/main/resources/diagrams" />
	<property name="workflow.deployments" value="src/main/resources/deployments" />

	<!-- 流程定义：每个模块的路径 -->
	<property name="wd.leave" value="${workflow.diagrams}/leave" />

	<!-- 显示欢迎信息以及操作提示 -->
	<target name="welcome">
		<echo>Activiti演示程序，请输入命令后操作！</echo>
	</target>

	<!-- 请假流程定义打包 -->
	<target name="workflow.package.leave">
		<echo>打包流程定义：请假（自定义表单）</echo>
		<copy file="${wd.leave}/leave.bpmn" tofile="${wd.leave}/leave.bpmn20.xml" />
		<zip destfile="${workflow.deployments}/leave.zip" basedir="${wd.leave}" update="true" includes="*.xml,*.png" />
		<delete file="${wd.leave}/leave.bpmn20.xml" />
	</target>

	<!-- 流程定义打包 -->
	<target name="workflow.package.all" depends="workflow.package.leave">
	</target>
</project>

</pre>

----
熟悉Ant的读者很快就能看懂这些配置信息及其目的，对于不熟悉Ant的稍微介绍一下。

* 第4、5行处读取一些配置信息，目前还未用到外部配置，可以先忽略；
* 第7~13行处用于配置一些文件的路径，其中**workflow.diagrams**就是bpmn和png文件所在的目录，只不过里面又根据模块细分了；
* 第21~26行处才是重点，首先复制bpmn文件为bpmn20.xml，然后把bpmn20.xml和png文件打包成zip文件

使用方法如下：
<pre class="brush:shell">
➜ henryyan@hy-mbp  ~kad git:(master) ✗ ant workflow.package.all 
Buildfile: /Users/henryyan/work/projects/activiti/kft-activiti-demo/build.xml

workflow.package.leave:
     [echo] 打包流程定义：请假（自定义表单）
     [copy] Copying 1 file to /Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/diagrams/leave
      [zip] Updating zip: /Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/deployments/leave.zip
   [delete] Deleting: /Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/diagrams/leave/leave.bpmn20.xml

workflow.package.leave-dynamic-from:
     [echo] 打包流程定义：请假（动态表单）
     [copy] Copying 1 file to /Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/diagrams/leave-dynamic-from
      [zip] Updating zip: /Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/deployments/leave-dynamic-from.zip
   [delete] Deleting: /Users/henryyan/work/projects/activiti/kft-activiti-demo/src/main/resources/diagrams/leave-dynamic-from/leave-dynamic-from.bpmn20.xml

workflow.package.all:

BUILD SUCCESSFUL
Total time: 0 seconds
</pre>

如果有外部form文件也可以加入到zip包中。


## 3.打包bar格式

bar文件就是zip格式的，仅仅是扩展名不同而已，所以打包bar文件直接用上面的方式，只不过把扩展名**zip**更好成**bar**就可以了。

### 3.1 自动打包Bar文件

如何打包Bar我就不多说了，官网的手册已经说的很详细了，请移步：[http://www.activiti.org/userguide/index.html#eclipseDesignerBPMNFeatures](http://www.activiti.org/userguide/index.html#eclipseDesignerBPMNFeatures)，找到**Activiti Designer deployment features**有详细的说明。

	不过此功能在5.9版本Activiti Designer中已经被移除！
