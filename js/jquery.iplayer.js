/* $.fn.alignCenter */
;(function($,log){

	if($.fn.fixedCenter){
		return;
	}


	var $win = $(window)
	var MathRound = Math.round;

	$.fn.fixedCenter = function(){
		if($(this).length ==0) return;

		var $this = $(this);
		
		var viewport_width = $win.width(),
			viewport_height = $win.height();

		$this.each(function(){

			var $this = $(this).css({'position':'fixed'});

			var width = $this.width(),
				height = $this.height();

			var offset = {
				'left' : MathRound((viewport_width - width)/2),
				'top' : MathRound((viewport_height - height)/2)
			};
				
			$this.css(offset);

		});

		return $this;

	}

}(jQuery,function(msg){window.console && window.console.log(msg)}));

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
				'<div class="jquery-player-controls ',opts['class'],'">',
					'<div class="jquery-player-play jquery-player-btn">play</div>',
					'<div class="jquery-player-pause jquery-player-btn">pause</div>',
					'<div class="jquery-player-title"></div>',
					'<div class="jquery-player-timer">',
						'<div class="jquery-current-timer"></div>',
						'<div class="jquery-progress-timer"></div>',
					'</div>',
				'</div>',
				'<audio></audio>',
		].join('');


		$this.each(function(){

			$(this).prepend(tmpl)

			var $media = $('audio,video',this),
				media =$media.get(0);
			var $play = $('.jquery-player-play',this),
				$pause = $('.jquery-player-pause',this),
				$title = $('.jquery-player-title',this);

			if(settings.list && settings.list.length){
				media.src = opts.list[0].url;
				$title.text(opts.list[0].title + ' - ' + opts.list[0].singer);
			}

			if(!media.src){
				return;
			}

			$media
				.bind('canplay',function(){
					console.log('canplay event')
				})
				.bind('loadeddata',function(){
					console.log('load')
				})
				.bind('durationchange',function(){
					console.log('durationchange');
				})
				.bind('progpress',function(){
					console.log('progpress')
				})

			media.addEventListener('timeupdate', function(){
				timer()
			}, false);

			media.addEventListener('progress', function(){
				progress();
			}, false);

			function addEvents(target, type, fn){
				target.addEventListener(type,fn,false);
			}
			
			$play.bind('click',function(){
				media.play();
			});

			$pause.bind('click',function(){
				media.pause();
			});

			var timerbar_width = $('.jquery-player-timer').width();
			var $timerbar = $('.jquery-current-timer',this);
			var $progress = $('.jquery-progress-timer',this);

			function timer(){
				var precent =  ((media.currentTime / media.duration) * 100) + '%';
				$timerbar.css('width',precent);
			}

			function progress(){
				var precent = media.buffered && ((media.buffered.end(0) / media.duration) * 100) + '%';
				$progress.css('width',precent);
			}
		

		});

		return $this;
	}
}(jQuery));


