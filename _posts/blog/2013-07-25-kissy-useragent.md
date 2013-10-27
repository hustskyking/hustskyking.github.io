---
layout: post
title: Kissy UA(userAgent)检测
description: Kissy ua模块的源代码阅读和分析，包括浏览器类型、版本、内核、操作系统、外壳、mobile浏览器类型的检测。
category: blog
---

在写JavaScript客户端程序的时候客户端检测是一个很重要的工作，客户端检测分为：特性检测、怪癖检测、浏览器嗅探。

## 特性检测

特性检测是最常用的客户端检测技术，它不是识别特定浏览器，而是识别浏览器的能力。采用这种方式不必顾及特定的浏览器如何，只要浏览器支持特定的能力，就可以给出解决方案。最常用的就是事件监听：

	function addEvent(el, type, handler) {
		if (el.addEventListener) {
			el.addEventListener(type, handler, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + type, handler);
		} else {
			el['on' + type] = handler;
		}
	}

## 怪癖检测

怪癖检测就是识别浏览器的某些特殊行为，但与特性检测不同的是，怪癖检测而是想知道浏览器存在是么bug。最经典的莫过于检测IE的 !-[1,] 的判断方式，是目前最少代码判断IE的方式，只需6个byte。这是个俄国人发现的。利用了数组[1,]的length。

	var isIE = !-[1,];
	
## 浏览器嗅探

也就是通过用户代理userAgent字符串来检测实际使用的浏览器，在每一次的HTTP请求过程中，用户代理字符串是作为响应首部发送的，而且该字符串可以通过JavaScript的navigator.userAgent属性访问。而Kissy正是使用这种方式，为什么Kissy使用浏览器嗅探，而不是使用常用的特性检测呢？在Kissy的注释中是这样写的：

> jQuery, YUI 等类库都推荐用特性探测替代浏览器嗅探。特性探测的好处是能自动适应未来设备和未知设备，比如
 if(document.addEventListener) 假设 IE9 支持标准事件，则代码不用修改，就自适应了“未来浏览器”。
 对于未知浏览器也是如此。但是，这并不意味着浏览器嗅探就得彻底抛弃。当代码很明确就是针对已知特定浏览器的，
 同时并非是某个特性探测可以解决时，用浏览器嗅探反而能带来代码的简洁，同时也也不会有什么后患。总之，一切
 皆权衡。
 
下面来分析Kissy的UA的检测过程：

首先看看几个函数，然后再是最精彩的部分了：

	function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }

    // 设置trident的版本，
    function setTridentVersion(ua, UA) {
        var core, m;
        UA[core = 'trident'] = 0.1; // Trident detected, look for revision

        // Get the Trident's accurate version
        if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
            UA[core] = numberify(m[1]);
        }

        UA.core = core;
    }

    // 获取IE的版本
    function getIEVersion(ua) {
        var m;
        if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
            return numberify(m[1]);
        }
        return 0;
    }
	
最精彩的就是getDescriptorFromUserAgent()这个函数，它是UA检测最重要的部分，下面来看它的源代码分析部分：

	function getDescriptorFromUserAgent(ua) {
        var EMPTY = '',
            os,
            core = EMPTY,
            shell = EMPTY, m,
            IE_DETECT_RANGE = [6, 9],
            ieVersion,
            v,
            end,
            VERSION_PLACEHOLDER = '{{version}}',
            // 这个是IE的条件注释，是特定用于判断IE的，
            // 通过div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            // 然后再判断div中s元素的个数，如果s.length > 0，则说明是IE浏览器，
            // 再通过将VERSION_PLACEHOLDER替换为IE浏览器版本6-9，判断出IE的版本，不支持IE10哟
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
            div = doc && doc.createElement('div'),
            s = [];
        /**
         * KISSY UA
         * @member KISSY
         * @class KISSY.UA
         * @singleton
         */
        var UA = {
            /**
             * webkit version
             * @type undefined|Number
             * @member KISSY.UA
             */
            webkit: undefined,
            /**
             * trident version
             * @type undefined|Number
             * @member KISSY.UA
             */
            trident: undefined,
            /**
             * gecko version
             * @type undefined|Number
             * @member KISSY.UA
             */
            gecko: undefined,
            /**
             * presto version
             * @type undefined|Number
             * @member KISSY.UA
             */
            presto: undefined,
            /**
             * chrome version
             * @type undefined|Number
             * @member KISSY.UA
             */
            chrome: undefined,
            /**
             * safari version
             * @type undefined|Number
             * @member KISSY.UA
             */
            safari: undefined,
            /**
             * firefox version
             * @type undefined|Number
             * @member KISSY.UA
             */
            firefox: undefined,
            /**
             * ie version
             * @type undefined|Number
             * @member KISSY.UA
             */
            ie: undefined,
            /**
             * opera version
             * @type undefined|Number
             * @member KISSY.UA
             */
            opera: undefined,
            /**
             * mobile browser. apple, android.
             * @type String
             * @member KISSY.UA
             */
            mobile: undefined,
            /**
             * browser render engine name. webkit, trident
             * @type String
             * @member KISSY.UA
             */
            core: undefined,
            /**
             * browser shell name. ie, chrome, firefox
             * @type String
             * @member KISSY.UA
             */
            shell: undefined,

            /**
             * PhantomJS version number
             * @type undefined|Number
             * @member KISSY.UA
             */
            phantomjs: undefined,

            /**
             * operating system. android, ios, linux, windows
             * @type string
             * @member KISSY.UA
             */
            os: undefined,

            /**
             * ipad ios version
             * @type Number
             * @member KISSY.UA
             */
            ipad: undefined,
            /**
             * iphone ios version
             * @type Number
             * @member KISSY.UA
             */
            iphone: undefined,
            /**
             * ipod ios
             * @type Number
             * @member KISSY.UA
             */
            ipod: undefined,
            /**
             * ios version
             * @type Number
             * @member KISSY.UA
             */
            ios: undefined,

            /**
             * android version
             * @type Number
             * @member KISSY.UA
             */
            android: undefined,

            /**
             * nodejs version
             * @type Number
             * @member KISSY.UA
             */
            nodejs: undefined
        };

        if (div) {
            // try to use IE-Conditional-Comment detect IE more accurately
            // IE10 doesn't support this method, @ref: http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
            // IE10和标准浏览器的s.length = 0，而IE9以下s.length = 0
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            s = div.getElementsByTagName('s');
        }

        // 当s.length > 0，说明浏览器是IE浏览器，且是IE10以下版本
        if (s.length > 0) {

            // 设置UA.trident
            setTridentVersion(ua, UA);

            // Detect the accurate version
            // 注意：
            //  UA.shell = ie, 表示外壳是 ie
            //  但 UA.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
            //  对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 UA.ie = 8, 否则
            //  很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
            //  判断IE的版本，通过IE_DETECT_RANGE[6, 9] s.length > 0，则说明为该版本的IE
            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if (s.length > 0) {
                    UA[shell = 'ie'] = v;
                    break;
                }
            }

            // https://github.com/kissyteam/kissy/issues/321
            // win8 embed app
            if (!UA.ie && (ieVersion = getIEVersion(ua))) {
                UA[shell = 'ie'] = ieVersion;
            }

        } else {
            // WebKit
            // 判断webkit内核，然后再判断是否为Chrome、Safari、Apple Mobile、Android等，
            // 并设置UA.webkit和特定的浏览器的UA
            if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
                UA[core = 'webkit'] = numberify(m[1]);

                // Chrome
                if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                    UA[shell = 'chrome'] = numberify(m[1]);
                }
                // Safari
                else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                    UA[shell = 'safari'] = numberify(m[1]);
                }

                // Apple Mobile
                if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
                    UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

                    m = ua.match(/OS ([^\s]*)/);
                    if (m && m[1]) {
                        UA.ios = numberify(m[1].replace('_', '.'));
                    }
                    os = 'ios';
                    m = ua.match(/iPad|iPod|iPhone/);
                    if (m && m[0]) {
                        UA[m[0].toLowerCase()] = UA.ios;
                    }
                } else if (/ Android/.test(ua)) {
                    if (/Mobile/.test(ua)) {
                        os = UA.mobile = 'android';
                    }
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        UA.android = numberify(m[1]);
                    }
                }
                // Other WebKit Mobile Browsers
                else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
                    UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
                }

                if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
                    UA.phantomjs = numberify(m[1]);
                }
            }
            // NOT WebKit
            else {
                // Presto
                // ref: http://www.useragentstring.com/pages/useragentstring.php
                // 判断是Presto内核，Presto为opera早版本浏览器的内核，然后再判断opera的版本
                if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                    UA[core = 'presto'] = numberify(m[1]);

                    // Opera
                    if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                        UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

                        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                            UA[shell] = numberify(m[1]);
                        }

                        // Opera Mini
                        if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                            UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
                        }
                        // Opera Mobile
                        // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
                        // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
                        else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                            UA.mobile = m[0];
                        }
                    }

                    // NOT WebKit or Presto
                } else {
                    // MSIE
                    // 由于最开始已经使用了 IE 条件注释判断，因此落到这里的唯一可能性只有 IE10+
                    // and analysis tools in nodejs
                    if (ieVersion = getIEVersion(ua)) {
                        UA[shell = 'ie'] = ieVersion;
                        setTridentVersion(ua, UA);
                        // NOT WebKit, Presto or IE
                    } else {
                        // Gecko
                        // 判断是否为Gecko内核，Gecko为火狐浏览器的内核，然后再判断火狐浏览器的版本
                        if ((m = ua.match(/Gecko/))) {
                            UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision
                            if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                UA[core] = numberify(m[1]);
                            }

                            // Firefox
                            if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                UA[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        // 通过userAgent判断操作系统
        if (!os) {
            if ((/windows|win32/i).test(ua)) {
                os = 'windows';
            } else if ((/macintosh|mac_powerpc/i).test(ua)) {
                os = 'macintosh';
            } else if ((/linux/i).test(ua)) {
                os = 'linux';
            } else if ((/rhino/i).test(ua)) {
                os = 'rhino';
            }
        }

        UA.os = os;
        UA.core = UA.core || core;
        UA.shell = shell;

        return UA;
    }

    // 将UA赋给KISSY.UA
    var UA = KISSY.UA = getDescriptorFromUserAgent(ua);
    // nodejs
    if (typeof process === 'object') {
        var versions, nodeVersion;
        if ((versions = process.versions) && (nodeVersion = versions.node)) {
            UA.os = process.platform;
            UA.nodejs = numberify(nodeVersion);
        }
    }

    // use by analysis tools in nodejs
    UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;

    var o = [
            // browser core type
            'webkit',
            'trident',
            'gecko',
            'presto',
            // browser type
            'chrome',
            'safari',
            'firefox',
            'ie',
            'opera'
        ],
        documentElement = doc && doc.documentElement,
        className = '';
    // 为文档添加特定浏览器和内核的类名
    // 类似于 <html class="ks-webkit537 ks-webkit ks-chrome27 ks-chrome">
    if (documentElement) {
        S.each(o, function (key) {
            var v = UA[key];
            if (v) {
                className += ' ks-' + key + (parseInt(v) + '');
                className += ' ks-' + key;
            }
        });
        if (S.trim(className)) {
            documentElement.className = S.trim(documentElement.className + className);
        }
    }
	
上面就是KISSY的UA的所有判断过程了。
