/**
 * weetips.js
 *
 * weetips javascript
 *
 * @category   javascript
 * @package    jquery
 * @author     Jack <xiejinci@gmail.com>
 * @copyright  Copyright (c) 2006-2008 9wee Com. (http://www.9wee.com)
 * @license    http://www.9wee.com/license/
 * @version    
 */ 
(function($) {	
	var weetips = function() {
		this.init = function(options) {
			$('<style type="text/css">'	+ 
				'#weetips{'	+ 
					'border:1px solid #000;' +
					'z-index:9999;'	+ 
					'position:absolute;' + 
					'background:#4c4c4c;' + 
					'color:#fff;' + 
					'padding:5px 10px;'	+ 
				'}'	+ 
			  '</style>').appendTo('body');
			$('<div id="weetips"></div>').appendTo('body').hide();			
			$(".weetips").mouseover(function(event) {
				var msg = $(this).attr('title');
				if ($.trim(msg) == '')  {
					return false;
				}		
				$(this).attr('msg', msg);
				$(this).removeAttr('title');				
				$('#weetips').html(msg);
				$.weetips.setPosition(event);		
				$('#weetips').show();			
			}).mousemove(function(event){
				$.weetips.setPosition(event);
			}).mouseout(function() {
				$('#weetips').hide();		
				$(this).attr('title',$(this).attr('msg'));
				$(this).removeAttr('msg');
			});	
		}
		
		this.setPosition = function(event) {
			var left = $.weetips.getLeft(event);
			var top = $.weetips.getTop(event);			
			$('#weetips').css({left:left, top:top}).show();
		}
		
		this.getLeft = function(event) {
			var left = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)+event.clientX;
			if (left+$('#weetips').width()>=document.body.clientWidth) {
				left = event.clientX - 10 - $('#weetips').width();
			} else {
				left = left + 10;
			}
			return left;
		}
		
		this.getTop = function(event) {
			var top = Math.max(document.documentElement.scrollTop, document.body.scrollTop)+event.clientY;
			if (top+$('#weetips').height()>=document.body.clientHeight) {
				top = top - 10 - $('#weetips').height();
			} else {
				top = top + 10;
			}		
			return top;
		}
	};	
	$.extend({weetips: new weetips()});	
})(jQuery);