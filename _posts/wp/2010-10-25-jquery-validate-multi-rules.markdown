--- 
layout: post
title: "jquery.validate插件remote规则相同值不验证的问题解决办法"
wordpress_id: 1273
wordpress_url: http://www.wsria.com/?p=1273
date: 2010-10-25 23:36:22 +08:00
tags: 
 - jquery
 - validate
---
<h3>一、由来说明</h3>
使用jquery.validate插件的remote规则来验证一组参数是否重复，我的需求不像其他应用一样只验证一个字段是否重复，而是要依赖其他的几个字段来组合判断，所以jquery.validate就有点水土不服了。
<h3>二、环境说明</h3>
jQuery validation版本号： jQuery validation plug-in 1.7
$Id: jquery.validate.js 6403 2009-06-17 14:27:16Z joern.zaefferer $
<h3>三、实例说明</h3>
<a href="http://www.kafeitu.me/files/2010/10/1.gif"><img class="size-medium wp-image-1276 " title="1" src="http://www.kafeitu.me/files/2010/10/1.gif" alt="" width="451" height="269" /></a>

见左图，要保证[会员等级]和[积分来源]的联合唯一，类似于数据库的联合主键。

验证代码片段：
<!--more-->
<pre class="brush: js">
remote: {
	url: "split-account-rule!checkRepeat.action",
	type: "post",
	cache: false,
	dataType:"json",
	data: {
		newId : function() {
			return $("#id_g").val();
		},
		memberLevel: function() {
			return $("#level").val();
		},
		pointSource: function(){
			return $('#source').val();
		}
	}
}
</pre>

很明显现在输入了【会员等级】为1，和列表中已存在的数据重复了。

好的，那么我们看看另外一种结果；

<a href="http://www.kafeitu.me/files/2010/10/2.gif"><img class="size-medium wp-image-1278 " title="2" src="http://www.kafeitu.me/files/2010/10/2.gif" alt="" width="458" height="275" /></a>

现在我们看到【图二】中输入了【会员等级】为2，积分来源还是【联名银行卡】，现在的结果是没有重复的，那么再看另外一种情况；

<a href="http://www.kafeitu.me/files/2010/10/3.gif"><img class="size-full wp-image-1281 " title="3" src="http://www.kafeitu.me/files/2010/10/3.gif" alt="" width="461" height="295" /></a>
这次出错了吧，列表中根本不存在等级为1和积分来源为【线上商城】的记录，为什么会重复呢？我的操作方式是在图一的基础上选择【积分来源】为”线上商城“，然后点击”提交“按钮；

<h3>四、解决问题</h3>
问题找出来了，那么怎么解决呢……我的经验是Google无果后直接看源码分析问题的原因；
然后查看源码中remote函数的具体操作，发现了问题的所在，大家可以查看第932行处：
<pre class="brush: js" line="932">
if ( previous.old !== value ) {
</pre>
哦，原来妖怪在这里，如果第一次验证失败后更改验证条件后再次校验就处问题了，因为这里判断了本次的值和上一次出错的值是否一样，如果一样直接返回上次的验证错误信息；难怪我验证不通过……
那要想一个办法跳过这里，但是要温柔一点，做快捷的办法是给插件加入一个参数来忽略相同值的验证，也就是说当第一次验证失败后更改了验证依赖条件再次验证时忽略相同值的判断而直接再次请求后台验证；
所以我加入了一个<b>ignoreSameValue</b>参数来实现我的想法，更改第932行代码如下：
<pre class="brush: js" line="932">
if ( previous.old !== value || param.ignoreSameValue) {
</pre>
然后再remote验证调用的代码处设置参数为true即可，
<pre class="brush: js">
remote: {
	url: "split-account-rule!checkRepeat.action",
	ignoreSameValue: true,
	type: "post",
	cache: false,
	dataType:"json",
	data: {
		newId : function() {
			return $("#id_g").val();
		},
		memberLevel: function() {
			return $("#level").val();
		},
		pointSource: function(){
			return $('#source').val();
		}
	}
}
</pre>
现在再次测试验证通过了，有图为证<a href="http://www.kafeitu.me/files/2010/10/4.gif"><img src="http://www.kafeitu.me/files/2010/10/4.gif" alt="" title="4" width="447" height="287" class="size-full wp-image-1282" /></a>
