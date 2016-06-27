/*
 * Simple Instagram Video
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

// Global
var ibObj;
var instagramBrowserNextMax;

/* Instagram Popular Fetch
------------------------------*/
function instagramFetch(settings){	
	var access_token = settings.accessToken;
    var param = {access_token:access_token};
    fetchCMD(param, settings);
}

function fetchCMD(param, settings){

	var cmdURL = "";
	
	if( settings.mode == 'user' ){
		// User Mode
		cmdURL = 'https://api.instagram.com/v1/users/' + settings.userID + '/media/recent/?callback=?';
		
	} else if( settings.mode == 'popular' ) { // No Load More For this Feature
		// Popular Mode
    	cmdURL = 'https://api.instagram.com/v1/media/popular?callback=?';

	} else if( settings.mode == 'liked' ) {
		// Photos User Liked
		cmdURL = 'https://api.instagram.com/v1/users/self/media/liked?callback=?';

	} else if( settings.mode == 'multiuser' ){ // No Load More For this Feature
		// New - Multi User Mode
		var userIDArray = settings.userID;
		userIDArray = userIDArray.split(",");

		$.each(userIDArray, function(index){			
			cmdURL = 'https://api.instagram.com/v1/users/' + userIDArray[index] + '/media/recent/?callback=?';

			$.getJSON(cmdURL, param, function(data){
				onPhotoLoaded(data, settings, "off");
			});
		});

		return false;

	} else {
		// New - Tags Mode
		var tagQuery = settings.tag.replace(/ /g,'');
		cmdURL = 'https://api.instagram.com/v1/tags/' + tagQuery + '/media/recent?callback=?';
	}

   	$.getJSON(cmdURL, param, function(data){
		onPhotoLoaded(data, settings);
	});
}

/* Instagram User Search
------------------------------*/
function instagramUserSearch(settings){
	var access_token = settings.accessToken;
	var searchQuery = settings.user;
	var param = {access_token:access_token,q:searchQuery};
		
    userSearchCMD(param, settings);
}

function userSearchCMD(param, settings){
	var cmdURL = 'https://api.instagram.com/v1/users/search?callback=?';
	
   	$.getJSON(cmdURL, param, function(data){
		onUserLoaded(data, settings);
	});
}

function onUserLoaded(data, settings){
	if( data.meta.code == 200 ){
        var users = data.data;
		// console.log(data);
		
		if( users.length > 0 ){
            for( var key in users ){
				// Build UI
				var user = users[key];			
				var instagramUser = '';
							
				instagramUser = '<div class="instagram-user-all" id="p' + user.id + '" title="' + user.username + '" rel="' + user.id + '">';
				instagramUser += 	"<img src='" + user.profile_picture + "' />";
				instagramUser += 	"<span class='instagram-username'>" + user.username + "</span>";
				instagramUser += 	"<span class='instagram-fullname'>" + user.full_name + "</span>";
				instagramUser += '</div>';

	            $(instagramUser).appendTo(ibObj);
				
			}
			
			$(ibObj).append('<div class="clear"></div');
		}
		
	}
}

/* Instagram Tags Load More
---------------------------------*/
function instagramTagsLoadMore(settings){
	var access_token = settings.accessToken;
    var param = {access_token:access_token, max_tag_id: instagramBrowserNextMax};

	if( settings.mode == 'tag' ){
		var searchQuery = settings.tag.replace(/ /g,'');
	}

    loadMoreCMD(settings,param,searchQuery);
}

function loadMoreCMD(settings, param, searchQuery){

	var cmdURL = "";
	cmdURL = "https://api.instagram.com/v1/tags/" + searchQuery + "/media/recent?callback=?";

   	$.getJSON(cmdURL, param, function(data){
		onPhotoLoaded(data, settings);
	});
}

/* Instagram Users Load More
---------------------------------*/
function instagramUsersLoadMore(settings){
	var access_token = settings.accessToken;
    var param = {access_token:access_token, max_id: instagramBrowserNextMax};

    loadMoreUsersCMD(settings,param);
}

function loadMoreUsersCMD(settings, param){

	cmdURL = 'https://api.instagram.com/v1/users/' + settings.userID + '/media/recent/?callback=?';

   	$.getJSON(cmdURL, param, function(data){
		onPhotoLoaded(data, settings);
	});
}

/* Photo Handler
------------------------------*/
function onPhotoLoaded(data, settings, loadMoreBool){
			
	// Store Next Page of Results... // next_url
	if( data.pagination ){
		if( data.pagination.next_max_tag_id ){
			instagramBrowserNextMax = data.pagination.next_max_tag_id;
		} else if( data.pagination.next_max_id ){
			instagramBrowserNextMax = data.pagination.next_max_id;
		} else {
			instagramBrowserNextMax = "Empty";
		}	
	} else {
		instagramBrowserNextMax = "Empty";
	}

    if( data.meta.code == 200 ){

		// Testing
		// console.log(data);

		// Setting Up Variables
        var photos = data.data;

		if( ibObj.html() != "" ){
			var addingToList = true;
		} else {
			var addingToList = false;
		}

        if( photos.length > 0 ){

			// console.log(photos);

            for( var key in photos ){
				
				// Get Photo Data
				var photo = photos[key];

				// Build DOM
				var instagramPhoto = '';				
				var photoCaption = '';

				// Fallback
				if( photo.caption ){
					photoCaption = photo.caption.text;
				} else {
					photoCaption = "Instagram Media";
				}

				// Fallback
				if( photo.link == null ){
					photo.link = "http://instagram.com/p/"
				}
				
				// Video URL
				var videoURL = 'None';

				if( photo.videos ){
					videoURL = photo.videos.standard_resolution.url;
				}
				
				if( settings.galleryMode == 'thumbnail'){
					if( photo.type == 'video' ){
						instagramPhoto = '<div class="instagram-photo '+ photo.type +'">';
						instagramPhoto += 	'<video width="225" height="225" poster="'+ photo.images.low_resolution.url +'">';
						instagramPhoto += 	'  <source src="'+ videoURL +'">';
						instagramPhoto += 	'</video>';
						instagramPhoto += '</div>';
					} else {
						instagramPhoto = '<a class="instagram-photo '+ photo.type +'" data-video ="' + videoURL + '" href="' + photo.images.standard_resolution.url + '" data-url="' + photo.link + '" data-name="' + photo.user.full_name + '" id="p' + photo.id + '" title="' + photoCaption + ' (' + photo.likes.count + ' Likes)" data-created="' + photo.created_time + '" rel="group">';
						instagramPhoto +=    '<img src="' + photo.images.standard_resolution.url + '" width="100%">';
						instagramPhoto += '</a>';
					}
					
					$(instagramPhoto).appendTo(ibObj);
				
				} else {
					
					// Date Conversion
					var obDate = parseInt(photo.created_time);
					obDate = new Date( obDate * 1000 );
					obDate = dateFormat(obDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
					
					instagramPhoto = '<li class="instagram-track '+ photo.type +'" data-poster="'+ photo.images.low_resolution.url +'" data-video ="' + videoURL + '">';
					instagramPhoto += '	<img src="'+ photo.images.low_resolution.url +'" />';
					instagramPhoto += '	<div class="content">';
					instagramPhoto += '		<h4>'+ photo.user.full_name +'</h4>';
					instagramPhoto += '		<em>'+ obDate +'</em>';
					instagramPhoto += '		<p>'+ (photoCaption).substring(0,196) +'</p>';
					instagramPhoto += '	</div>';
					instagramPhoto += '	<div class="clear"></div>';
					instagramPhoto += '</li>';
				}
				
	            $(instagramPhoto).appendTo(ibObj.find('.video-nav ul'));
            }

			// Media Type
			if( settings.mediaType == 'video' || settings.galleryMode == 'list' ){
				$(".instagram-photo.image").remove();
				$(".instagram-track.image").remove();
			}

			// Count photos
			var photoCount = $('.instagram-photo').size() - 1;

			if( addingToList == false ){
				$('.instagram-photo').hide();
			}

			$('.instagram-photo').each(function(index){

				// Store Current Photo
				currentPhoto = $(this);

				// Render Effect
				currentPhoto.delay( settings.delayInterval * index ).fadeIn(settings.speed);

				// Clear Any Existing Load More Buttons
				$("#seachInstagramLoadMoreContainer").remove();

				// Load More Logic
				if( index == photoCount && instagramBrowserNextMax != "Empty" ){
					// Load More Button
					$('<div id="seachInstagramLoadMoreContainer"><a class="seachInstagramLoadMore btn btn-inverse">Load More</a></div>').appendTo(ibObj);
				}

				if( loadMoreBool == "off" ){
					// Clear Any Existing Load More Buttons
					$("#seachInstagramLoadMoreContainer").remove();
				}

			});
			
			displayGalleryByType(settings);
			
        } else {
            alert('empty');
        }

    } else {
        alert(data.meta.error_message);
    }
}

function displayGalleryByType(settings){
	
	/*  
   	Gallery Mode - Thumbnail
	------------------------------*/
	if( settings.galleryMode == "thumbnail" ){		
		$(ibObj).show();
		
		startFancybox();
		startVideoPlayer(settings);
	}
	
	/*  
   	Gallery Mode - List
	------------------------------*/
	if( settings.galleryMode == "list" ){						
		$(ibObj).show().addClass("instagram-playlist");
		$(ibObj).append('<div class="clear"></div>');	
			
		$("#seachInstagramLoadMoreContainer").remove();
		
		createVideo();
		startVideoPlayer(settings);
		startFancybox();
	}
}

function startFancybox(){
	$(ibObj).find("a.instagram-photo").fancybox({
		'arrows' : true,
		helpers : {
			title: {
		        	type: 'inside'
		        }
		    }
	});
}

function createVideo(track){
	
	var videoPoster = $('.instagram-playlist .video-nav li').eq(0).attr('data-poster');
	var videoURL = $('.instagram-playlist .video-nav li').eq(0).attr('data-video');
	
	if( track ){
		videoPoster = track.attr('data-poster');
		videoURL = track.attr('data-video');
		
		// alert(videoPoster + ' --- ' + videoURL);
	}
	
	var videoHTML = '';
	videoHTML += '<video width="480" height="480" poster="'+ videoPoster +'" tabindex="0">';
	videoHTML += '    <source src="'+ videoURL +'"></source>';
	videoHTML += '</video>';
	
	$('.instagram-photo.video').html("").append(videoHTML);
}

function startVideoPlayer(settings){
	
	// Controls
	var ivfeatures = ['playpause','progress','volume','fullscreen'];
	
	if( settings.showControls == false ){
		ivfeatures = [''];
	}
	
	$('.instagram-photo video').mediaelementplayer({
		alwaysShowControls: false,
		videoVolume: 'horizontal',
		features: ivfeatures
	});
	
	// Remove Controls Bar
	if( settings.showControls == false ){
		$(".mejs-controls").remove();
	}
}

$.fn.instagramVideo = function ( options ) {
	
	/* Setting Up Variables
	------------------------------*/
	var settings = {
		mode : 'popular', // This sets the mode to either "user","popular","tag","multiuser", "liked". Default is set to popular
		accessToken : 'XX-XX-XXXX', // This a mandatory setting that allows you to specify a user token.
		userID : '1138644', // This is a setting that you have to use if your using "user" mode. Default is "For stunning photography – Kevin Burg".
		speed: 700, // Sets the speed of the images fade in effect, default is 700.
		delayInterval : 80, // Sets the interval of the delay between photos appearing, default is 80.
		tag: 'sports',
		galleryMode: 'thumbnail', // thumbnail, list
		mediaType: 'video', // video, all
		showControls: true, // true, false
	};
	
	ibObj = $(this);
	
	// Combine your options with our settings...
	$.extend(settings, options);
	
	/* Plugin Logic
	------------------------------*/
	return this.each(function() {

		// Powers Activate...
		$(document).ready(function(){
			
			// Add Needed DOM
			if( settings.galleryMode == 'list' ){
				var playerHTML = '';
				playerHTML += '<div class="instagram-photo video"></div>';

				playerHTML += '<div class="video-nav">';
				playerHTML += '    <ul></ul>';
				playerHTML += '	   <div class="controls">';
				playerHTML += '		  <span class="arrow-up"></span>';
				playerHTML += '		  <span class="arrow-down"></span>';
				playerHTML += '	   </div>';
				playerHTML += '</div>';
				
				$(ibObj).append(playerHTML);
			}
			
			instagramFetch(settings);
			
			// Events
			$(document).on("click", ".seachInstagramLoadMore", function(){
								
				if( settings.mode == 'tag' ){
					instagramTagsLoadMore(settings);
					
				} else if( settings.mode == 'user' ){					
					instagramUsersLoadMore(settings);
				}
			});
			
			$("#searchByTag .submit").click(function(){
				// Clear UI & Search
				ibObj.html("");
				
				var customSettings = settings;
				customSettings.mode = 'tag';
				customSettings.tag = $("input.searchTag").val().replace(/ /g,'');
				
				if( customSettings.tag == "" ){
					alert("Please enter a valid hashtag.");
					return false;
				}
				
				instagramFetch(customSettings);
				return false;
			});
			
			$("#searchByUser .submit").click(function(){				
				// Clear UI & Search
				ibObj.html("");
				
				var customSettings = settings;
				customSettings.mode = 'user';
				customSettings.user = $("input.searchUser").val().replace(/ /g,'');
				
				if( customSettings.user == "" ){
					alert("Please enter a valid username.");
					return false;
				}
				
				instagramUserSearch(customSettings);
				return false;
			});
			
			$(document).on("click", ".instagram-user-all", function(){
				// Clear UI
				ibObj.html("");

				var customSettings = settings;
				customSettings.mode = 'user';
				customSettings.userID = $(this).attr("rel");

				instagramFetch(customSettings);
			});
			
			
			/* Playlist Logic
			--------------------------*/
			$(document).on("click", ".video-nav .arrow-down", function(){
				$('.video-nav ul').stop().animate({
				   scrollTop: '+=200'
				}, 500);
			});

			$(document).on("click", ".video-nav .arrow-up", function(){
				$('.video-nav ul').stop().animate({
				   scrollTop: '-=200'
				}, 500);
			});
			
			$(document).on("click", ".instagram-track.video", function(){
				createVideo($(this));
				startVideoPlayer(settings);
			});
			
		});

	});
}