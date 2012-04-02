$(function() {
	var tree1 = new DialogTree({
		templatePath	: 'productTemplate.html',
		ajaxPath 		: 'data.html',
		selectType		: '0',
		onselected		: function(treeObj) {}
	});
	
	$('#showTree1').click(function(){
		tree1.registeTree({
			title	: '选择[产品1]',
			id		: '#demo1 #productId', 
			name	: '#demo1 #productName'
		});
	});
	
	var tree2 = new DialogTree({
		templatePath	: 'productTemplate.html',
		ajaxPath 		: 'data.html',
		selectType		: '0',
		weebox			: {width: 700},
		simpletree		: {autoclose: true},
		onselected		: function(treeObj) {}
	});
	
	$('#showTree2').click(function(){
		tree2.registeTree({
			title	: '选择[产品2]',
			id		: '#demo2 #productId', 
			name	: '#demo2 #productName'
		});
	});
});