(function($) {

	if($.fn.iTip) {
		return;
	}

	$.fn.iTip = function(param) {
		var defaults = {};

		var opts = $.extend(defaults, param);

		this.each(function() {

		});

		return this;
	}
}(jQeury));

;
(function($, win) {

	if($.iDialog) {
		return;
	}

	var $win = $(win);

	$.iDialog = function(settings) {

		var html = ['<div class="i-dialog">', '<div class="i-dialog-title clearfix">', '<span>{%title%}</span><div class="i-dialog-close"></div>', '</div>', '<div class="i-dialog-content">{%content%}</div>', '</div>'].join('');

		var defaults = {
			'title': '标题',
			'content': '内容',
			'mask':true,
			'drag': false
		}

		var opts = $.extend(defaults, settings);

		var $this = $(html).attr('style', 'background:#fff;border:2px solid #ccc;position:fixed;width:200px;height100px;z-index:999999');

		$this.content = function(html) {
			$this.find('.i-dialog-content').html(html);
			return this;
		}

		$this.align = function() {

			var viewport_h = $win.height(),
				viewport_w = $win.width();

			var width = $this.width(),
				height = $this.height();

			this.css({
				'left': (viewport_w - width) / 2,
				'top': (viewport_h - height) / 2
			});

			return this;
		}

		$this.colse = function() {
			$this.
		}

		$this.find('.i-dialog-close').bind('click', function() {
			$this.hide();
		});

		$win.bind('resize', function() {
			if($this.is(':visable')) {
				$this.align();
			}
		});

		$('body').prepend($this);

		return $this;
	}


}(jQuery, window));