--- 
layout: post
title: "实例解析java + jQuery + json工作过程(获取JSON数据)"
wordpress_id: 369
wordpress_url: http://www.wsria.com/?p=369
date: 2009-02-28 18:39:27 +08:00
category: jquery
tags: 
 - jquery
 - json
 - struts
---
前天刚刚写的一篇关于《<a title=" 实例解析java + ajax(jQuery) + json工作过程(登录) " href="http://www.wsria.com/archives/300" target="_blank">实例解析java + ajax(jQuery) + json工作过程(登录)</a>》的文章引起了网友们的关注和好评，

<!--more-->自从本站的<a title="查看关于账务系统的文章" href="http://www.wsria.com/finance" target="_blank">账务管理系统(个人版)开源</a> 以后很多网友询问系统的实现方式，我一一解释……，为此今天写文章详细讲解系统功能的实现细节。

以本站的开源项目账务管理系统的“债务人”模块为例子讲解
<h2>一、效果预览</h2>
<img class="size-full wp-image-387" title="userdetail1" src="http://www.kafeitu.me/files/2009/02/userdetail1.png" alt="债务人详细页面效果预览" width="416" height="385" />
<h2>二、实现方式</h2>
<pre>基本思想就是绑定列表中的人员名称触发事件，获得当前人员的ID发送ajax请求到后台，后台根据ID查询详细信息，返回JSON数据结果至前台，前台通过对话框组件显示人员详细</pre>
<strong>1、绑定click事件到列表的人员名称</strong>
在项目中的iouser/js/iouser.js文件中有这样一个方法：
<pre class="brush: js">/**
 * 点击名称弹出详细
 */
function regShowDetail() {
	$("span[name=iouid]").unbind('click').bind('click', function(){
		showDetail($(this).parent().parent().find('input[name=chk]').val());
	});
}</pre>
通过regShowDetail绑定了点击人员时执行showDetail的事件，
<pre class="brush: js">$(this).parent().parent().find('input[name=chk]').val()
//上面这句话就是获得列表左侧的复选框的value值以便传送给后台</pre>
<ul>
	<li>下面介绍一下<strong>showDetail</strong><em>方法的功能实现：</em></li>
</ul>
<pre class="brush: js"> * 查看用户详细资料
 * @param {} userId 用户ID
 */
function showDetail(userId) {
	// 创建一个对话框组件
	var dialog = $.weeboxs.open('showDetail.html', {
		title: '正在加载用户信息……',
		contentType: 'ajax',
		width: 600,
		height: 350,
		animate: true,
		clickClose: false,
		type: 'wee',
		showOk: false,
		cancelBtnName: '关 闭',
		onopen: innerShowDetail
	});

	//内部函数，实现债务人详细信息的载入、设置值
	function innerShowDetail() {
		// 获得JSON格式的数据
		$.getJSON('load.do',{id : userId}, function(json) {
			// 根据key设置value
			for (key in json) {
				if(key == 'id'){
					$('#detailDiv #' + key).val(json[key]);
				} else {
					if(json[key] == ''){
						// 没有值设置为空
						$('#detailDiv #' + key).html('?');
					} else if(key == 'sex'){
						$('#detailDiv #' + key).html(json[key] == '0' ? '女' : '男');
					} else if(key == 'group'){
						if(json[key] != null) {
							$('#detailDiv #' + key).html(json[key]['groupName']);
						}
					} else {
						$('#detailDiv #' + key).html(json[key]);
					}
				}
			}

			//设置对话框标题和内容
			$('#detailDiv').removeAttr('class');
			dialog.setTitle('查看人员[' + json['userName'] + ']详细资料');
			dialog.setContent($('#detailDiv').html());
		});
	}
}</pre>
<ul>
	<li><em>showDetail</em>方法首先打开一个<a title="本系统使用的对话框插件简介" href="http://www.wsria.com/archives/342" target="_blank">对话框组件</a> 加载一个静态的模板<a title="查看showDetail.html文件内容  on googlecode" href="http://code.google.com/p/finance-p/source/browse/branches/v1-Final/iouser/showDetail.html" target="_blank"><em><strong>showDetail.html</strong></em></a>
<ul>
	<li> 文件中的ID都是根据信息点命名的，这样便于通过ID设置值</li>
</ul>
</li>
	<li>通过路径<strong>load.do</strong> 请求后台查询人员详细，后台处理类为net.yanhl.iouser.action.IOUserAction的loadUser()方法，代码请<a title="加载人员详细的后台源码" href="http://code.google.com/p/finance-p/source/browse/branches/v1-Final/WEB-INF/src/net/yanhl/iouser/action/IOUserAction.java" target="_blank">点击这里查看</a>
<ul>
	<li> 怎么查询一个POJO对象就介绍了，重点说明怎么返回JSON格式的数据</li>
	<li>这里还是使用java语言使用的JSON工具json-lib，关于json-lib的资料上篇文章也已介绍，这里不再重复；
<pre class="brush: java">// 获取一个Iouser对象，包含债务人的信息
Iouser user = (Iouser) getBaseManager().get(Iouser.class, iouserId);

//使用json-lib工具把一个POJO对象解析为一个JSON格式数据
JSONObject jsonObject = JSONObject.fromObject(user, config);

//向前台发送结果集
print(response, jsonObject.toString());</pre>
最中返回的结果集如下：
<pre>{
"age" : 56,
"companyAddress" : "32",
"companyName" : "未知",
"companyPhone" : "--",
"companyZip" : "",
"createDate" : null,
"creatorId" : 1,
"group" : {
"childSize" : 0,
"createDate" : {
"date" : 27,
"day" : 6,
"hours" : 0,
"minutes" : 0,
"month" : 11,
"nanos" : 0,
"seconds" : 0,
"time" : 1230307200000,
"timezoneOffset" : -480,
"year" : 108
},
"creatorId" : 1,
"groupName" : "商务",
"id" : 33,
"orderNum" : 0,
"remark" : ""
},
"homeAddress" : "香港九龙",
"homePhone" : "",
"homeZip" : "",
"id" : 12,
"mobilePhone" : "15856453456",
"orderNum" : 0,
"remark" : "香港富豪",
"sex" : "1",
"userName" : "李嘉诚"
}</pre>
</li>
</ul>
</li>
	<li> 前台获得了结果集之后就可以根据key获得value来设置详细页面的内容了，代码如下：
<pre class="brush: js">for (key in json) {
	if(key == 'id'){
		$('#detailDiv #' + key).val(json[key]);
	} else {
		$('#detailDiv #' + key).val(json[key]);
	}
}</pre>
至此就是我们刚刚看到的效果了，是不是很简单O(∩_∩)O~</li>
</ul>
附：
<ul>
	<li><a href="http://www.wsria.com/archives/73" target="_blank">系统效果预览：http://www.wsria.com/archives/73</a></li>
	<li><a href="http://www.wsria.com/archives/73" target="_blank">系统源码下载：http://www.wsria.com/archives/73</a></li>
</ul>
