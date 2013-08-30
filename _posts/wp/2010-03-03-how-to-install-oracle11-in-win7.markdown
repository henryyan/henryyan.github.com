--- 
layout: post
title: "Win7下不能安装Oracle11g解决办法"
wordpress_id: 927
wordpress_url: http://www.wsria.com/?p=927
date: 2010-03-03 12:36:48 +08:00
tags: 
 - oracle
---
昨晚下载了Oracle11，今天在WIN7下安装遇到了问题，说操作系统部支持，具体日志信息：
<pre>正在检查操作系统要求...
要求的结果: 5.0,5.1,5.2,6.0 之一
实际结果: 6.1
检查完成。此次检查的总体结果为: 失败 &lt;&lt;&lt;&lt;
问题: Oracle Database 11g 未在当前操作系统中经过认证。
建议案: 确保在正确的平台上安装软件。
========================================================

正在检查 Service Pack 要求...
检查完成。此次检查的总体结果为: 未执行 &lt;&lt;&lt;&lt;
OUI-18001: 不支持操作系统 'Windows Vista 版本 6.1'。
建议案: 请安装建议的 Service Pack。
========================================================</pre>
<strong>解决办法</strong>其实很简单，只要在XML文件中添加WIN7就可以了，因为Vista是6.0版本，WIN7实在Vista内核的基础上升级的，所以解决起来还是比较容易的，如下：
<!--more-->
<pre><strong>修改</strong> .\database\stage\prereq\db\refhost.xml

添加如下域:
<pre class="brush: xml">
<!--Microsoft Windows 7-->
<OPERATING_SYSTEM>
  <VERSION VALUE="6.1"/>
</OPERATING_SYSTEM>
</pre>
</pre>
