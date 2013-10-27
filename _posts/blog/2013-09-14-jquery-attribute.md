---
layout: post
title: jQuery 源代码分析之attribute.js
description: jQuery源代码的attribute.js文件的分析，包括用法和源代码分析
category: blog
---

attribute.js文件中包括了attr、removeAttr、prop、removeProp、addClass、removeClass、toggleClass、hasClass、val的用法，下面一个个分析这些方法的用法和源代码：

## attr

### 用法：

1.attr(attributeName)

这种用法是用于获取元素的attributeName特性，例如：

	<div id="test"></div>

	console.log($("#test").attr("id"));
	
2.attr(attributeName, value)

这种用法是用于设置元素的attributeName为value，例如：

	<div id="test"></div>

	$("#test").attr("class", "classtest");
	
3.attr(attributes)

这种用法是传入一个对象直接量，设置多个特性值，例如：

	<div id="test"></div>

	$("#test").attr({
		class: "classtest",
		data: "other"
	});
	
4.attr(attributeName, function(index, attr))

这种用法是通过函数设置attributeName特性为函数的返回值，function参数中的index为元素索引，attr为name为attr的旧特性，例如：

	<div id="test"></div>

	$("#test").attr("id", function(index, value) {
		return value + index;
	});
	
### 源代码分析

首先找到attr源代码的位置，可以看到：

	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	}
	
那这个jQuery.access这个函数又是什么作用呢？先上源代码，然后再分析：

	// 作用：修正参数，并根据参数决定函数的执行方式，
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;		// key==null时为true

		// Sets many values
		// 传入的是object，一次设置多个属性
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		// value不为undefined情况表示是setter
		} else if ( value !== undefined ) {
			chainable = true;

			// value不为function时,raw为true
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {	// if (key == null)
				// Bulk operations run against the entire set
				// fn = jQuery.attr(elem, name, value)
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				// value为function的情况
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			// 如果fn存在就遍历elems
			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			// setAttr的情况
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				(length ? fn( elems[0], key ) : emptyGet);
	}
	
看完源代码应该大体知道干吗了。根据传入的参数不同，对参数进行修正后再调用fn，也就似乎jQuery.attr。那这个jQuery.attr又是啥样的呢？具体看下面啦：

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		// 当不存在elem或者节点为text、comment、attribute类型时，直接返回
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		// core_strundefined = typeof undefined
		// 如果不支持getAttribute则调用jQuery.prop
		// 具体有哪些元素不支持getAttribute呢？window?
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		// 如果elem不是元素结点，且不是xml文档
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		// set value
		if ( value !== undefined ) {

			// value为null，则移除name属性
			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			// 属性钩子、布尔钩子、表单钩子，如果有对应的钩子，则调用钩子的set方法
			// 判断钩子是否存在，则调用钩子设置value，
			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			// 否则直接setAttribute(name, value + "");
			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		// 如果value是undefined，说明是取属性值，如果对应的钩子的有get方法，则调用钩子的get方法
		// get value
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			// 不存在的属性返回null，格式化为undefined
			return ret == null ?
				undefined :
				ret;
		}
	}
	
上面有个attrHooks第一次看源代码的时候没看懂是干吗用的，这个应该是解决浏览器兼容性问题的：

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// 如果不支持radio，且elem为Input
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
	
当调用attr设置type的属性时，就会调用这个钩子函数去设置type的值。

## removeAttr

### 用法

removeAttr只有一种用法：removeAttr(attributeName)，这里的attributeName也可以为以空格分开的多个特性。例如：

	<div id="test"></div>

	$("#test").attr({
		class: "aaa",
		other: "bbb"
	}).removeAttr("class other");
	
### 源代码分析

首先定位到removeAttr代码的位置：

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
	
这个代码应该是很容易看懂的，通过调用jQuery.removeAttr方法移除匹配元素的name特性。那再看看jQuery.removeAttr：

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			// 匹配以空格分开的多个特性值
			attrNames = value && value.match( core_rnotwhite );

		// 只有特性值存在且nodeType为元素节点时，才能移除特性值
		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
	
## prop

### 用法

prop的用法和attr是一样的，也支持四种attr的四种用法，只是这个prop和attr有啥区别呢？前者是设置或获取元素的属性，而后者是设置或获取元素的特性。具体属性和特性的区别：[Attributes and custom properties](http://javascript.info/tutorial/attributes-and-custom-properties)

### 源代码分析

可以看到prop的源代码：

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	}
	
也是和attr一样，通过调用jQuery.access修正参数后再调用jQuery.prop，jQuery.prop也和attr差不多，需要判断nodeType，然后value !== undefined时为设置属性，value为undefined时则是获取元素的属性。当然还要通过钩子函数判断，解决浏览器兼容性问题，比如tabIndex获取的差异。源代码：

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		// set value
		// 首先判断钩子函数不为undefined时调用
		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		// get value
		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	}
	
## removeProp

### 用法

removeProp用法和removeAttr用法一样，支持移除多个属性，只要用空白分开就行。

### 源代码分析

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
	
removeProp就是通过delete移除匹配元素的属性，这也说明了属性和特性的一点区别，特性不能通过delete移除。

## addClass

### 用法

1.addClass(className)

className可以为以空格隔开的多个classes：

	<div id="test"></div>

	$("#test").addClass("something other");
	
2.addClass(function(index, currentClass))

这种用法是设置函数的返回值为添加的classes，index为元素索引，currentClass为元素当前的类名：

	<div id="test">
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
			<li>4</li>
			<li>5</li>
		</ul>
	</div>

	$("#test li").addClass(function(index, currentClass) {
		return "li-" + index;
	});
	
### 源代码分析

	// addClass原理：
	// len存储需要添加class的元素的个数
	// proceed为判断value是否为string且value存在，如果不存在，直接return
	// classes通过正则表达式把将value中的以空格分开的多个类分割成数组
	// 然后通过while一个一个加入到元素中，需要先判断在类中是否已经存在类
	// 最后清楚className两边的空白
	// 1.addClass(className)
	// 2.addClass(funciton(index, currentClass))
	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		// 如果value是函数的话，则是第二种使用方法
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		// 第一种使用方法
		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			// 将value中的以空格分开的多个类分割成数组
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// 当前为元素节点
				// rclass = /[\t\r\n\f]/g 将className中的\t\r\n\f转换为" "
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				// cur为true时才添加class
				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// 只有当前className中不存在时才添加className
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	}
	
## removeClass

### 用法

removeClass和addClass一样，支持两种使用方法：

1.removeClass(className)

className可以为一个或多个以空格隔开的className：

	<div id="test" class="other some">
	</div>

	$("#test").removeClass("other some");

2.removeClass(function(index, class))

	<div id="test">
		<ul>
			<li class="li-0">1</li>
			<li class="li-1">2</li>
			<li class="li-2">3</li>
			<li class="li-3">4</li>
			<li class="li-4">5</li>
		</ul>
	</div>

	$("#test li").removeClass(function(index, currentClass) {
		return "li-" + index;
	});
	
### 源代码分析

	// remveClass和addClass相反，他是通过value中的class一个一个删除
	// 利用cur = cur.replace( " " + clazz + " ", " " );实现
	// 1.removeClass(className)
	// 2.removeClass(function(index, class))
	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		// 和addClass一样
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						// 当前元素存在className时才会删除class
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	}
	
## toggleClass

### 用法

toggleClass的作用就是当元素存在某className时，移除它，当不存在时，就添加它。

1.toggleClass(className)

这种就是最基本的用法，当元素存在className时，移除className，当元素不存在className时，添加className：

	.red {
		color: red;
	}

	<div id="test">
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
			<li>4</li>
			<li>5</li>
		</ul>
	</div>

	$("#test li").click(function() {
		$(this).toggleClass("red");
	});
	
2.toggleClass(className, switch)

这种用法就是当switch为true时，addClass，当switch为false时，removeClass：

	.red {
		color: red;
	}

	<div id="test">
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
			<li>4</li>
			<li>5</li>
		</ul>
	</div>
	
	var count = 0;
	$("#test li").click(function() {
		count++;
		$(this).toggleClass("red", count%3 == 0);
	});
	
3.toggleClass([.switch])

switch是一个boolean，这种用法不是很明白？

4.toggleClass(function(index, class, switch), [,switch])

这种用法其实和第二种差不多，只是函数的返回值作为将被toggle的class：

	.red {
		color: red;
	}

	<div id="test">
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
			<li>4</li>
			<li>5</li>
		</ul>
	</div>
	
	var count = 0;
	$("#test li").click(function() {
		count++;
		$(this).toggleClass(function() {
			return "red";
		}, count%3 == 0);
	});
	
### 源代码分析

	// toggleClass接受两个参数，一个是类名，一个是stateVal，stateVal为true则添加类，否则移除类
	// 然后就是遍历元素，如果存在类则addClass，否则removeClass
	// 1.toggleClass(className)
	// 2.toggleClass(className, switch)	switch为true时，addClass，否则removeClass
	// 3.toggleClass([switch])
	// 4..toggleClass( function(index, class, switch) [, switch ] )
	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		// 匹配第二种情况，stateVal为true，addClass，为false,removeClass
		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		// 匹配第四种情况
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			// 匹配第一种情况
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			// 匹配第三种情况
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	}
	
## hasClass

### 用法

hasClass就是判断元素是否有某className。只有一种用法：hasClass(className)：

<div id="test" class="some"></div>

console.log($("#test").hasClass("some"));

### 源代码分析

这个代码比较简单，应该能看懂的，嘿嘿：

	// hasClass思路是(" " + this[i].className + " ").replace(rclass, " ").indexOf( " " + selector + " " )
	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			// 当前为元素节点
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}

## val

### 用法

val是获取或设置匹配元素中第一个元素的当前值，只适合input、select、textarea元素，共有三种用法：

1.val()

这种用法是获取匹配元素中第一个元素的当前值：

	<input type="text" value="some" id="test">

	$("#test").keyup(function() {
		console.log($(this).val());
	});

2.val(value)

这种用法是设置匹配元素的值：

	<input type="text" value="some" id="test">

	$("#test").val("cookfront");

3.val(function(index, value))

这种方法是通过函数的返回值设置元素的值，index为元素索引，value为元素的旧值：

	<input type="text" value="some" id="test">

	$("#test").val(function(index, value) {
		return $(this).val() + " other";
	});
	
### 源代码分析

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		// 如果没有传入参数的情况，为get第一个元素的value
		// he .val() method is primarily used to get the values of 
		// form elements such as input, select and textarea.
		// 1.val()	get
		if ( !arguments.length ) {
			if ( elem ) {
				// 通过钩子函数获取元素的值
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			// val(function(index, val))	val为元素的old value
			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			// 将null/undefined转换成""，将numbers转换成string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			// 通过钩子函数设置元素的值
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}

这里也有一个valHooks，因为不是所有的元素能设置value，比如select需要用select.options[select.selectedIndex].value获取。

到此attribute.js分析完毕了。
