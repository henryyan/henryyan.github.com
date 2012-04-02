$(function() {
	$('#content img:not(:eq(0))').hover(
		function() {
			var position = $(this).position();
			var tipHight = $('#tipInfo').height();
			var endTop = (position.top + $(this).height()) - tipHight;
			//$(this).addClass('active');
			
			// 设置提示内容
			var author = $(this).attr('author');
			if($(this).attr('url')) {
				var link = "<a href='" + $(this).attr('url') + "' title='查看详细' target='_blank'>" + author + "</a>";
				$("#tipInfo").html('作者：' + link);
			} else {
				$("#tipInfo").html("作者：" + author);
			}
			$("#tipInfo").width($(this).width()).show()
						.css({top: endTop + "px", left: position.left + "px"});
			$("#tipInfo").data('isfirst', false);
		}, 
		function() {
			//$(this).removeClass('active');
			$('#tipInfo').hide();
		}
	);
	
	// 当鼠标移动到提示条是继续保持显示状态
	// 从提示条上移除鼠标时隐藏
	$('#tipInfo').hover(
		function() {
			$(this).show();
		},function(){
			$(this).hide();
		}
	);
});