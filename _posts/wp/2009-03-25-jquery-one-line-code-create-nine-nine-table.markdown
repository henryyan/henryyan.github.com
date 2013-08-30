--- 
layout: post
title: "一行jQuery代码打印九九乘法表"
wordpress_id: 471
wordpress_url: http://www.wsria.com/?p=471
date: 2009-03-25 19:30:46 +08:00
category: jquery
tags: 
 - 乘法表
---
网友<strong>西_西_佛</strong>用一行代码打印九九乘法表
<em>展示了jQuery的级联语法，简介且功能强大</em>
这个程序的要求：不能用if,for,var xx =等常见js代码。只能用jquery的链式代码。

于是，要生成99表，必然要递归。可递归必然有终止的条件，那就得有if(n==0)return这样的
代码，又是不被允许的。那么jquery怎么才能终止呢？我想到了用find('p:lt(n)')，n&lt;0的时候
是会终止的。

而bind的使用，纯粹是为了递归循环。我们首先建立一个对象，绑定一个事件，无所谓了，比如error，然后在这个对象最后，triggerHandler一下，就能完成递归了。

这个程序有两个递归循环，外层的是建立九个，内层的是建立9个，在创建p的时候，把99口诀打出来。
代码如下：
<!--more-->
<pre class="brush: js" line="1">
$(document).ready(function(){
	
	$("<div>").data('fact',8).css('margin','10px')
	         .appendTo(document.body)
			 .bind('error',function(){			 
				$(this).parent().find("div:lt("+ ($(this).data('fact')) +")").eq(0)
				       .before($(this).clone(true).data('fact',$(this).data('fact') - 1))
					   .unbind('error')
					   .append(
					     $("<p>").data('fact',$(this).data('fact')).width(20).height(20)
							.css('display','inline').css('margin','10px')
							.appendTo($(this))
							.bind('focus',function(){
								$(this).text(($(this).data('fact') + 1) + 
									 "x" + 
									 ($(this).parent().data('fact') + 1) + 
									 "=" + 
									 ($(this).data('fact') + 1)*($(this).parent().data('fact') + 1)
									 )
									.parent().find("p:lt("+ ($(this).data('fact')) +")").eq(0)
									.before($(this).clone(true).data('fact',$(this).data('fact') - 1))
									.unbind('focus')
									.parent().find("p").eq(0).triggerHandler('focus');
								}).triggerHandler('focus')
					   ).parent().find("div").eq(0).triggerHandler('error'); 		
	         }).triggerHandler('error');
});
</pre>
