/*
 * Instagram Fancybox C5 Site Scripts
 * Version: 1.0
 *
 * Author: Chris Rivers
 * http://chrisriversdesign.com
 *
 *
 * Changelog: 
 * Version: 1.0
 *
 */


$(document).ready(function(){
	// Navigation
	$("#header .navigation li").click(function(){
		$('html,body').animate({scrollTop: ($("#"+$(this).attr('rel')).offset().top) }, 500);
		return false;
	});
	
	$("#middle .customization-bar").delay(500).animate({
		top: '180px'
	}, 400);
	
	// Skins
	var mySkins = new Array();
	mySkins[0] = "business";
	mySkins[1] = "pearl";
	mySkins[2] = "aqua";
	mySkins[3] = "sun";
	mySkins[4] = "future";
	mySkins[5] = "dream";
	mySkins[6] = "fashion";
	
	$(".customization-bar select.choose-skin").change(function(){
		// Out with old
		$.each(mySkins, function(i,e){
			$(".demo").removeClass(e);
		});
		
		$(".mejs-container").fadeOut("fast").delay(700).fadeIn();
		
		// In with the new
		$(".demo").addClass($(this).val());
	});
	
	// Scroll Glyph
	$(".demo-glyph, .demo-glyph-2").delay(2000).fadeIn();
	var interval = setInterval(animateGlyph, 700);
	function animateGlyph() { $(".demo-glyph, .demo-glyph-2").toggleClass('on'); }
});