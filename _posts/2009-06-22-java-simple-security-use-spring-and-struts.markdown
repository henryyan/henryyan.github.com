--- 
layout: post
title: "简单实现在基于Java的AJAX环境下未登录自动跳转流程详解(spring代理struts的action)"
wordpress_id: 588
wordpress_url: http://www.wsria.com/?p=588
date: 2009-06-22 13:28:38 +08:00
tags: 
 - spring
 - struts
 - ajax
---
有过管理系统开发经验的程序员第一步肯定是做用户管理模块，当然可能会用到公司或者其他的产品，或者自己写用户管理模块，此模块主要的目的是区别每个用户的信息集合，限制用户的操作、数据列表等

今天讲的是用户登录问题，环境是基于JAVA语言，使用spring代理struts的Action，在使用spring创建的bean时执行一次验证拦截器来判断用户是否登录
下面进入正题：
<!--more-->
<ol>
	<li>
<h2>struts的拦截器</h2>
<pre class="brush: java" line="1">package net.yanhl.struts.authority;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.yanhl.util.UserUtil;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.struts.action.ActionMapping;

/**
 *Title: 判断用户是不是已经登陆
 *Description:
 *Copyright: Copyright (c) 2008
 *
 * @author 闫洪磊
 * @version 1.0.0.20080523
 */
public class UserAuthorityInterceptor implements MethodInterceptor {
	public Object invoke(MethodInvocation invocation) throws Throwable {
		HttpServletRequest request = null;
		HttpServletResponse response = null;
		ActionMapping mapping = null;
		Object[] args = invocation.getArguments();
		//转换各种对象
		for (int i = 0; i &lt; args.length; i++) {
			if (args[i] instanceof HttpServletRequest) {
				request = (HttpServletRequest) args[i];
			} else if (args[i] instanceof HttpServletResponse) {
				response = (HttpServletResponse) args[i];
			} else if (args[i] instanceof ActionMapping) {
				mapping = (ActionMapping) args[i];
			}
		}
		if (UserUtil.isLogin(request)) {
			return invocation.proceed();
		} else {
			/*
			 * 判断是哪种类型的请求(普通URL、AJAX)
			 * 如果是AJAX的输出一个login字符串
			 * 如果是普通页面直接跳转到登录页面
			*/
			String requestType = request.getHeader("X-Requested-With");
			if(requestType != null &amp;&amp; requestType.equals("XMLHttpRequest")) {
				response.getWriter().print(UserUtil.FORWARD_LOGIN);
				return null;
			} else {
				return mapping.findForward(UserUtil.FORWARD_LOGIN);
			}
		}
	}
}</pre>
基本功能就是检查用户是否已经登录</li>
	<li>
<h2>配置拦截路径</h2>
<pre class="brush: xml"><!--  用户权限拦截器生成代理  -->
    <bean class="org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator">
    	<property name="beanNames">
            <list>
               <!-- 需要拦截检查用户登录的action，这些action已经在 spring配置 -->
            	<value>/field/*</value>
            	<value>/price/*</value>
            	<value>/locale/*</value>
            </list>
	    </property>
        <property name="interceptorNames">
            <list>
                <value>userAuthorityInterceptor</value> 
            </list>
        </property>
    </bean>

    <!-- 定义用户权限检查拦截器 -->
	<bean id="userAuthorityInterceptor" class="net.yanhl.struts.authority.UserAuthorityInterceptor"/></pre>
这里主要是配置拦截URL路径，进入ACTION之前会先进入UserAuthorityInterceptor判断用户是否登录
</li>
<li>
<h2>前端JS文件</h2>
<pre>
这是我们要设置全局的一个ajaxSetup来控制所有ajax请求，代码如下：
</pre>
<pre class="brush: js" line="1">
$.ajaxSetup({
		cache : false,
		global : true,
		complete: function(req, status) {
			var reqText = req.responseText;
                        // 如果后台返回的是login字符串则可以跳转到登录页面
			if(reqText && reqText == 'login'){
				var topWinObj = getTopWin();
				topWinObj.location.href = '/exercise/login.html';
			}
		}
	});
/**
 * 获得最上层的window对象
 */
function getTopWin() {
	if(parent) {
		var tempParent = parent;
		while(true) {
			if(tempParent.parent) {
				if(tempParent.parent == tempParent) {
					break;
				}
				tempParent = tempParent.parent;
			} else {
				break;
			}
		}
		return tempParent;
	} else {
		return window;
	}
}
</pre>
</li>
OK，启动服务测试，在没有登录的情况下打开主页面，执行一个保存动作发现直接跳转到了登录页面


<pre>本文只是说明一下实现的思路及主要代码，细节代码请读者自己实现，有问题请留言或者MSN，谢谢您的关注</pre>


</ol>
