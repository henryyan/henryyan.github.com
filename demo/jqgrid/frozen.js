var browser = {
	// 检测是否是IE浏览器
	isIE: function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'msie') {
			return true;
		} else {
			return false;
		}
	},
	// 检测是否是chrome浏览器
	isChrome: function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'chrome') {
			return true;
		} else {
			return false;
		}
	},
	// 检测是否是Firefox浏览器
	isMozila: function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'mozilla') {
			return true;
		} else {
			return false;
		}
	},
	// 检测是否是Firefox浏览器
	isOpera: function() {
		var _uaMatch = $.uaMatch(navigator.userAgent);
		var _browser = _uaMatch.browser;
		if (_browser == 'webkit') {
			return true;
		} else {
			return false;
		}
	}
};
$(function() {
	$("#list").jqGrid({
		url: 'frozen.json',
		datatype: "json",
		colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes', '列名1', '列名2', '列名3', '列名4', '列名5'],
		width: 700,
		colModel: [{
			name: 'id',
			index: 'id',
			width: 55,
			frozen: true
		}, {
			name: 'invdate',
			index: 'invdate',
			width: 90,
			frozen: true
		}, {
			name: 'name',
			index: 'name asc, invdate',
			width: 100
		}, {
			name: 'amount',
			index: 'amount',
			width: 80,
			align: "right"
		}, {
			name: 'tax',
			index: 'tax',
			width: 80,
			align: "right"
		}, {
			name: 'total',
			index: 'total',
			width: 80,
			align: "right"
		}, {
			name: 'note',
			index: 'note'
		}, {
			name: 'column1',
			formatter: function() {
				return "<button>测试</button>";
			}
		}, {
			name: 'column2'
		}, {
			name: 'column3'
		}, {
			name: 'column4'
		}, {
			name: 'column5'
		}],
		shrinkToFit: false,
		rowNum: 10,
		rowList: [10, 20, 30],
		pager: '#pager',
		sortname: 'id',
		viewrecords: true,
		sortorder: "desc",
		caption: "列冻结高度问题--未冻结比冻结的列高"
	}).jqGrid('navGrid', '#pager', {
		edit: false,
		add: false,
		del: false
	}).jqGrid('setFrozenColumns');

	// hack方式解决高度问题
	$('#hackFrozenHeight').click(function() {
		hackHeight('#list');
	});

	// 加载第二个列表
	list1();
});

/**
 * 终极hack列冻结导致的高度问题
 * @param  {[String]} listId [列表ID]
 */

function hackHeight(listId) {
	$(listId + '_frozen tr').slice(1).each(function() {

		var rowId = $(this).attr('id');

		var frozenTdHeight = parseFloat($('td:first', this).height());
		var normalHeight = parseFloat($(listId + ' #' + $(this).attr('id')).find('td:first').height());

		// 如果冻结的列高度小于未冻结列的高度则hack之
		if (frozenTdHeight < normalHeight) {

			$('td', this).each(function() {

				/*
				 浏览器差异高度hack
				 */
				var space = 0; // opera默认使用0就可以
				if (browser.isChrome()) {
					space = 0.6;
				} else if (browser.isIE()) {
					space = -0.2;
				} else if (browser.isMozila()) {
					space = 0.5;
				}

				if (!$(this).attr('style') || $(this).attr('style').indexOf('height:') == -1) {
					$(this).attr('style', $(this).attr('style') + ";height:" + (normalHeight + space) + "px !important");
				}
			});
		}
	});
}

/**
 * 第二个列表
 * @return {[type]} [description]
 */

function list1() {

	$("#list1").jqGrid({
		url: 'frozen.json',
		datatype: "json",
		colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes', '列名1', '列名2', '列名3', '列名4', '列名5'],
		width: 700,
		colModel: [{
			name: 'id',
			index: 'id',
			width: 55,
			frozen: true
		}, {
			name: 'invdate',
			index: 'invdate',
			width: 90,
			frozen: true,
			formatter: function() {
				return "故意加高<br/>故意加高</br>故意加高<br/>故意加高";
			}
		}, {
			name: 'name',
			index: 'name asc, invdate',
			width: 100
		}, {
			name: 'amount',
			index: 'amount',
			width: 80,
			align: "right"
		}, {
			name: 'tax',
			index: 'tax',
			width: 80,
			align: "right"
		}, {
			name: 'total',
			index: 'total',
			width: 80,
			align: "right"
		}, {
			name: 'note',
			index: 'note'
		}, {
			name: 'column1',
			formatter: function() {
				return "<button>测试</button>";
			}
		}, {
			name: 'column2'
		}, {
			name: 'column3'
		}, {
			name: 'column4'
		}, {
			name: 'column5'
		}],
		shrinkToFit: false,
		rowNum: 10,
		rowList: [10, 20, 30],
		pager: '#pager1',
		sortname: 'id',
		viewrecords: true,
		sortorder: "desc",
		caption: "列冻结高度问题--冻结比未冻结的列高"
	}).jqGrid('navGrid', '#pager1', {
		edit: false,
		add: false,
		del: false
	}).jqGrid('setFrozenColumns');

	
	if (browser.isOpera()) {
		$('#hackFrozenHeight1').text('少年，Opera不需要修复！！！');
	} else {
		// hack方式修复高度
		$('#hackFrozenHeight1').click(function() {
			var listId = 'list1';
			var divTop = -1;
			var bdivTop = -1;

			// opera 不需要hack
			if (browser.isOpera()) {
				divTop = 0;
				bdivTop = 0;
			}

			$('#gview_' + listId + ' .frozen-div').css({
				top: $('#gview_' + listId + ' .frozen-div').position().top + divTop
			});
			$('#gview_' + listId + ' .frozen-bdiv').css({
				top: $('#gview_' + listId + ' .frozen-bdiv').position().top + bdivTop
			});
		});
	}
}