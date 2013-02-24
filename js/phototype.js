/*
   图片轮播 1.1a:

   Phototype.news({
   'id' 		:	'mask',   	| 容器id 
   'pattern'	:	'left' 		| 轮换模式 :  left  ||  up  || fade
   'interval' 	: 	5,     		| 轮播时间间隔（秒）
   'duration' 	: 	35,      	| 运动切换时长 
   'loop'		: 	true		| 是否循环运动  
   });

   缓动算法：Tween
t : 初始时间
b : 初始位置
c : 位置变化量
d : 持续时间
var t = 0 , b = 0 , c = 10 , d = 20
Tween.Quad.easeInOut(t,b,c,d)
 */

var Phototype = (function() {
	var win = window,
		doc = document,
		$id = function(id) {
			return doc.getElementById(id) || false;
		},
		Tween = {
			Quad: {
				easeInOut: function(t, b, c, d) {
					if((t /= d / 2) < 1) return c / 2 * t * t + b;
					return -c / 2 * ((--t) * (t - 2) - 1) + b;
				}
			}
		};

	var EventUtil = {
		addEvent: function(o, type, fn) {
			if (o.addEventListener) {
				o.addEventListener(type, fn, false);
			} else if (o.attachEvent) {
				o.attachEvent("on" + type, fn);
			} else {
				o["on" + type] = fn;
			}
		},
		removeEvent: function(o, type, fn) {
			if (o.removeEventListener) {
				o.removeEventListener(type, fn, false);
			} else if (o.detachEvent) {
				o.detachEvent("on" + type, fn);
			} else {
				o["on" + type] = null;
			}
		},
		// 获取 event 对象
		getEvent: function(event) {
			return event ? event : window.event;
		},

		// 获取 event 当前目标元素
		getTarget: function(event) {
			event = this.getEvent(event);
			return event.target || event.srcElement;
		},

		// 阻止元素默认行为
		preventDefault: function(event) {
			event = this.getEvent(event);
			if (event.preventDefault) {
				event.preventDefault();
			}
			else {
				event.returnValue = false;
			}
		},

		// 阻止事件冒泡
		stopPropagation: function(event) {
			event = this.getEvent(event);
			if (event.stopPropagation) {
				event.stopPropagation()
			}
			else {
				event.cancelBubble = true;
			}
		}
	};

	function getPosition(o) {

		var offset = {
			'left': o.offsetLeft,
			'top': o.offsetTop
		};
		cur = o.offsetParent;

		while(cur !== null) {
			offset.left += cur.offsetLeft;
			offset.top += cur.offsetTop;
			cur = cur.offsetParent;
		};

		return offset;
	};

	var news = function(param) {
			this.o = $id(param.id);
			if(!this.o) return false;
			this.container = this.o.getElementsByTagName('ul');
			if(this.container.length == 0) return false;
			this.container = this.container[0];
			this.list = this.container.getElementsByTagName('li');
			if(this.list.length <= 1) return false;
			this.menu = this.o.getElementsByTagName('ul')[1] || false;
			this.istouch = false;

			this.titles = $id(param.title);
			this.close = $id(param.close);
			this.prvebtn = $id(param.prve);
			this.nextbtn = $id(param.next);
			this.p = getPosition(this.container);
			this.pos = {
				'x': 0,
				'y': 0
			};
			this.offset = {
				'width': this.list[0].clientWidth,
				'height': this.list[0].clientHeight
			};

			this.os = this.container.style;
			this.num = 0;
			this.len = this.list.length;
			this.timer = null;

			this.type = param.type || 'mouseover';
			this.pattern = param.pattern || 'up';
			this.interval = param.interval || 10;
			this.duration = param.duration || 35;
			this.loop = param.loop || false;

			this.o.style.position = 'relative';
			this.o.style.overflow = 'hidden';
			this.container.style.position = 'absolute';
			try {
				this.init();
			} catch(ex) {}


		}
	news.prototype = {
		init: function() {
			var self = this,
				o = self.o,
				addEvent = EventUtil.addEvent;

			if(self.pattern == 'left') {
				self.os.width = self.offset.width * self.len + 'px';
				for(var i = 0, len = self.list.length; i < len; i++) {
					self.list[i].style.width = self.offset.width + 'px';
				}
				addEvent(o, 'touchstart', function(event) {
					self.pause();
					self.touch(event);
				});
				addEvent(o, 'touchmove', function(event) {

					self.touch(event);
				});
				addEvent(o, 'touchend', function(event) {
					self.touch(event);
					self.auto();
				});
			}
			if(self.menu) {
				this.mlist = this.menu.getElementsByTagName('li');
				self.setCurrent(0);
				for(var i = 0; i < this.list.length; i++) {
					(function(temp) {
						addEvent(self.menu.getElementsByTagName('li')[i], self.type, function(e) {
							if(temp != self.num) self.play(temp);
						});
					})(i);
				}
			}

			addEvent(o, 'mouseover', function(e) {
				self.pause();
			});
			addEvent(o, 'mouseout', function(e) {
				self.auto();
			});
			addEvent(self.prvebtn, 'click', function(e) {
				self.prve();
			});
			addEvent(self.nextbtn, 'click', function(e) {
				self.next();
			});
			addEvent(self.close, 'click', function(e) {
				self.exit();
			});

			if(self.pattern == 'fade') this.setZindex(0, 0);
			if(self.len < 2) return;
			this.auto();

		},
		touch: function(event) {
			var self = this,
				l, w;
			switch(event.type) {
			case 'touchstart':
				self.istouch = true;
				self.startX = event.touches[0].pageX - self.p.left;
				self.cx = self.container.offsetLeft;
				break;
			case 'touchmove':
				if(self.touch) {
					w = -(self.offset.width * (self.len - 1)), l = self.container.style.left;
					self.pos.x = event.touches[0].pageX - self.p.left - self.startX + self.cx;
					self.os.left = self.pos.x + 'px';
					self.titles.innerHTML = self.pos.x
				}
				event.preventDefault();
				break;
			case 'touchend':
				self.istouch = false;
				self.num = -Math.round((self.pos.x / self.offset.width));
				if(self.num < 0) self.num = 0;
				if(self.num >= self.len) self.num = self.len - 1;
				self.play(self.num);
				event.preventDefault();
				break;
			default:
			}
		},
		play: function(index) {
			var self = this,
				list = this.container.getElementsByTagName('li');
			clearTimeout(this.timer);

			if(this.loop) {
				this.targetNum = {
					'x': -this.offset.width,
					'y': -this.offset.height
				};
			} else {
				this.targetNum = {
					'x': -this.offset.width * index - this.pos.x,
					'y': -this.offset.height * index - this.pos.y
				};
			}

			switch(this.pattern) {
			case 'up':
				this.os.width = this.offset.width + 'px';
				this.tween = {
					t: 0,
					b: this.pos.y,
					c: this.targetNum.y,
					d: this.duration
				};
				this.move(this.os, this.tween.t, this.tween.b, this.tween.c, this.tween.d);
				break;
			case 'left':
				this.os.width = this.offset.width * this.len + 'px';
				this.tween = {
					t: 0,
					b: this.pos.x,
					c: this.targetNum.x,
					d: this.duration
				};
				this.move(this.os, this.tween.t, this.tween.b, this.tween.c, this.tween.d);
				break;
			case 'fade':
				this.setZindex(index, self.num);
				this.os.width = this.offset.width + 'px';
				this.move(list[this.num].style, 0, 100, -100, 30);
				break;
			default:
			}
			if(this.menu) this.setCurrent(index);
			this.num = index;

		},
		setZindex: function(index, cur) {
			var self = this,
				list = null;
			if(index == cur) return false;
			list = this.container.getElementsByTagName('li');
			for(var i = 0, len = list.length; i < len; i++) {
				list[i].style.zIndex = len - i;
				self.setOpacity(list[i].style, 100);
				list[i].style.position = 'absolute';
			};
			list[cur].style.zIndex = 199;
			list[index].style.zIndex = 100;

		},
		setCurrent: function(index) {
			var self = this,
				tit = null,
				cur = this.mlist[index].getElementsByTagName('a')[0];

			if(this.titles) {
				tit = self.titles.getElementsByTagName('a')[0] || false;
				tit.innerHTML = cur.getAttribute('tit') + '';
				tit.href = cur.href;
			}
			for(var i = 0, len = this.mlist.length; i < len; i++) {
				this.mlist[i].className = '';
			}
			this.mlist[index].className = 'Cur';

		},
		setOpacity: function(o, value) {
			if(document.all) {
				o.filter = 'alpha(opacity = ' + value + ')';
			} else {
				o.opacity = value / 100;
			}
		},
		move: function(o, t, b, c, d) {
			var self = this,
				fo = this.container.getElementsByTagName('li')[0],
				co = fo.cloneNode(true);
			switch(this.pattern) {
			case 'up':
				this.pos.y = Math.ceil(Tween.Quad.easeInOut(t, b, c, d));
				o.top = this.pos.y + 'px';
				break;
			case 'left':
				this.pos.x = Math.ceil(Tween.Quad.easeInOut(t, b, c, d));
				o.left = this.pos.x + 'px';
				break;
			case 'fade':
				this.opa = Math.ceil(Tween.Quad.easeInOut(t, b, c, d));
				this.setOpacity(o, this.opa)
				break;
			default:
			}

			if(t < d) {
				this.timer = setTimeout(function() {
					t++;
					self.move(o, t, b, c, d);
				}, 10);
			} else {
				clearTimeout(this.timer);
				if(this.loop == true) {
					this.container.removeChild(fo);
					this.container.appendChild(co);
					this.pos.y = 0;
					this.pos.x = 0;
					o.top = this.pos.y + 'px';
					o.left = this.pos.x + 'px';
				}
			}
		},
		exit: function() {
			var self = this;
			clearInterval(self.timer);
			self.timer = null;
			self.o.style.display = 'none';
		},
		prve: function() {
			var self = this,
				index = self.num;
			(index > 0) ? (--index) : (index = self.len - 1);
			self.play(index);
		},
		next: function() {
			var self = this,
				index = self.num;
			(index < self.len - 1) ? (++index) : (index = 0);
			self.play(index);
		},
		pause: function() {
			clearInterval(this.timers);
		},
		auto: function() {
			var self = this,
				index = self.num;
			this.timers = setInterval(function() {
				(index == self.len - 1) ? (index = 0) : (index++);
				self.play(index);
			}, this.interval * 1000);
		}
	}
	return {
		news: function(param) {
			return new news(param);
		}
	}
})();
