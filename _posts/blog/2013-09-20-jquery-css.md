---
layout: post
title: jQuery 源代码分析之css.js
description: jQuery源代码的css.js文件的分析，包括用法和源代码分析
category: blog
---

css.js中一共包括四个方法：css、show、hide、toggle。下面一一介绍用法和源代码的分析了。

## css()

### 用法

jQuery中的css()方法一共有五种用法，可以获取和设置匹配元素的css属性。css()方法是通过window.getComputedStyle(elem, null)的方式去获取元素的属性值（因为IE9及以上才支持getComputedStyle方法，所以貌似jQuery貌似在IE8及以下无法获取到CSS属性的值？），而通过elem.style的方式去设置css属性值。

1. css( propertyName )

这种用法是获取CSS属性为propertyName的属性值，用法如下：

	div {
		width: 60px;
		height: 60px;
		float: left;
		margin: 5px;
	}

	<div style="background-color:blue;"></div>
	<div style="background-color:rgb(15,99,30);"></div>
	<div style="background-color:#123456;"></div>
	<div style="background-color:#f11;"></div>
	<span id="result"></span>

	$("div").click(function() {
		var color = $(this).css("background-color");
		$("#result").html("That div is <span style='color:" +
		color + ";'>" + color + "</span>." );
	});
	
2. css( propertyNames )

这种用法是向参数中传入一个propertyNames的属性数组，然后函数返回一个关联数组。

还是上面的HTML、CSS代码，通过传入一个数组获取多个属性值：

	$("div").click(function() {
		var props = $(this).css(["width", "height", "background-color"]);
		var html = [ "The clicked div has the following styles:" ];
		$.each(props, function(prop, value) {
			html.push(prop + ": " + value);
		});
		$("#result").html(html.join("<br>"));
	});
	
3. css( propertyName, value )

这种用法是设置CSS属性propertyName的值为value，HTML代码同上：

	$("div").click(function() {
		$(this).css("background-color", "black");
	});
	
4. css( propertyName, function(index, value) )

这种用法是通过函数的返回值设置属性propertyName的值，index为匹配元素的索引，value为旧的属性值：

	$("div").click(function() {
		$(this).css("background-color", function(index, value) {
			return "red";
		});
	});
	
5. css( properties )

这种用法是通过传入一个对象直接量的属性和属性值的名值对去设置多个属性：

	$("div").click(function() {
		$(this).css({
			"width": "100px",
			"height": "100px",
			"background-color": "yellow"
		});
	});
	
### 源代码分析

首先找到css()方法所在的源代码：

	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			// 匹配第二种情况css(propertyNames)
			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			// value !== undefined说明是set value，否则是get value
			// set value是通过elem.style的方式
			// get value是通过getComputedStyle()的方式
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
	
css()方法也是通过jQuery.access()的方式去修正参数，然后再执行function，这个已经在[jQuery 源代码分析之attribute.js](http://cookfront.github.io/jquery-attribute/)分析过，然后是里面的一个函数，首先匹配第二种用法，然后判断value是否为undefined，为undefined则是通过jQuery.css()获取属性值，而不为undefined则是通过jQuery.style()设置属性值。下面看看jQuery.css()的源代码：

	// 通过getComputedStyle的方式获取elem的CSS属性name的值
	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		// 修正name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		// 得到钩子
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		// 如果钩子中存在get,则通过钩子获取值后赋给val
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		// get value
		// val === undefined时，说明没有钩子，则通过curCSS获取属性值
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// convert "normal" to computed value
		// 将val === normal且在cssNormalTransform中的属性转换成指定的值
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
	
注释中也解释的非常清楚了，然后再看看jQuery.style()方法的源代码：

	// Get and set the style property on a DOM Node
	// 设置或获取样式属性
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		// 判断元素节点类型是否符合，且是否存在elem.style
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		// 规范化name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		// 设置样式 value !== undefined
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			// $( this ).css( "width", "+=200" );
			// ret[1]要么为+要么为-,ret[1] + 1 等于+1 或者 -1
			// 这里必须通过jQuery.css(elem, name)的方式去获取以前的属性值，
			// 因为jQuery.style是通过elem.style的方式去设置和获取属性值，elem.style中不一定有某属性值
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			// 确保不会设置null和NaN
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			// 如果type是number，则默认加上px
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			// 如果钩子存在则通过钩子设置值，否则通过style[name] = value的方式
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			// 如果钩子存在则通过钩子获取值
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			// 其他情况下直接return style[name]
			return style[ name ];
		}
	}
	
这也差不多是css()方法的全部过程了，还有cssHooks、cssProps规范化属性和兼容性问题的。

## show()/hide()/toggle()

show()/hide()/toggle()的用法也没啥说的了，就是显示或隐藏元素的，那源代码呢？源代码就是通过下面的一个函数实现的：

	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		// 遍历所有的元素
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			// elem.style不存在则跳过
			if ( !elem.style ) {
				continue;
			}

			// 获取当前元素的olddisplay数据的值
			values[ index ] = data_priv.get( elem, "olddisplay" );
			// 获取当前元素的display属性的值
			display = elem.style.display;
			// 如果要显示的话
			if ( show ) {
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				// 通过将display设置成""，来判断""元素是否会显示
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				// 如果display被设成了""，并且元素隐藏了，则通过css_defaultDisplay设置默认显示方法
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
				}
			} else {

				if ( !values[ index ] ) {
					hidden = isHidden( elem );

					if ( display && display !== "none" || !hidden ) {
						data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
					}
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			// show为true，则显示，否则隐藏
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}

		return elements;
	}
	
然后show()/hide()/toggle()方法的源代码如下：

	// 显示匹配元素
	show: function() {
		return showHide( this, true );
	},
	// 隐藏匹配元素
	hide: function() {
		return showHide( this );
	},
	// 显示或隐藏匹配元素
	// 如果state为true,则显示元素，否则隐藏元素
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
