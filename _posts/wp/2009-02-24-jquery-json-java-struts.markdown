--- 
layout: post
title: "实例解析java + jQuery + json工作过程(登录)"
wordpress_id: 300
wordpress_url: http://www.wsria.com/?p=300
date: 2009-02-24 21:55:29 +08:00
category: jquery
tags: 
 - json
 - jqury
 - java
 - struts
---
<span style="color: #008000;">本文主要讲解在java环境下使用jQuery进行JSON数据传送的交互过程</span>

参考根据作者的<a href="http://www.wsria.com/archives/73" target="_blank">账务管理系统(个人版)</a> <a href="http://www.wsria.com/archives/136" target="_blank">源码下载</a> 讲解
<!--more-->

一、相关技术、工具简介

1、简单介绍一下<a href="http://www.json.org/json-zh.html" target="_blank">JSON</a>，JSON是一种轻量级的数据交换格式。 易于人阅读和编写。同时也易于机器解析和生成。已键值对形式表示数据，和java中的Map的数据存储形式相似，具体细节请参考<a href="http://www.json.org/json-zh.html" target="_blank">http://www.json.org/json-zh.html</a>。

2、对应后台JSON的数据处理工具<a title="java解析JSON数据使用的工具包" href="http://json-lib.sourceforge.net/" target="_blank">json-lib</a>，包含各种格式数据的工具类，比如：JavaBean、数组、集合(Collection)等，<a href="http://json-lib.sourceforge.net/apidocs/jdk15/index.html" target="_blank">参考API文档</a>。

3、jQuery框架中的数据表现形式，如果你熟悉jQuery的话就会发现jQuery的使用的数据传输都是JSON格式，比如我们经常使用的$.ajax方法：
<pre class="brush: js">$.ajax({
	url : url,
	data : {
		id : chkValue
	},
	cache : false,
	dataType : "json",
	success : function(result){
		alert(result);
	}
);</pre>
其中 {...} 表示的就是JSON格式的数据

二、前台工作方式
为了能够容易理解以系统登录讲解，最后会以一个实例的方式讲解
1、登录页面
代码请参见 <a href="http://code.google.com/p/finance-p/source/browse/trunk/login.jsp" target="_blank">http://code.google.com/p/finance-p/source/browse/trunk/login.jsp</a>
<pre class="brush: xml">用户名：
<input id="loginName" name="loginName" size="20" type="text" />

密码：
<input id="password" name="password" size="20" type="password" /></pre>
2、登录javascript文件 login.js
<pre class="brush: js">/**
 * 设置表单验证规则
 */
function regFormValidator() {
	$.formValidator.initConfig({formid:"loginForm"});
	$("#loginName").formValidator({
		onshow : "请输入用户名",
		onfocus : "用户名至少2个字,最多4个字"
	}).inputValidator({
		min : 1,
		onerror : "你输入的用户名非法,请确认"
	});

	$("#password").formValidator({
		onshow : "请输入密码"
	}).inputValidator({
		min : 6,
		onerror : "密码在6位以上，请确认"
	});
}

$(function() {
	// 注册表单验证插件
	regFormValidator();

	$('#submit').click(function(){
		// 验证输入的用户名、密码是否正确
		var valid = jQuery.formValidator.pageIsValid('1');
		if (valid) {
			$(this).attr('value', '正在登录……').attr('disabled', true);
		} else {
			return;
		}

		// 发送请求
		$.ajax({
			url	: 'login.do',
			data	: { loginName:$('#loginName').val(), password: $('#password').val() },
			success : function(result){
				// 根据result返回信息判断是否登录成功
				if(result &amp;&amp; result == 'success') {
					window.location.href = 'index.jsp';
				} else {
					alert('登录失败，用户名或密码错误，请重试！');
				}
			}
		});

	});
});</pre>
这样当点击“登录”按钮的时候触发ajax请求：
<ol>
	<li>验证表单完整性</li>
	<li>发送ajax请求到后台，值通过data键已JSON格式传送至后台</li>
	<li>如果后台返回的result为success时表示登录成功，页面跳转至首页index.jsp</li>
</ol>
三、后台工作方式

后台要比前台操作复杂一些，以为涉及到数据库、编码或者一些业务逻辑

1、获得请求参数

有两种方式：
<ul>
	<li>通过request.getParameter("key")的方式</li>
	<li>通过json-lib工具包获取</li>
</ul>
这我们主要讲解怎么通过json-lib获取参数

首先我们来写一个公共的方法，可以返回一个<a title="查看API文档" href="http://json-lib.sourceforge.net/apidocs/jdk15/net/sf/json/JSONObject.html" target="_blank">net.sf.json.JSONObject</a>对象，具体代码如下：
<pre class="brush: java">/**
 * 读取请求参数转换JSONObject对象
 *
 * @param request HttpServletRequest 对象
 * @return json格式的String对象
 * @throws Exception
 */
@SuppressWarnings("unchecked")
protected JSONObject readJson(HttpServletRequest request) throws Exception {
	JSONObject jsonObject = new JSONObject();
	try {
		Map parameterMap = request.getParameterMap();
                // 通过循环遍历的方式获得key和value并set到JSONObject中
		Iterator paIter = parameterMap.keySet().iterator();
		while (paIter.hasNext()) {
			String key = paIter.next().toString();
			String[] values = (String[])parameterMap.get(key);
			jsonObject.accumulate(key, values[0]);
		}
		log.debug("从客户端获得json=" + jsonObject.toString());
	} catch (Exception e) {
		log.error("获取json数据出错，错误信息如下：nt" + e.getMessage());
		e.printStackTrace();
		throw e;
	}
	return jsonObject;
}</pre>
通过这个方法我们可以获得一个JSONObject对象，然后就可以通过key获得对应的value；

2、登录处理Action
<pre class="brush: java">public ActionForward login(ActionMapping mapping, ActionForm actionForm,
             HttpServletRequest request,HttpServletResponse response) throws Exception {
	JSONObject jsonObject = readJson(request);
	String name = jsonObject.getString("loginName");
	String pass = jsonObject.getString("password");
	try {
		int loginFlag = userManager.validLogin(name, pass);
		if (loginFlag == UserManager.LOGIN_SUCCESS) {
			User user = userManager.getUserByNameAndPass(name, pass);
			UserUtil.saveUser2Session(user, request);
			log.info("用户&lt;" + user.getUserName()
                              + ",ip=" + request.getRemoteAddr() + "&gt;登录系统");
			print(response, RESBONSE_SUCCESS);
		} else if (loginFlag == UserManager.LOGIN_FAIL) {
			print(response, RESBONSE_ERROR);
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
	return null;
}</pre>
解释：

在34行我们通过刚刚准备好的readJson方法获得一个JSONObject对象，接下来通过key获得用户名和密码，接下来就是业务逻辑的验证工作了，通过后我们向前台返回请求结果。
我们还需要一个小方法向前台写结果，如上面44、46行
<pre class="brush: java">protected void print(HttpServletResponse response, String info) throws IOException {
	try {
		response.getWriter().print(info);
	} catch (IOException e) {
		e.printStackTrace();
		throw e;
	}
}</pre>
<pre>这里有一点要说明，在获得输出流的时候有个小插曲，我在开发的时候使用的tomcat5.5.26版本，
当时的写法为：
<pre class="brush: java">response.getOutputStream().print(info);</pre>
后来源码开源后一个网友使用的tomcat6版本，说系统不能正常运行，后来他查到了原因，因为获得输出流时出了问题，
改成getWriter就没有问题了，集体也没有搞清除为什么会是这样……</pre>
基于java开发时会使用struts，struts需要返回一个ActionMapping对象，但是在ajax请求不需要返回特定页面，因为根本没有跳转页面的动作，解决办法很简单，直接<strong>return  null</strong>就可以了

输出结果后jQuery的ajax的success方法就接收到了请求结果，然后就可以根据结果处理业务逻辑了O(∩_∩)O~

OK，到此整个请求结束，有不明白的请留言或者到<a href="http://www.wsria.com/about" target="_blank">“关于”</a>中联系我

注：本文为原创文章，转载请注明来自 <a href="http://www.wsria.com/archives/300" target="_blank">http://www.wsria.com/archives/300</a>
作者：<a href="http://www.wsria.com" target="_blank">www.wsria.com</a>
