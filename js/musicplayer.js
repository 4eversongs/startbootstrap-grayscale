// ONLY WORKS ON BROWSERS THAT SUPPORT MP3 //
$(function () {
    var play = $('#play'),
		pause = $('#pause'),
    	stop = $('#stop'),
		mute = $('#mute'),
		muted = $('#muted'),
		song = new Audio('http://robbbenson.com/01%20Eve.mp3'),
		duration = song.duration;

	song.type= 'audio/mpeg';
	song.src= 'http://robbbenson.com/01%20Eve.mp3';

    stop.on('click', function(e) {
    	e.preventDefault();
        $(this).addClass('hide');
        $('#play').removeClass('hide').trigger('click');        
    })

	play.on('click', function(e) {
		e.preventDefault();
        if (!$(this).hasClass('active')){
    		song.play();
            $('.active').removeClass('active');
    		$(this).addClass('active');
        }else{
            song.pause();
            $('.active').removeClass('active');
            var curtime = song.currentTime / song.duration * 100;
            $('.progress-radial').removeClass('progress-'+parseInt(curtime));
    	    song.currentTime = 0;            
            $(this).addClass('hide');
            stop.removeClass('hide').addClass('active');
        }
	});

	pause.on('click', function(e) {
		e.preventDefault();
		song.pause();
		$('.active').removeClass('active');
		$(this).addClass('active');
	});

	mute.on('click', function(e) {
		e.preventDefault();
		song.volume = 0;
		$(this).addClass('hide');
		$('#muted').removeClass('hide');
	});

	muted.on('click', function(e) {
		e.preventDefault();
		song.volume = 1;
		$(this).addClass('hide');
		$('#mute').removeClass('hide');
	});

	song.addEventListener('timeupdate', function (){
		var curtime = song.currentTime / song.duration * 100;
		$('.progress-radial').addClass('progress-'+parseInt(curtime));
		$('.progress-radial').removeClass('progress-'+parseInt(curtime-1));
	});	
});
