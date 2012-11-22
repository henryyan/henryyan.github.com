---
layout: master
title: jQuery UI Portlet—基于jQuery UI的Portlet应用插件
---

# jQuery UI Portlet—基于jQuery UI的Portlet应用插件

## 1.演示与源码

![jquery-ui-portlet插件截图](/files/2012/11/jquery-ui-portlet.png)

**在线Demo：**[http://www.kafeitu.me/demo/jquery-ui-portlet/portlet.html](/demo/jquery-ui-portlet/portlet.html)

**源码（Github）：**[https://github.com/henryyan/jquery-ui-portlet](https://github.com/henryyan/jquery-ui-portlet)

## 2.插件API

<table class="parameters" style='margin-bottom: 2em;'>
	<caption align="left">表1--jQuery UI Portlet 插件API</caption>
	<tr>
		<th>参数</th>
		<th>描述</th>
		<th>默认值</th>
	</tr>
	<tr>
		<td>sortable</td>
		<td>是否启用拖动功能，内部调用sortable插件</td>
		<td>true</td>
	</tr>
	<tr>
		<td>create</td>
		<td>当创建portlet组件时被调用</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td>removeItem</td>
		<td>关闭一个portlet时的回调函数</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td>columns</td>
		<td>见表2</td>
		<td>&nbsp;</td>
	</tr>
</table>

<table class="parameters" style='margin-bottom: 2em;'>
	<caption align="left">表2--jQuery UI Portlet 插件API--columns</caption>
	<tr>
		<th>参数</th>
		<th>描述</th>
		<th>默认值</th>
	</tr>
	<tr>
		<td>width</td>
		<td>宽度</td>
		<td>300</td>
	</tr>
	<tr>
		<td>portlets</td>
		<td colspan="2">
			<table class="parameters">
				<tr>
					<th>参数</th>
					<th>描述</th>
					<th>默认值</th>
				</tr>
				<tr>
					<td>attrs</td>
					<td>portlet的属性， json数组格式</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>title</td>
					<td>portlet的title，支持：静态文本，function</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>beforeRefresh</td>
					<td>刷新portlet之前被调用</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>afterRefresh</td>
					<td>刷新portlet之后被调用</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>content</td>
					<td>
						<ul>
							<li><b>type:</b>内容获取方式：text、ajax</li>
							<li><b>text:</b>portlet的内容，html或者function</li>
							<li><b>beforeShow:</b>设置内容之前被调用</li>
							<li><b>afterShow:</b>设置内容之后被调用</li>
							<li><b>url:</b>当type:'ajax'时需要指定数据来源的网址</li>
							<li><b>dataType:</b>当type:'ajax'时需要指定获取的数据类型，所有jquery的ajax支持的数据类型，目前支持：html、json</li>
							<li><b>formatter:</b>当type:'ajax'并且dataType:'json'时被调用，用来处理json数据从而转换为html。调用时传入三个参数：[表1中的参数，本表中的参数, 数据]</li>
						</ul>
					</td>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>scripts</td>
					<td>数组：指定portlet加载完内容后的js文件路径</td>
					<td>&nbsp;</td>
				</tr>
			</table>
		</td>
	</tr>
</table>

<table class="parameters" style='margin-bottom: 2em;'>
	<caption align="left">表3--jQuery UI Portlet 插件更新参数&nbsp;$('#portlet1').portlet('option', 'paramName', paramValue)</caption>
	<tr>
		<th>参数名称</th>
		<th>描述</th>
	</tr>
	<tr>
		<td>sortable</td>
		<td>设置开启/禁用拖动功能</td>
	</tr>
</table>

## 3.代码示例

<script src="https://gist.github.com/4132029.js?file=jquery-ui-portlet-demo.html"></script>