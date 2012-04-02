/**
 * weebox.js
 * @category   javascript
 * @package    jquery
 * @author     Jack <xiejinci@gmail.com>
 * @version    
 */ 
(function($) {
	var cachedata = {};
	var arrweebox = new Array();
	var weebox = function(content,options) {
		var self 		= this;
		this.dh 		= null;
		this.mh 		= null;
		this.dc			= null;
		this.dt			= null;
		this.db			= null;
		this.selector 	= null;	
		this.ajaxurl 	= null;
		this.options 	= null;
		this._dragging 	= false;
		this._content 	= content || '';
		this._options 	= options || {};
		this._defaults 	= {
			boxid: null,
			boxclass: null,
			cache: false,
			type: 'dialog',
			title: '',
			width: 0,
			height: 0,
			timeout: 0, 
			draggable: true,
			modal: true,
			focus: null,
			blur: null,
			position: 'center',
			overlay: 30,
			showTitle: true,
			showButton: true,
			showCancel: true, 
			showOk: true,
			okBtnName: '确定',
			cancelBtnName: '取消',
			contentType: 'text',
			contentChange: false,
			clickClose: false,
			zIndex: 999,
			animate: '',
			showAnimate:'',
			hideAnimate:'',
			onclose: null,
			onopen: null,
			oncancel: null,
			onok: null,
			suggest:{url:'',tele:'',vele:'',fn:null},
			select:{url:'',type:'radio', tele:'',vele:'',width:120,search:false,fn:null}
		};
		//初始化选项
		this.initOptions = function() {
			self._options = self._options || {};
			self._options.animate = self._options.animate || '';
			self._options.showAnimate = self._options.showAnimate || self._options.animate;
			self._options.hideAnimate = self._options.hideAnimate || self._options.animate;
			self._options.type = self._options.type || 'dialog';
			self._options.title = self._options.title || '';
			self._options.boxclass = self._options.boxclass || 'wee'+self._options.type;
			self._options.contentType = self._options.contentType || "";
			if (self._options.contentType == "") {
				self._options.contentType = (self._content.substr(0,1) == '#') ? 'selector' : 'text';
			}
			self.options  = $.extend({}, self._defaults, self._options);
			self._options = null;
			self._defaults = null;
		};
		//初始化弹窗Box
		this.initBox = function() {
			var html = '';
			switch(self.options.type) {
				case 'alert':
				case 'select':
				case 'dialog':
				html =  '<div class="weedialog">' +
						'	<div class="dialog-header">' +
						'		<div class="dialog-tl"></div>' +
						'		<div class="dialog-tc">' +
						'			<div class="dialog-tc1"></div>' +
						'			<div class="dialog-tc2"><a href="javascript:;" onclick="return false" title="关闭" class="dialog-close"></a><span class="dialog-title"></span></div>' +
						'		</div>' +
						'		<div class="dialog-tr"></div>' +
						'	</div>' +
						'	<table width="100%" border="0" cellspacing="0" cellpadding="0" >' +
						'		<tr>' +
						'			<td class="dialog-cl"></td>' +
						'			<td>' +
						'				<div class="dialog-content"></div>' +
						'				<div class="dialog-button">' +
						'					<input type="button" class="dialog-ok" value="确定">' +
						'					<input type="button" class="dialog-cancel" value="取消">' +
						'				</div>' +
						'			</td>' +
						'			<td class="dialog-cr"></td>' +
						'		</tr>' +
						'	</table>' +
						'	<div class="dialog-bot">' +
						'		<div class="dialog-bl"></div>' +
						'		<div class="dialog-bc"></div>' +
						'		<div class="dialog-br"></div>' +
						'	</div>' +
						'</div>';
						break;
				case 'custom':
				case 'suggest':
				html = '<div><div class="dialog-content"></div></div>';
						break;
			}
			self.dh = $(html).appendTo('body').hide().css({
				position: 'absolute',	
				overflow: 'hidden',
				zIndex: self.options.zIndex
			});
			self.dc = self.find('.dialog-content');
			self.dt = self.find('.dialog-title');
			self.db = self.find('.dialog-button');
			if (self.options.boxid) {
				self.dh.attr('id', self.options.boxid);
			}	
			if (self.options.boxclass) {
				self.dh.addClass(self.options.boxclass);
			}
			if (self.options.height>0) {
				self.dc.css('height', self.options.height);
			}
			if (self.options.width>0) {
				self.dh.css('width', self.options.width);
			}
			self.dh.bgiframe();
		}
		//初始化遮照
		this.initMask = function() {
			if (self.options.modal) {
				if ($.browser.msie) {
                    h= document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
                    w= document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
                } else {
                    h= self.bheight();
                    w= self.bwidth();
                }
				self.mh = $("<div class='dialog-mask'></div>")
				.appendTo('body').hide().css({
					width: w,
					height: h,
					zIndex: self.options.zIndex-1
				}).bgiframe();
			}
		}
		//初始化弹窗内容
		this.initContent = function(content) {
			self.dh.find(".dialog-ok").val(self.options.okBtnName);
			self.dh.find(".dialog-cancel").val(self.options.cancelBtnName);	
			if (self.options.title == '') {
				//self.dt.hide();	
				//self.dt.html(self._titles[self._options.type] || '');
			} else {
				self.dt.html(self.options.title);
			}
			if (!self.options.showTitle) {
				self.dt.hide();
			}	
			if (!self.options.showButton) {
				self.dh.find('.dialog-button').hide();
			}
			if (!self.options.showCancel) {
				self.dh.find('.dialog-cancel').hide();
			}							
			if (!self.options.showOk) {
				self.dh.find(".dialog-ok").hide();
			}
			if (self.options.type == 'suggest') {//例外处理
				self.hide();
				//self.options.clickClose = true;
				$(self.options.suggest.tele).unbind('keyup').keyup(function(){
					var val = $.trim(this.value);
					var data = null;
					for(key in cachedata) {
						if (key == val) {
							data = cachedata[key];
						}
					}
					if (data === null) {
						$.ajax({
							type: "GET",
							data:{q:val},
						  	url: self.options.suggest.url || self._content,
						  	success: function(res){data = res;},
						  	dataType:'json',
						  	async: false				  	
						});
					}
					cachedata[val] = data;
					var html = '';
					for(key in data) {
						html += '<li>'+data[key].name+'</li>';
					}
					self.setContent(html);
					self.show();
					self.find('li').click(function(){
						var i = self.find('li').index(this);
						$(self.options.suggest.tele).val(data[i].name);
						$(self.options.suggest.vele).val(data[i].id);
						if (typeof self.options.suggest.fn == 'function') {
							fn(data[i]);
						}
						self.hide();
					});
				});
			} else if(self.options.type == 'select') {
				var type = self.options.select.type || 'radio';
				var url = self.options.select.url || self._content || '';
				var search = self.options.select.search || false;
				$.ajax({
					type: "GET",
				  	url: url,
				  	success: function(data){
						var html = '';
						if (data === null) {
							html = '没有数据';
						} else {
							if (search) {
								html += '<div class="wsearch"><input type="text"><input type="button" value="查询"></div>';
							}
							var ovals = $.trim($(self.options.select.vele).val()).split(',');//原值
							html += '<div class="wselect">';
							for(key in data) {
								var checked = ($.inArray(data[key].id, ovals)==-1)?'':'checked="checked"'; 
								html += '<li><label><input name="wchoose" '+checked+' type="'+type+'" value="'+data[key].id+'">'+data[key].name+'</label></li>';
							}
							html += '</div>';
						}
						self.setContent(html);
						self.find('li').width(self.options.select.width);
						self.find('.wsearch input').keyup(function(){
							var v = $.trim(this.value);
							self.find('li').hide();
							for(i in data) {
								if (data[i].id==v || data[i].name.indexOf(v)!=-1) {
									self.find('li:eq('+i+')').show();
								}
							}
						});
						self.setOnok(function(){
							if (type=='radio') {
								if (self.find(':checked').length == 0) {
									$(self.options.select.tele).val('');
									$(self.options.select.vele).val('');
								} else {
									var i = self.find(':radio[name=wchoose]').index(self.find(':checked')[0]);
									$(self.options.select.tele).val(data[i].name);
									$(self.options.select.vele).val(data[i].id);
									if (typeof self.options.select.fn == 'function') fn(data[i]);
								}
							} else {
								if (self.find(':checked').length == 0) {
									$(self.options.select.tele).val('');
									$(self.options.select.vele).val('');
								} else {
									var temps=[],ids=[],names=[];
									self.find(':checked').each(function(){
										var i = self.find(':checkbox[name=wchoose]').index(this);
										temps.push(data[i]);
										ids.push(data[i].id);
										names.push(data[i].name);
									});
									$(self.options.select.tele).val(names.join(","));
									$(self.options.select.vele).val(ids.join(","));
									if (typeof self.options.select.fn == 'function') fn(temps);
								}
							}
							self.close();
						});
						self.show();
					},
				  	dataType:'json'
				});
			} else {				
				if (self.options.contentType == "selector") {
					self.selector = self._content;
					self._content = $(self.selector).html();
					self.setContent(self._content);
					//if have checkbox do
					var cs = $(self.selector).find(':checkbox');
					self.dc.find(':checkbox').each(function(i){
						this.checked = cs[i].checked;
					});
					$(self.selector).empty();
					self.show();
					self.focus();
					self.onopen();
				} else if (self.options.contentType == "ajax") {	
					self.ajaxurl = self._content;	
					self.setLoading();				
					self.show();
					self.dh.find(".dialog-button").hide();
					if (self.options.cache == false) {
						if (self.ajaxurl.indexOf('?') == -1) {
							self.ajaxurl += "?_t="+Math.random();
						} else {
							self.ajaxurl += "&_t="+Math.random();
						}
					}
					$.get(self.ajaxurl, function(data) {
						self._content = data;
				    	self.setContent(self._content);
				    	self.show();
						self.focus();
				    	self.onopen();
					});
				} else if (self.options.contentType == "iframe") { /*加入iframe使程序可以直接引用其它页面 by ePim*/
					self.setContent('<iframe src="'+self._content+'" width="100%" height="100%" frameborder="no"></iframe>');
					self.onopen();	
					self.show();	
					self.focus();
				} else {
					self.setContent(self._content);	
					self.show();
					self.focus();
					self.onopen();
				}
			}
		}
		//初始化弹窗事件
		this.initEvent = function() {
			self.dh.find(".dialog-close, .dialog-cancel, .dialog-ok").unbind('click').click(function(){self.close()});			
			if (typeof(self.options.onok) == "function") {
				self.dh.find(".dialog-ok").unbind('click').click(function(){self.options.onok(self)});
			} 
			if (typeof(self.options.oncancel) == "function") {
				self.dh.find(".dialog-cancel").unbind('click').click(function(){self.options.oncancel(self)});
			}	
			if (self.options.timeout>0) {
				window.setTimeout(self.close, (self.options.timeout * 1000));
			}			
			this.drag();			
		}
		//设置onok事件
		this.setOnok = function(fn) {
			self.dh.find(".dialog-ok").unbind('click');
			if (typeof(fn)=="function")	self.dh.find(".dialog-ok").click(function(){fn(self)});
		}
		//设置onOncancel事件
		this.setOncancel = function(fn) {
			self.dh.find(".dialog-cancel").unbind('click');
			if (typeof(fn)=="function")	self.dh.find(".dialog-cancel").click(function(){fn(self)});
		}
		//设置onOnclose事件
		this.setOnclose = function(fn) {
			self.options.onclose = fn;
		}
		//弹窗拖拽
		this.drag = function() {		
			if (self.options.draggable && self.options.showTitle) {
				self.dh.find('.dialog-header').mousedown(function(event){
					var h  = this; 
					var o  = document;
					var ox = self.dh.position().left;
					var oy = self.dh.position().top;
					var mx = event.clientX;
					var my = event.clientY;
					var width = self.dh.width();
					var height = self.dh.height();
					var bwidth = self.bwidth();
					var bheight = self.bheight(); 
			        if(h.setCapture) {
			            h.setCapture();
			        }
					$(document).mousemove(function(event){						
						if (window.getSelection) {
							window.getSelection().removeAllRanges();
						} else { 
				        	document.selection.empty();
				        }
						//TODO
						var left = Math.max(ox+event.clientX-mx, 0);
						var top = Math.max(oy+event.clientY-my, 0);
						var left = Math.min(left, bwidth-width);
						var top = Math.min(top, bheight-height);
						self.dh.css({left: left, top: top});
					}).mouseup(function(){
						if(h.releaseCapture) { 
			                h.releaseCapture();
			            }
				        $(document).unbind('mousemove');
				        $(document).unbind('mouseup');
					});
				});			
			}	
		}
		//打开前的回弹函数
		this.onopen = function() {							
			if (typeof(self.options.onopen) == "function") {
				self.options.onopen(self);
			}	
		}
		//增加一个按钮
		this.addButton = function(opt) {
			opt = opt || {};
			opt.title = opt.title || 'OK';
			opt.bclass = opt.bclass || 'dialog-btn1';
			opt.fn = opt.fn || null;
			opt.index = opt.index || 0;
			var btn = $('<input type="button" class="'+opt.bclass+'" value="'+opt.title+'">').click(function(){
				if (typeof opt.fn == "function") opt.fn(self);
			});
			if (opt.index < self.db.find('input').length) {
				self.db.find('input:eq('+opt.index+')').before(btn);
			} else {
				self.db.append(opt);
			}			
		}
		//显示弹窗
		this.show = function() {
			if (self.options.showButton) {
				self.dh.find('.dialog-button').show();
			}
			if (self.options.position == 'center') {
				self.setCenterPosition();
			} else {
				self.setElementPosition();
			}
			if (typeof self.options.showAnimate == "string") {
				self.dh.show(self.options.animate);
			} else {
				self.dh.animate(self.options.showAnimate.animate, self.options.showAnimate.speed);
			}
			if (self.mh) {
				self.mh.show();
			}
		}
		this.hide = function(fn) {
			if (typeof self.options.hideAnimate == "string") {
				self.dh.hide(self.options.animate, fn);
			} else {
				self.dh.animate(self.options.hideAnimate.animate, self.options.hideAnimate.speed, "", fn);
			}
		}
		//设置弹窗焦点
		this.focus = function() {
			if (self.options.focus) {
				self.dh.find(self.options.focus).focus();//TODO IE中要两次
				self.dh.find(self.options.focus).focus();
			} else {
				self.dh.find('.dialog-cancel').focus();
			}
		}
		//在弹窗内查找元素
		this.find = function(selector) {
			return self.dh.find(selector);
		}
		//设置加载加状态
		this.setLoading = function() {			
			self.setContent('<div class="dialog-loading"></div>');
			self.dh.find(".dialog-button").hide();
			if (self.dc.height()<90) {				
				self.dc.height(Math.max(90, self.options.height));
			}
			if (self.dh.width()<200) {
				self.dh.width(Math.max(200, self.options.width));
			}
		}
		this.setWidth = function(width) {
			self.dh.width(width);
		}
		//设置标题
		this.setTitle = function(title) {
			self.dt.html(title);
		}
		//取得标题
		this.getTitle = function() {
			return self.dt.html();
		}
		//设置内容
		this.setContent = function(content) {
			self.dc.html(content);
			if (self.options.height>0) {
				self.dc.css('height', self.options.height);
			} else {
				self.dc.css('height','');
			}
			if (self.options.width>0) {
				self.dh.css('width', self.options.width);
			} else {
				self.dh.css('width','');
			}
			if (self.options.showButton) {
				self.dh.find(".dialog-button").show();
			}
		}
		//取得内容
		this.getContent = function() {
			return self.dc.html();
		}	
		//使能按钮
		this.disabledButton = function(btname, state) {
			self.dh.find('.dialog-'+btname).attr("disabled", state);
		}
		//隐藏按钮
		this.hideButton = function(btname) {
			self.dh.find('.dialog-'+btname).hide();			
		}
		//显示按钮
		this.showButton = function(btname) {
			self.dh.find('.dialog-'+btname).show();	
		}
		//设置按钮标题
		this.setButtonTitle = function(btname, title) {
			self.dh.find('.dialog-'+btname).val(title);	
		}
		//操作完成
		this.next = function(opt) {
			opt = opt || {};
			opt.title = opt.title || self.getTitle();
			opt.content = opt.content || "";
			opt.okname = opt.okname || "确定";
			opt.width = opt.width || 260;
			opt.onok = opt.onok || self.close;
			opt.onclose = opt.onclose || null;
			opt.oncancel = opt.oncancel || null;
			opt.hideCancel = opt.hideCancel || true;
			self.setTitle(opt.title);
			self.setButtonTitle("ok", okname);
			self.setWidth(width);
			self.setOnok(opt.onok);
			if (opt.content != "") self.setContent(opt.content);
			if (opt.hideCancel)	self.hideButton("cancel");
			if (typeof(opt.onclose) == "function") self.setOnclose(opt.onclose);
			if (typeof(opt.oncancel) == "function") self.setOncancel(opt.oncancel);
			self.show();
		}
		//关闭弹窗
		this.close = function(n) {
			if (typeof(self.options.onclose) == "function") {
				self.options.onclose(self);
			}
			if (self.options.contentType == 'selector') {
				if (self.options.contentChange) {
					//if have checkbox do
					var cs = self.find(':checkbox');
					$(self.selector).html(self.getContent());						
					if (cs.length > 0) {
						$(self.selector).find(':checkbox').each(function(i){
							this.checked = cs[i].checked;
						});
					}
				} else {
					$(self.selector).html(self._content);
				}
			}
			//设置关闭后的焦点
			if (self.options.blur) {
				$(self.options.blur).focus();
			}
			//从数组中删除
			for(i=0;i<arrweebox.length;i++) {
				if (arrweebox[i].dh.get(0) == self.dh.get(0)) {
					arrweebox.splice(i, 1);
					break;
				}
			}
			self.hide();
			self.dh.remove();
			if (self.mh) {
				self.mh.remove();
			}
		}
		//取得遮照高度
		this.bheight = function() {
			if ($.browser.msie && $.browser.version < 7) {
				var scrollHeight = Math.max(
					document.documentElement.scrollHeight,
					document.body.scrollHeight
				);
				var offsetHeight = Math.max(
					document.documentElement.offsetHeight,
					document.body.offsetHeight
				);
				
				if (scrollHeight < offsetHeight) {
					return $(window).height();
				} else {
					return scrollHeight;
				}
			} else {
				return $(document).height();
			}
		}
		//取得遮照宽度
		this.bwidth = function() {
			if ($.browser.msie && $.browser.version < 7) {
				var scrollWidth = Math.max(
					document.documentElement.scrollWidth,
					document.body.scrollWidth
				);
				var offsetWidth = Math.max(
					document.documentElement.offsetWidth,
					document.body.offsetWidth
				);
				
				if (scrollWidth < offsetWidth) {
					return $(window).width();
				} else {
					return scrollWidth;
				}
			} else {
				return $(document).width();
			}
		}
		//将弹窗显示在中间位置
		this.setCenterPosition = function() {
			var wnd = $(window), doc = $(document),
				pTop = doc.scrollTop(),	pLeft = doc.scrollLeft();
			pTop += (wnd.height() - self.dh.height()) / 2;
			pLeft += (wnd.width() - self.dh.width()) / 2;
			self.dh.css({top: pTop, left: pLeft});
		}
		//根据元素设置弹窗显示位置
		this.setElementPosition = function() {
			var trigger = $(self.options.position.refele);
			var reftop = self.options.position.reftop || 0;
			var refleft = self.options.position.refleft || 0;
			var adjust = (typeof self.options.position.adjust=="undefined")?true:self.options.position.adjust;
			var top = trigger.offset().top + trigger.height();
			var left = trigger.offset().left;
			var docWidth = document.documentElement.clientWidth || document.body.clientWidth;
			var docHeight = document.documentElement.clientHeight|| document.body.clientHeight;
			var docTop = document.documentElement.scrollTop|| document.body.scrollTop;
			var docLeft = document.documentElement.scrollLeft|| document.body.scrollLeft;
			var docBottom = docTop + docHeight;
			var docRight = docLeft + docWidth;
			if (adjust && left + self.dh.width() > docRight) {
				left = docRight - self.dh.width() - 1;
			}
			if (adjust && top + self.dh.height() > docBottom) {
				top = docBottom - self.dh.height() - 1;
			}
			left = Math.max(left+refleft, 0);
			top = Math.max(top+reftop, 0);
			self.dh.css({top: top, left: left});
		}
		this.initOptions();
		this.initMask();
		this.initBox();		
		this.initContent();
		this.initEvent();
	}	
	
	var weeboxs = function() {		
		var self = this;
		this._onbox = false;
		this._opening = false;
		this.zIndex = 999;
		this.length = function() {
			return arrweebox.length;
		}
		this.open = function(content, options) {
			self._opening = true;
			if (typeof(options) == "undefined") {
				options = {};
			}
			if (options.boxid) {
				for(var i=0; i<arrweebox.length; i++) {
					if (arrweebox[i].dh.attr('id') == options.boxid) {
						arrweebox[i].close();
						break;
					}
				}
			}
			options.zIndex = self.zIndex;
			self.zIndex += 10;
			var box = new weebox(content, options);
			box.dh.click(function(){self._onbox = true;});
			arrweebox.push(box);
			/*-----解决在ie下页面过大时出现部分阴影没有覆盖的问题-----by ePim*/
			if (box.options.position != "center"){
				box.setElementPosition();
			}
			if (box.mh) {
				box.mh.css({
					width: box.bwidth(),
					height: box.bheight()
				});
			}
			/*-----解决在ie下页面过大时出现部分没有遮罩的问题-----by ePim(WanJiDong@gmail.com)*/
			return box;
		}
		//关闭最上层窗体,程序调用方法：jQuery.weeboxs.close();
		this.close = function(){
			var closingBox = this.getTopBox();
			if(false!=closingBox) {
				closingBox.close();
			}
		}
		this.getTopBox = function() {
			if (arrweebox.length>0) {
				return arrweebox[arrweebox.length-1];
			} else {
				return false;
			}
		}
		$(window).scroll(function() {
			if (arrweebox.length > 0) {
				for(i=0;i<arrweebox.length;i++) {
					var box = arrweebox[i];//self.getTopBox();
					/*if (box.options.position == "center") {
						box.setCenterPosition();
					}*/
					if (box.options.position != "center"){
						box.setElementPosition();
					}
					if (box.mh) {
						box.mh.css({
							width: box.bwidth(),
							height: box.bheight()
						});
					}
				}
			}		
		}).resize(function() {
			if (arrweebox.length > 0) {
				var box = self.getTopBox();
				if (box.options.position == "center") {
					box.setCenterPosition();
				}
				if (box.mh) {
					box.mh.css({
						width: box.bwidth(),
						height: box.bheight()
					});
				}
			}
		});
		$(document).click(function(event) {
			if (event.button==2) return true;
			if (arrweebox.length>0) {
				var box = self.getTopBox();
				if(!self._opening && !self._onbox && box.options.clickClose) {
					box.close();
				}
			}
			self._opening = false;
			self._onbox = false;
		});
	}
	$.extend({weeboxs: new weeboxs()});		
})(jQuery);