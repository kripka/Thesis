$(function(){

	$('#full-page').fullpage({
		resize: false
	});
	
	
	// NAV SLIDE
	var nav_btns = $('#fixed-nav a');
	
	nav_btns.on('mouseenter',function(){
		$(this).stop().animate({right:'180px'},100,'easeInOutQuad');
	});
	
	nav_btns.on('mouseleave',function(){
		$(this).stop().animate({right:'0'},100,'easeInOutQuad');
	});
	
	nav_btns.on('click',function(){
		var link = $(this).index() + 1;
		console.log(link);
		nav_btns.removeClass('active');
		$(this).addClass('active');
		$.fn.fullpage.moveTo(link);
		
		return false;
	})
	

	
});