;(function($){

	var list = [
		{'title' : '爱情0' , 'src' : 'test0.mp3' },
		{'title' : '爱情1' , 'src' : 'test1.mp3' },
		{'title' : '爱情2' , 'src' : 'test2.mp3' },
	];

	if($.iplayer){
		return;
	}

	$.iplayer = function(setting){
		var $iplayer = null;
		var $list = [];

		var tmpl = [
			'<div class="jquery-player">',
				'<audio></audio>',
				'<div class="jquery-player-play jquery-player-btn">play</div>',
				'<div class="jquery-player-pause jquery-player-btn">pause</div>',
				'<div class="jquery-player-timer">',
					'<div class="jquery-current-timer"></div>',
				'</div>',
			'</div>'
		].join('');



	}

	if($.fn.iplayer){
		return;
	}

	$.fn.iplayer = function(settings){

		var $this = $(this);
		var defaults = {
			'list' : []
		};

		var opts = $.extend({},defaults,settings);


		var tmpl = [
				'<div class="jquery-player-controls">',
					'<div class="jquery-player-play jquery-player-btn" title="播放">play</div>',
					'<div class="jquery-player-pause jquery-player-btn" title="暂停">pause</div>',
					'<div class="jquery-player-title"></div>',
					'<div class="jquery-player-timer">',
						'<div class="jquery-current-timer"></div>',
					'</div>',
				'</div>',
				'<audio></audio>',
		].join('');


		$this.each(function(){

			$(this).addClass('jquery-player').prepend(tmpl)

			var media = $('audio,video',this).get(0);
			var $play = $('.jquery-player-play',this),
				$pause = $('.jquery-player-pause',this),
				$title = $('.jquery-player-title',this);

			if(settings.list && settings.list.length){
				media.src = opts.list[0].url;
				$title.html(opts.list[0].title + ' - ' + opts.list[0].singer );
			}

			if(!media.src){
				return;
			}

			$play.bind('click',function(){
				media.play();
				media.volume = 0.3;
				timer();
			});

			$pause.bind('click',function(){
				media.pause();
			});

			var width = $('.jquery-player-timer').width();
			var $cur = $('.jquery-current-timer',this);


			function timer(){

				timer.id = setInterval(function(){
					if(media.pasued){
						clearInterval(timer.id);
					}
					var cur =  (media.currentTime / media.duration * width);
					$cur.css('width',cur);
				},200);

			}
		

		});

		return $this;
	}

	$('.audio-tag').iplayer({ 
		'list': [{ 'title': '爱情' , 'singer' : '田馥甄' , 'url': 'test.mp3' }]
	});

	$('.jquery-player-title').bind('mouseover',function(){
		$(this).icard();
	})

}(jQuery));