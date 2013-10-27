/**
 * $.cooktip
 * @extends jquery.2.0.1
 * @fileOverview 创建文字提示框
 * @author barretlee
 * @email barretlee@gmail.com
 * @site http://barretlee.github.io
 * @version 0.1
 * @date 2013-07-14
 * Copyright (c) 2013-2013 
 */
 (function($) {

 	$.fn.cooktip = function(options) {	

 		var options = options || {};
 		var opts = $.extend(true, {}, $.fn.cooktip.defaults, options);
 		return $(this).each(function() {

 			var cooktip = new CookTip(opts);
 			cooktip.tipBefore = $(this);
 			$(this).parent().append(cooktip.create());
 			cooktip.render();
 		});
 	};

 	$.fn.cooktip.defaults = {
 		position: 'right',
 		title: '',
 		content: '',
 		hideDelay: 500,
 		showDelay: 500,
 		showEvent: 'mouseover',
 		hideEvent: 'mouseout',
 		tipBefore: null,
 		tipContainer: '.cooktip',
 		trigonHeight: '11',
 		template: '<div class="cooktip"><div class="arrow"></div><h3 class="cooktip-title"></h3><div class="cooktip-content"></div>'
 	};

 	function CookTip(options) {
 		this.options   = options;
 		this.content = options.content;
 		this.title = options.title;
 		this.template = options.template;
 		this.delay = options.delay;
 		this.classes = options.classes;
 		this.position = options.position;
 		this.tipContainer = options.tipContainer;
 		this.tipBefore = options.tipBefore;
 		this.trigonHeight = options.trigonHeight;
 	}
 	CookTip.prototype = {
 		render: function() {
 			this.setContent(this.content);
 			this.setTitle(this.title);
 			this.setPosition(this.position);
 			this.bindShowHideEvent();
 		},
 		create: function() {
 			return $(this.template);
 		},
 		setContent: function(content) {
 			var content = content ? content : $(this.tipBefore).attr("data-content");
 			$(".cooktip-content", $(this.tipContainer)).html(content);
 		},
 		setTitle: function(title) {
 			var title = title ? title : $(this.tipBefore).attr("data-original-title");
 			$(".cooktip-title", $(this.tipContainer)).html(title);
 		},
 		setPosition: function(position) {
 			var _l = $(this.tipBefore).offset().left,
 				_t = $(this.tipBefore).offset().top,
 				_aw = $(this.tipBefore).outerWidth(true),
 				_ah = $(this.tipBefore).outerHeight(true),
 				_tw = $(this.tipContainer).outerWidth(true),
 				_th = $(this.tipContainer).outerHeight(true),
 				trigonHeight = this.trigonHeight;
 			switch(position) {
 				case "top":
 					_pos = {"left":_l+Math.floor(_aw/2)-Math.floor(_tw/2),"top":_t - _th};
 					break;
 				case "bottom":
 					_pos = {"left":_l+Math.floor(_aw/2)-Math.floor(_tw/2),"top":_t+_ah};
 					break;
 				case "left":
 					_pos = {"left":_l-_tw,"top":_t+Math.floor(_ah/2)-Math.floor(_th/2)};
 					break;
 				case "right":
 					_pos = {"left":_l+_aw,"top":_t+Math.floor(_ah/2)-Math.floor(_th/2)};
 					break;

 			}
 			$(this.tipContainer).addClass(this.position).css(_pos);
 		},
 		bindShowHideEvent: function() {
 			var self = this;
 			var showEvent = this.options.showEvent;
 			var hideEvent = this.options.hideEvent;
 			if (showEvent != null) {
 				this.tipBefore.bind(showEvent, function() {
	 				$(self.tipContainer).fadeIn(self.showDelay);
	 			});
 			}
 			if (hideEvent != null) {
 				this.tipBefore.bind(hideEvent, function() {
	 				$(self.tipContainer).fadeOut(self.hideDelay);
	 			});
 			}
 		}
 	};
 })(jQuery);