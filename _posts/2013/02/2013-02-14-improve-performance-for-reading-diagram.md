---
layout: post
title: "利用静态服务提升读取Activiti流程图的性能"
category: activiti
tags: 
 - activiti
 - 静态
 - 流程图
 - nginx
 - apache
---

## 1. 现有模式
流程图可以方便用户浏览整个流程的处理过程，或者跟踪参与过的流程的处理状态（当前处于哪个节点、谁在办理、时间等信息），首先需要调用引擎的API读取流程图（二进制流形式），代码如下：

<pre class="brush:java">
InputStream resourceAsStream = repositoryService.getResourceAsStream(deploymentId, resourceName);
byte[] b = new byte[1024];
int len = -1;
while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
  response.getOutputStream().write(b, 0, len);
}
</pre>

### 1.1 性能问题
对于上面的代码当经常需要读取图片资源时每次都需要在数据库读取上花费时间，用java输出二进制流也需要一定的时间消耗，所以在一定程度上影响了性能，导致图片读取**速度慢**甚至**超时**。

从上面的代码可以看出当从前端读取一张图片资源时需要经过一下几个步骤：

1. 发送HTTP请求
2. 根据资源名称（图片文件名称，可以从流程定义对象获取）和Deployment ID读取二进制流
3. 把二进制流输出到前端

如果多个用户请求同一个资源那就要把以上的三个步骤**for...each**执行**N**次，也就是说**N-1**次的数据库读取是浪费的，因为流程定义对象是唯一的，每一次部署后引擎都会把和流程定义生成的图片（或者部署时提供的图片资源）保存到数据库，当需要时通过上面的代码读取，如果把第一次读取的流程资源（泛指和流程有关的各种资源文件）缓存起来可以解决这个问题。

有的读者可能想到使用一个全局Map来保存，但是这样会消耗大量的内存，此举不推荐。

## 2. 使用静态资源做缓存

大家都知道HTTP服务器最适合做静态资源的访问，例如Apahce、Nginx等；考虑一下这样的一个部署流程的步骤：

1. 调用引擎的部署流程API
2. 读取该次部署的所有需要缓存的资源
3. 把换成的资源二进制流保存（持久化）到硬盘上的某个目录（暂且称之为**diagrams**）
4. 用Apache或者Nginx以目录**diagrams**开启一个目录服务（可以列出目录中的子目录和文件）
5. 前端访问图片资源时直接从静态服务获取，访问资源的路径可以通过流程定义或许，例如：<pre>http://aws.kafeitu.me:10000/diagrams/leave-formkey/1/leave-formkey.png</pre> **leave-formkey**表示流程定义的**KEY**属性，**1**表示**版本号**，**leave-formkey.png**表示**资源名称**

### 2.1 导出图片资源
为大家提供一个通用方法可以导出已部署流程定义的流程图，保存到硬盘上的指定目录。

<pre class="brush:java">
/**
* 导出图片文件到硬盘
* 
* @return 文件的全路径
*/
public static String exportDiagramToFile(RepositoryService repositoryService,
		ProcessDefinition processDefinition, String exportDir) throws IOException {
	String diagramResourceName = processDefinition.getDiagramResourceName();
	String key = processDefinition.getKey();
	int version = processDefinition.getVersion();
	String diagramPath = "";

	InputStream resourceAsStream = repositoryService
			.getResourceAsStream(processDefinition.getDeploymentId(), diagramResourceName);
	byte[] b = new byte[resourceAsStream.available()];

	@SuppressWarnings("unused")
	int len = -1;
	resourceAsStream.read(b, 0, b.length);

	// create file if not exist
	String diagramDir = exportDir + "/" + key + "/" + version;
	File diagramDirFile = new File(diagramDir);
	if (!diagramDirFile.exists()) {
	  diagramDirFile.mkdirs();
	}
	diagramPath = diagramDir + "/" + diagramResourceName;
	File file = new File(diagramPath);

	// 文件存在退出
	if (file.exists()) {
	  // 文件大小相同时直接返回否则重新创建文件(可能损坏)
	  logger.debug("diagram exist, ignore... : {}", diagramPath);
	  return diagramPath;
	} else {
	  file.createNewFile();
	}

	logger.debug("export diagram to : {}", diagramPath);

	// wirte bytes to file
	FileUtils.writeByteArrayToFile(file, b, true);
	return diagramPath;
}
</pre>

在部署流程时调用一下方法**exportDiagramToFile()**即可。

### 2.2 搭建静态资源服务

根据实际情况选择使用Apache、Nginx或者仅仅用于测试，例如笔者在亚马逊的AWS上使用python的SimpleHttpServer开启了一个简单的目录服务: [http://aws.kafeitu.me:10000](http://aws.kafeitu.me:10000) ，其中的**diagrams**目录中的文件就是通过方法**exportDiagramToFile**导出的。

## 3. 从静态服务读取资源
**原来**的URL是这样拼接的：
<pre class="brush:html">
&lt;a target="_blank" href='${ctx }/workflow/resource/deployment?deploymentId=${process.deploymentId}&resourceName=${process.diagramResourceName }'>${process.diagramResourceName }</a>
</pre>

**现在**是这样：
<pre class="brush:html">
&lt;a target="_blank" href='http://localhost:10000/${process.key}/${process.version}/${process.diagramResourceName }'>${process.diagramResourceName }</a>
</pre>

> 性能提升大概在三倍左右，具体取决于使用的静态服务和网速。

## 4. kft-activiti-demo的1.6.0-cache-diagram分支

特性分支：[https://github.com/henryyan/kft-activiti-demo/tree/1.6.0-cache-diagram](https://github.com/henryyan/kft-activiti-demo/tree/1.6.0-cache-diagram)

此分支的特性就是部署时自动把图片导出到硬盘，利用静态服务作为图片资源的来源，具体请参考该分支的**README.md**。