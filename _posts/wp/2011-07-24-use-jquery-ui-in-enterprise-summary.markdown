--- 
layout: post
title: "jQuery UI及其插件在企业环境的应用总结"
wordpress_id: 1549
wordpress_url: http://www.wsria.com/?p=1549
date: 2011-07-24 16:04:19 +08:00
tags: 
 - jQuery UI
---
<h3>一、博文背景</h3>
使用jQuery差不多3年了，开始只是简单的应用，后来发现了官网开发的jQuery UI；从去年的一个项目开始使用jQuery UI作为主要的UI插件，选择jQuery UI的主要原因是因为需要使用jqGrid这个插件，而这个插件又使用了jQuery UI的主题;再者jQuery UI提供主题的自定义，这样对于一些喜欢不同风格的客户来说就比较容易切换自己喜欢的主题了。
写这篇博文的想法就是因为基于jQuery UI开发了两套系统，并且都运行正常，而且客户的反应也不错，所以整理以下和大家分享我的经验，同时也和正在使用的童鞋交流，希望起到抛砖引玉的作用。
<h3>二、jQuery UI基础</h3>
<pre>
<strong>官网</strong>：<a href="http://jqueryui.com/" target="_blank">http://jqueryui.com/</a>
<strong>演示</strong>：<a href="http://jqueryui.com/demos/" target="_blank">http://jqueryui.com/demos/</a>
<strong>下载</strong>：<a href="http://jqueryui.com/download" target="_blank">http://jqueryui.com/download</a>
<strong>在线主题自定义</strong>：<a href="http://jqueryui.com/themeroller/" target="_blank">http://jqueryui.com/themeroller/</a>
</pre>
在我们的系统中主要使用了Dialog、Tab、Button、Autocomplete等功能，下面会对于使用过程中遇到的问题进行列举：
<!--more-->
<ul>
	<li><strong>IE下面Dialog高度问题</strong><br/>血的教训呀……<br/><strong>问题描述</strong>：我们的系统都是用JSP开发的，而且定义了一个global.jsp文件用于引入一些每个页面都需要用到的常量之类的属性，当然包括公共设置的JS代码，例如JSP代码：
<pre>
&lt;%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%&gt;
&lt;%@ include file="/common/global.jsp" %&gt;
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html&gt;
</pre>
输出的HTML代码如下：
<pre>
&lt;script type="text/javascript"&gt;	
	// 服务器日期
	var systemDate = new Date(2011, 6, 22);
	var strSystemDate = "2011-07-22";
&lt;/script&gt;
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
</pre>
问题出来了，按照上面的输出在IE下面会导致对话框的高度属性无效，再Firefox下正常;所以一直以来我都以为是jQuery UI对IE支持的BUG，后来实验后得知在一些html包含的元素必须严格按照标准书写，否则IE不能兼容而其他非IE可以兼容，修改后的代码如下：
<pre>
&lt;%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%&gt;
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8"&gt;
&lt;%@ include file="/common/global.jsp" %&gt;
</pre>
这样输出的结果就是：
<pre>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8"&gt;
&lt;script type="text/javascript"&gt;	
	// 服务器日期
	var systemDate = new Date(2011, 6, 22);
	var strSystemDate = "2011-07-22";
&lt;/script&gt;
</pre>
这样IE和Firefox打开的对话框高度就一致了……IE的容错性不高呀，不过这样也严格要求了我们的代码规整性，谨记不要犯类似错误。
</li>
<li><strong>为Dialog的Button添加图标(Icon)</strong>
<pre class="brush: js">
/**
 * 为dialog中的button设置icon
 * @param {Object} options
 */
setIcons: function(options) {
	$.each(options, function(i, n){
		$('.ui-dialog-buttonpane').find('button:contains(' + i + ')')
		.button({
		    icons: options[i]
		});
	});
}
</pre>
调用方式：
<pre class="brush: js">
$('#div_1').dialog({
	open: function() {
		$.common.plugin.jqui.dialog.button.setIcons({
			上传: { primary: 'ui-icon-arrowthick-1-n' },
			关闭: { primary: 'ui-icon-cancel' }
		});
	}
);
</pre>
</li>
</ul>
具体每个组件怎么使用看官网的demo和文档吧，还是比较详细的。

<h3>三、jQuery UI扩展</h3>
<pre>
DEMO：<a href="http://quasipartikel.at/multiselect/">http://quasipartikel.at/multiselect/</a>
</pre>

另外一个类似的Multiselect插件：
<pre>
DEMO：<a href="http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/">http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/</a>
</pre>
这两个插件功能差不多，都可以过滤数据，而且完全使用jQuery UI主题，根据应用环境自己选择。

<pre>
还有一些扩展再jQuery UI官网的SVN的分支中，地址：<a href="http://jquery-ui.googlecode.com/svn/branches">http://jquery-ui.googlecode.com/svn/branches</a>
希望能从中发现你需要的功能。
</pre>

<h3>四、jQuery UI扩展-jqGrid</h3>

<pre>一个功能强大的grid插件，一个吸引我使用jQuery UI的插件，一个能满足日常需要的插件，一个特别想推荐给大家的插件，它就是jqGrid。<br/>
<strong>官网</strong>：<a href="http://www.trirand.com/blog/">http://www.trirand.com/blog/</a>
<strong>DEMO</strong>：<a href="http://www.trirand.com/blog/jqgrid/jqgrid.html">http://www.trirand.com/blog/jqgrid/jqgrid.html</a>
<strong>WIKI</strong>：<a href="http://www.trirand.com/jqgridwiki/doku.php">http://www.trirand.com/jqgridwiki/doku.php</a>
</pre>
使用jqGrid有段时间了，经常遇到有些童鞋问我具体怎么用，说实话jqGrid的DEMO和WIKI文档写的很清楚，而且有示例代码，所以对于怎么使用我就不做代码搬运工了，我讲的是经验。
<h3>五、jQuery UI扩展-jqGrid高级应用(从正在运行项目中提取)</h3>
<ol>
	<li><strong>列表高度和宽度自动调整</strong>
这个话题是经常有人问到的，因为jqGrid的列表高度和宽度是可以自定义的，所以要做到可以充满整个窗口或者iframe，并且最重要的是可以根据窗口的调整自动设置grid的高度和宽度，下面列出我的配置。
<pre class="brush: js">
//-- 浏览器工具 --//
$.common.browser = {
	// 检测是否是IE浏览器
	isIE : function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'msie') {
			return true;
		} else {
			return false;
		}
	},
	// 检测是否是chrome浏览器
	isChrome : function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'webkit') {
			return true;
		} else {
			return false;
		}
	},
	// 检测是否是Firefox浏览器
	isMozila : function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'mozilla') {
			return true;
		} else {
			return false;
		}
	}
};

/**
 * 改变窗口大小的时候自动根据iframe大小设置jqGrid列表宽度和高度
 * 参数说明：{
 * 		enableAutoResize : 是否开启自动高度和宽度调整开关
 * 		dataGrid : jqGrid数据列表的ID
 * 		callback : 计算完dataGrid需要的高度和宽度后的回调函数
 * 		width : 默认为iframe的宽度，如果指定则设置为指定的宽度
 * 		height : 默认为iframe的高度，如果指定则设置为指定的高度
 * 		beforeAutoResize : 窗口大小调整时自动设置之前
 * 		afterAutoResize : 窗口大小调整时自动设置之后
 * }
 */
$.common.plugin.jqGrid.autoResize = function(options) {
	var defaults = {
		enableAutoResize : true,
		beforeAutoResize: null,
		afterAutoResize: null
	};
	options = $.extend({}, defaults, options);
		
	// 第一次调用
	var size = getWidthAndHeigh();
	if ($.isFunction(options.callback)) {
		options.callback(size);
		setToolbarHeight();
	}
	
	// 窗口大小改变的时候
	if (options.enableAutoResize === true) {
		if ($.isFunction(options.beforeAutoResize)) {
			options.beforeAutoResize();
		}
		window.onresize = function() {
			var size = getWidthAndHeigh(true);
			$(options.dataGrid).jqGrid('setGridHeight', size.height).jqGrid('setGridWidth', size.width);
			setToolbarHeight();
			if ($.isFunction(options.afterAutoResize)) {
				options.afterAutoResize(size);
			}
		};
	}
	
	// 根据浏览器不同设置工具栏的高度
	function setToolbarHeight() {
		// 根据浏览器不同设置工具栏的高度
		if ($.common.browser.isIE() && options.toolbarHeight) {
			if (options.toolbarHeight.top && options.toolbarHeight.top.ie) {
				$('#t_list').height(options.toolbarHeight.top.ie);
			}
			if (options.toolbarHeight.bottom && options.toolbarHeight.bottom.ie) {
				$('#tb_list').height(options.toolbarHeight.bottom.ie);
			}
		}
	}
	
	// 获取iframe大小
	function getWidthAndHeigh(resize) {
		var hasToolbar = !options.toolbar ? false : options.toolbar[0];
		if (hasToolbar) {
			var toolbarType = options.toolbar[1];
			if (!toolbarType) {
				alert('请设置工具栏的属性，toolbar ： [true, [top, both]]');
			}
		}
		
		var iframeHeight = !options.height ? document.documentElement.clientHeight : options.height;
		var iframeWidth = !options.width ? document.documentElement.clientWidth : options.width;
		// chrome
		if ($.common.browser.isChrome()) {
			if (hasToolbar) {
				if (toolbarType == 'top') {
					iframeWidth -= 8;
					iframeHeight -= 128;
				} else if (toolbarType == 'both') {
					iframeWidth -= 14;
					iframeHeight -= 140;
				}
			} else {
				iframeWidth -= 13;
				iframeHeight -= 87;
			}
		}
		// firefox
		else if ($.common.browser.isMozila()) {
			if (hasToolbar) {
				if (toolbarType == 'top') {
					iframeWidth -= 10;
					iframeHeight -= 122;
				} else if (toolbarType == 'both') {
					iframeWidth -= 12;
					iframeHeight -= 145;
				}
			} else {
				iframeWidth -= 10;
				iframeHeight -= 89;
			}
		} 
		// IE
		else {
			if (hasToolbar) {
				if (toolbarType == 'top') {
					if ($.common.browser.isIE() && options.toolbarHeight) {
						if (options.toolbarHeight.top && options.toolbarHeight.top.ie) {
							// 减去jqGrid的t_list默认高度和IE的兼容高度
							iframeHeight -= (options.toolbarHeight.top.ie - 21) - 15;
						}
					}
					iframeHeight -= 128;
					iframeWidth -= 15;
					setTimeout(function() {
						// 设置上方的toolbar
						$('#t_' + options.dataGrid.substr(1)).width(iframeWidth - 11);
					});
				} else if (toolbarType == 'both') {
					iframeWidth -= 14;
					iframeHeight -= 151;
					setTimeout(function() {
						// 设置上方的toolbar
						$('#t_' + options.dataGrid.substr(1)).width(iframeWidth - 11);
					});
				}
			} else {
				iframeWidth -= 12;
				iframeHeight -= 88;
			}
		}
		return {width: iframeWidth, height: iframeHeight};
	}
	
}
</pre>
调用方式：
<pre>
$(function() {
	// 自动根据窗口大小改变数据列表大小
	$.common.plugin.jqGrid.autoResize({
		dataGrid: '#list',
		toolbar: [true, 'top'],
		callback: listDatas
	});
	
});

function listDatas(size) {
	$("#list").jqGrid({
		....
		height: size.height,
		width: size.width
		....
	});
}
</pre>
这样在窗口调整大小的时候会自动设置grid的高度和宽度。
可以查看实际应用中的<a href="http://code.google.com/p/wsria/source/browse/trunk/wsria-demo/src/main/webapp/js/module/demo/jqgrid/datalibrary-list.js">例子</a>
</li>
<li><strong>如果可以尽量使用继承式配置</strong><br/>
使用继承方式的目的主要是修改一处配置整个项目都可以起到作用，除非特殊情况才覆盖公共的配置。例如刚刚的<a href="http://code.google.com/p/wsria/source/browse/trunk/wsria-demo/src/main/webapp/js/module/demo/jqgrid/datalibrary-list.js">例子</a>，提供我的例子：
<pre class="brush: js">
/**
 * 加载列表
 * 
 * @return
 */
function listDatas(size) {	

    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: moduleAction + '!list.action',
		rownumbers: true,
		rownumWidth: 50,
		toolbar: [true, 'both'],
		rowList: [20, 30, 40, 50, 100],
		pagerpos: 'center',
		colNames: ['工号', '姓名', '密码', '电子邮件', '部门', '角色'],
        colModel: [{
            name: 'employeeId',
			width: 50,
			align: 'center',
			searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		},
			search: true
        },
        .......],
		caption: "用户管理",
		editurl: moduleAction + '!save.action',
		gridComplete: $.common.plugin.jqGrid.gridComplete('list')
	})
	).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager, {
		add: false,
		edit: true,
		del: false,
		view: false,
		search: true
	}), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 450,
		editCaption: '修改',
		beforeShowForm: commonBeforeShowForm,
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    {}, 
	
    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
		url: moduleAction + '!delete.action'
	}),
	
	// search optios
	$.extend($.common.plugin.jqGrid.form.search, {
		closeAfterSearch: true
	}), 
	
	// view options
	$.extend($.common.plugin.jqGrid.form.view, {
		beforeShowForm: function(formid) {
    		$.common.plugin.jqGrid.navGrid.showAllField(formid);
	    }
	}));
       
}
</pre>

</li>
</ol>
<h3>六、结束语</h3>
以上列出了经常使用的一些配置和问题解决办法，所以抱着详细学习插件使用方法的你失望了，因为各个插件的官网均有详细的文档和DEMO演示；
<pre>以上的代码在<a href="http://code.google.com/p/wsria/source/browse/trunk/wsria-demo/src/main/webapp/js/common/common.js"><strong>这里</strong></a>可以找到，你可以从中提取，使用JSON扩展方式布局。<br/>
基本上在我的每个页面都会引入<a href="http://code.google.com/p/wsria/source/browse/trunk/wsria-demo/src/main/webapp/js/common/common.js">common.js</a>，大家可以整理出一个自己的common.js
</pre>

