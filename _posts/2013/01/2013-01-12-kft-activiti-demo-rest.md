---
layout: post
title: "如何使用Activiti Rest模块"
category: activiti
tags: 
 - activiti
 - rest
 - kft-activiti-demo
---

## 1. Activiti REST模块介绍


关于Rest的介绍就免除了，主要介绍一下Activiti Rest模块的功能以及如何使用。

### 1.1 使用REST的好处

1. **简单化**：利用现有模块（activiti-rest.war）代替直接API调用
2. **标准化**：各个系统根据rest模块的接口规范访问REST资源，统一处理；对于工作流平台来说此特性尤为突出
3. **扩展性**：如果官方提供的REST接口还不能满足可以继续在其基础上进行扩展以满足业务系统（平台）的需求

### 1.2 不适合使用REST的场景

**业务数据与流程数据分离:**就像kft-activiti-demo中**普通表单**的演示一样，业务数据保存在一张单独设计的表中，而不是把表单数据保存在引擎的变量表中，所以对于这样的场景中需要联合事务管理的就不能使用REST了，例如：启动流程、任务完成、业务与流程数据联合查询。

### 1.3 部署Rest模块

从[5.11](/activiti/2012/12/05/activiti-5-11-release.html)版本开始不再使用ant脚本的方式启动demo，并且把activiti-explorer和activiti-rest分离并分别提供一个war包，在**wars**目录可以找到它。

把activiti-rest.war解压到Web服务器的应用部署目录（例如tomcat的webapps），根据实际需求修改activiti-rest/WEB-INF/classes/db.properties里面的数据库配置后启动应用。

可以通过REST工具测试是否部署成功可以正常的提供服务，例如Chrome的插件**REST Console**，或者通过Spring MVC提供的RestTemplate。

## 2. 访问REST资源

对于REST模块提供的接口可以参考用户手册的**REST API**章节，有着详细的介绍（包括URL和参数含义）。

### 2.1 身份认证

REST接口的大部分功能都需要验证，默认使用[Basic Access Authentication(基本连接认证)](http://baike.baidu.com/view/2076408.htm)，所以在访问资源时要在header中添加验证信息，当然为了安全期间把用户名和密码进行base 64位加密。

可以在用户登陆之后把用户名和密码进行加密并设置到session中，这样在前端就可以直接通过Ajax方式获取资源了：

<pre class="brush:java">
import jodd.util.Base64;
String base64Code = "Basic " + Base64.encodeToString(user.getId() + ":" + user.getPassword());
session.setAttribute("BASE_64_CODE", base64Code);
</pre>

### 2.2 通过Ajax方式读取资源

下面通过kft-activiti-demo中的代码片段介绍：
<pre class="brush:js,highlight:5">
$.ajax({
	type: "get",
	url: REST_URL + 'process-definition/' + processDefinitionId + '/form',
	beforeSend: function(xhr) {
		xhr.setRequestHeader('Authorization', BASE_64_CODE);
	},
	dataType: 'html',
	success: function(form) {
		// 获取的form是字符行，html格式直接显示在对话框内就可以了，然后用form包裹起来
		$(dialog).html(form).wrap("<form class='formkey-form' method='post' />");

		var $form = $('.formkey-form');

		// 设置表单action
		$form.attr('action', ctx + '/form/formkey/start-process/' + processDefinitionId);
	}
});
</pre>
在第5行处设置了ajax请求的header信息，这样REST模块就可以通过header的信息进行身份认证，通过之后就可以执行资源请求并返回处理结果。

### 2.3 通过Java方式读取资源

<script src="https://gist.github.com/4205625.js"></script>

## 3. Ajax跨域问题解决办法

1. 把REST模块和应用部署在同一个Web服务器中（废话……）
2. 等待官方提供JSONP的支持，JIRA Issue：[ACT-1534](http://jira.codehaus.org/browse/ACT-1534)
3. 利用后台代理方式，把请求的URL发送给后台代理服务器，获取数据之后再把结果返回给前台

### 4. kft-activiti-demo的REST演示

我在github上创建了一个REST分支：[https://github.com/henryyan/kft-activiti-demo/tree/rest](https://github.com/henryyan/kft-activiti-demo/tree/rest)

在**外置表单**模块中把*读取表单*和*签收任务*通过调用activiti-rest模块实现，思想和设计方式和本文介绍的一致。

目前还未支持跨域的问题，所以运行demo的时候要把kft-activiti-demo和activiti-rest模块部署在一个tomcat里面，如果tomcat的端口不是8080则需要修改**application.properties**文件的：

<pre>
activiti.rest.service.url=http://localhost:8080/activiti-rest/service/
</pre>