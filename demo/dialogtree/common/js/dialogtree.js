/**
 * dialogtree.js
 * @category   javascript
 * @package    jquery
 * @author     HenryYan <yanhonglei@gmail.com>
 * @version    1.0
 */ 
var DialogTree = function(options) {
	var self = this;
	var treeId = '.simpleTree';
	if ($.trim(options.templatePath) == '') {
		alert('人员树初始化失败，原因：没有树的引用页面!');
		return;
	} else if ($.trim(options.basePath) != ''
			&& $.trim(options.basePath).substring($.trim(options.basePath).length - 1) != '/') {
		alert('人员树初始化失败，原因：\n1、路径没有以/结尾!');
		return;
	}
	
	// 没有设置根目录默认为当前目录
	if(!options.basePath) {
		options.basePath = '';
	}
	
	// 设置dialogtree的自定义属性
	$.extend(self, options);
	
	self.dialogBox	= null;// 对话框对象
	
	this.idComp = null;// ID组件
	this.nameComp = null;// 名称组件
	this.dialogDepend = null;// 事件触发组件
	
	this.registeTree = function(treeOption) {
		this.idComp = treeOption.id;
		this.nameComp = treeOption.name;
		this.dialogDepend = treeOption.dialogDepend;
		
		var treeTitle = '选择树';
		if (treeOption.title != undefined) {
			treeTitle = treeOption.title;
		}
		
		// 设置对话框出现的位置
		var triggerId = document;// 对话框出现在哪个元素下方
		if(typeof self.dialogDepend == 'string') {
			triggerId = self.dialogDepend;
		} else if(typeof self.dialogDepend == 'object') {
			triggerId = $(self.dialogDepend).attr('id');
		}
		
		// 打开选择树
		var tempFilePath = self.basePath + self.templatePath;
		
		// weebox设置
		var weeboxOptions = {
			contentType : 'ajax',
			showAnimate : 'normal',
			width : 300,
			height : 280,
			title : treeTitle,
			onopen : newTree,
			onclose : function() {
				dealResult('close');
			}
		};
		
		// 设置weebox的自定义属性
		$.extend(weeboxOptions, self.weebox);
		
		$.weeboxs.open(tempFilePath, weeboxOptions);
	};
	
	/**
	 * 创建一颗新树
	 * @box 对话框对象
	 */
	function newTree(box) {
		
		// 弹出的对话框对象
		self.dialogBox = box;
		
		// 载入第一级目录
		$('#initLoadUrl').html('{url:' + self.basePath + self.ajaxPath + '}');
		
		var treeOptions = {
			basePath : self.basePath,
			drag : false,
			animate : true,
			afterClick : function(treeObj) {
				var activeObj = $('.active', treeObj);
				var selType = activeObj.attr('type');
				$('.treeTip', treeObj).empty();
				if(selType == self.selectType) {
					$('.treeTip').html("已选择：<font class='selected' style='font-weight:bold'>" + activeObj.text() + "</font>");
				} else {
					$('.treeTip').text('请选择对象');
				}
			},
			afterDblClick : function() {
				dealResult('dbclick');
			},
			afterContextMenu : function() {
				alert('right click');
			}
		};
		
		// 设置simpletree的自定义属性
		$.extend(treeOptions, self.simpletree);
		
		box.find(treeId).simpleTree(treeOptions);
		
		// 延迟自动打开前两层树
		setTimeout("$('.trigger').eq(0).trigger('click')",10);
		setTimeout("$('.trigger').eq(1).trigger('click')",20);
	}
	
	/**
	 * 内部函数处理选择的结果
	 */
	function dealResult(type) {
		// 获得已选用户
		var selTreeObj = $('.active[type=' + self.selectType +']', treeId);
		var idValue = $(selTreeObj).parent().attr('id');
		var nameValue = $(selTreeObj).html();
		var selType = $('.active').attr('type');// 选择的类型
		
		// 设置ID值
		if(self.idComp) {
			$(self.idComp).val(idValue);
		}
		
		// 如果使用formValidator插件时用blur()解决选择后没有验证成功的问题
		// 模拟失去焦点动作从而让formValidator验证表单完整性
		// 不使用formValidator插件可以修改下面的代码为：$('#' + self.nameComp).val(nameValue);
		if(self.nameComp) {
			$(self.nameComp).val(nameValue).blur();
		}
		
		// 选择后触发回调函数
		if($.isFunction(self.onselected)) {
			self.onselected(selTreeObj);
		}
		
		// 双击关闭
		if(type == 'dbclick') {
			self.dialogBox.close();
		}
		
	}
}