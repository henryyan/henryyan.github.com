--- 
layout: post
title: "Struts2 Annotation实现文件下载功能"
wordpress_id: 1172
wordpress_url: http://www.wsria.com/?p=1172
date: 2010-10-03 21:32:49 +08:00
tags: 
 - Struts2
 - 注解
 - Annotation
---
<h3>一、达到目标：</h3>
给定任意Web根路径下面的文件<strong>相对路径</strong>下载文件，在任意浏览器下下载文件不出现乱码问题；
<h3>二、开发要点：</h3>
<ul>
	<li><strong>Annotation：</strong>
经历了Struts1的大量Action配置之后到了Struts2坚决放弃了xml配置，虽然struts2的xml配置比较简单了，但是我真的很懒……
所以这里实现全部是有注解实现，简单、方便、容易日后的重构</li>
	<li><strong>文件名乱码</strong>
提高这个问题都想吐，为什么不全部使用UTF-8编码呢……
既然不能改变那就只能解决，所以这里要考虑各个浏览器对文件名的编码解析</li>
</ul>
<h3>三、具体实现</h3>
<!--more-->
不说废话，直接上代码，下面再讲解；如果想下载猛击<a href="http://code.google.com/p/wsria/source/browse/trunk/wsria-demo/src/main/java/cn/wsria/demo/web/file/DownloadAction.java" target="_blank">这里</a>
<pre class="brush: java">package cn.wsria.demo.web.file;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springside.modules.web.struts2.Struts2Utils;

import cn.wsria.util.BrowserUtils;

/**
 * 下载Action
 *
 * @author HenryYan
 *
 */
@Controller
@Namespace("/file")
@Result(type = "stream", params = { "contentType", "application/octet-stream;charset=ISO8859-1", "inputName",
		"inputStream", "contentDisposition", "attachment;filename=${downFileName}", "bufferSize", "4096" })
public class DownloadAction {

	private static Logger logger = LoggerFactory.getLogger(DownloadAction.class); 

	private String fileName;
	private String downFileName;

	public void setFileName(String fileName) throws UnsupportedEncodingException {
		logger.debug("得到原始文件名：{}", fileName);

		// 转码
		fileName = URLDecoder.decode(fileName, "UTF-8");

		logger.debug("转码后的文件名：{}", fileName);

		this.fileName = fileName;
	}

	/**
	 * 如果传过来的fileName参数有路径处理后只返回文件名
	 * @return	例如path/aaa.txt，返回aaa.txt
	 * @throws UnsupportedEncodingException
	 */
	public String getDownFileName() throws UnsupportedEncodingException {
		fileName = StringUtils.defaultIfEmpty(fileName, "");

		// 判断path/aaa/bbb.txt和path\aaa\bbb.txt两种情况
		String tempFileName = StringUtils.substringAfterLast(fileName, "/");
		if (tempFileName.length() == 0) {
			tempFileName = StringUtils.substringAfterLast(fileName, "\\");
		}
		if (tempFileName.length() == 0) {
			tempFileName = fileName;
		}

		// 处理中文
		logger.debug("去除路径信息后得到文件名：{}", tempFileName);

		// 处理IE浏览器乱码问题
		if (BrowserUtils.isIE(Struts2Utils.getRequest())) {
			downFileName = java.net.URLEncoder.encode(tempFileName, "UTF-8");
		} else {
			downFileName = new String(tempFileName.getBytes(), "ISO8859-1");
		}

		return downFileName;
	}

	public InputStream getInputStream() throws UnsupportedEncodingException {
		return ServletActionContext.getServletContext().getResourceAsStream("/" + fileName);
	}

	public String execute() {
		return "success";
	}

}</pre>
Struts2本身就支持文件下载的输出类型，所以有一个type叫做“stream”，输出文件流到客户端，也就是Result中配置的type = "stream"
<ul>
	<li><strong>contentType</strong>设置为<em>application/octet-stream</em>;charset=ISO8859-1，作用是设置输出的类型为<strong>二进制流</strong></li>
	<li><strong>inputName</strong>设置为<em>inputStream</em>指定Action中的哪一个方法返回二进制输出流</li>
	<li><strong>contentDisposition</strong>设置为<em>attachment;filename=${downFileName}</em>，<em>attachment</em>标示当客户端打开下载链接的时候弹出<strong>保存对话框</strong>；filename=${downFileName}就是要指定下载的文件名名称，${downFileName}是指从Action中读取getDownFileName方法，这里一定要提供getDownFileName方法，我做的时候脑子短路调试了好一会，原来在生成getter和setter的时候没有生成getDownFileName方法</li>
</ul>
好，现在如果在项目的webapp/file中放置一个aaa.txt，那就可以使用路径：http://localhost:9000/wsria-demo/file/download.action?fileName=files/aaa.txt访问了
但是如果要下载中文的呢？

这里在开发的时候又被乱码问题玩了一把，最终的解决办法也是最可靠的办法就是前后台编码和解码，具体实现如下：
在前台下载的时候用<strong>encodeURI</strong>方法编码下载路径，把中文字符转换为UTF-8编码，为了统一不出问题所以我写了一个方法：
<pre class="brush: js">function download(fileName){
    var downUrl = $.common.custom.getCtx() + '/file/download.action?fileName=' + fileName;
    open(encodeURI(encodeURI(downUrl)));
}</pre>
函数所在文件：<a href="http://code.google.com/p/wsria/source/browse/trunk/wsria-demo/src/main/webapp/js/common/common.js" target="_blank">common.js</a>
<h3>四、解决文件名乱码</h3>
1、接着在<strong>后台</strong>进行解码工作，在setFileName的时候解码文件名，fileName属性是在读取本地文件时使用的，所以要把中文的UTF-8还原回来交给java的输入流

2、在输出文件的时候客户端根据浏览器不同解析文件名的方式也不同，如代码的第67~71行处就是根据浏览器不同设定不同的文件名

就讲到这里了，试试吧，有问题在此文后面留言或者在<a href="http://www.wsria.com/about">关于</a>中联系我！
