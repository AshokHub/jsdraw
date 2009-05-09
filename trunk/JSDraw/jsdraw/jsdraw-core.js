/**
 * Copyright 2009 Galaxy.org
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Cheng Liang, Finder.Cheng@gmail.com, galaxy.org
 */

 //**************************************************
 // Namespaces
 //**************************************************
 JSDraw = function () {
 	var name = "JSDraw"; /**< Name of this package. It is read-only. */
	var description = "JavaScript Graphics Library"; /**< Description of this package. It is read-only. */
	var version = "1.0.0"; /**< Version number of this package. It is read-only. */
	
	/**
	 * Gets the name of this package.
	 * 
	 * @return name of this package, always return "JSDraw"
	 */
	this.getName = function () {
		return name;
	};
	
	/**
	 * Gets description of this package.
	 * 
	 * @return description of this package
	 */
	this.getDescription = function () {
		return description;
	};
	
	/**
	 * Gets version number of this package.
	 * 
	 * @return version number of this package
	 */
	this.getVersion = function () {
		return version;
	};
 };

 JSDraw.util = {};

 JSDraw.System = {};

 //**************************************************
 // JS Loader
 //**************************************************
 (function() {
 	JSDraw.util.EventContainer = function () {
		this.listeners = [];
	};

	JSDraw.util.EventContainer.prototype = {
		addEventListener : function (fn) {
			if(!this.isListening(fn)) {
				var listener = this.createListener(fn);
				if(!this.firing) {
					this.listeners.push(listener);
				} else {
					this.listeners = this.listeners.slice(0);
					this.listeners.push(listener);
				}
			}
		},

		createListener : function (fn) {
			var listener = {
				fn : fn,
				fireFn : fn
			};
			return listener;
		},

		findListener : function (fn) {
			var ls = this.listeners;
			for(var i = 0, len = ls.length; i < len; i++) {
				if(ls[i].fn == fn) {
					return i;
				}
			}
			return -1;
		},

		isListening : function (fn) {
			return this.findListener(fn) != -1;
		},

		clearListeners : function () {
			this.listeners = [];
		},

		fireEvents : function () {
			var ls = this.listeners;
			var len = ls.length;
			if(len > 0) {
				this.firing = true;
				var args = Array.prototype.slice.call(arguments, 0);
				for(var i = 0; i < len; i++) {
					var listener = ls[i];
					if(listener.fireFn.apply(window, arguments) === false) {
						this.firing = false;
						return false;
					}
				}
				this.firing = false;
			}
			return true;
		}
	};
 })();

 JSDraw.EventManager = function () {
 	var eventContainer;
	var ready = false;

	var fireDocumentReady = function () {
		if(!ready) {
			ready = true;
			if(JSDraw.System.ie) {
				var defer = document.getElementById("ie-deferred-loader");
                if (defer) {
					defer.onreadystatechange = null;
					defer.parentNode.removeChild(defer);
				}
			} else {
				document.removeEventListener("DOMContentLoaded", fireDocumentReady, false);
			}
			if(eventContainer) {
				eventContainer.fireEvents();
				eventContainer.clearListeners();
			}
		}
	};

	var initEventContainer = function () {
		eventContainer = new JSDraw.util.EventContainer();
		if(JSDraw.System.ie) {
			document.write("<s"+'cript id="ie-deferred-loader" defer="defer" src="/'+'/:"></s'+"cript>");
            var defer = document.getElementById("ie-deferred-loader");
            defer.onreadystatechange = function(){
                if(this.readyState == "complete"){
                    fireDocumentReady();
                }
            };
		} else {
			document.addEventListener("DOMContentLoaded", fireDocumentReady, false);
		}
	};

	var checkBrowser = function () {
		// check browser type and version
		var ua = navigator.userAgent.toLowerCase();
 		var s;
 		(s = ua.match(/msie ([\d.]+)/)) ? JSDraw.System.ie = s[1] :
 			(s = ua.match(/firefox\/([\d.]+)/)) ? JSDraw.System.firefox = s[1] :
    		(s = ua.match(/chrome\/([\d.]+)/)) ? JSDraw.System.chrome = s[1] :
    		(s = ua.match(/opera.([\d.]+)/)) ? JSDraw.System.opera = s[1] :
    		(s = ua.match(/version\/([\d.]+).*safari/)) ? JSDraw.System.safari = s[1] : 0;
	};

 	var pub = {
		onDocumentReady : function (fn) {
			if(ready) {
				eventContainer.addEventListener(fn);
				eventContainer.fireEvents();
				eventContainer.clearListeners();
			} else {
				if(!eventContainer) {
					checkBrowser();
					initEventContainer();
				}
				eventContainer.addEventListener(fn);
			}
		}
	};
	return pub;
 }();

 /**
  * Function when to prepare all jobs before drawing. All drawing functions should be added
  * in readyToDraw function. The common format is as following:
  * <pre>
  * 	<html>
  * 		<head>
  * 			<title>JSDraw</title>
  * 			<script type="text/javascript" src="jsdraw/jsdraw-core.js"></script>
  *				<script type="text/javascript" src="jsdraw/jsdraw-drawing.js"></script>
  * 			<script type="text/javascript">
  * 				JSDraw.readyToDraw(function () {
  * 					var g = new JSDraw.drawing.Graphics();
						g.drawSquare(200, 100, 10);
  * 				});
  * 			</script>
  * 		</head>
  * 		<body>
  * 		</body>
  * 	</html>
  * </pre>
  */
 JSDraw.readyToDraw = JSDraw.EventManager.onDocumentReady;
 
 //**************************************************
 // Validator
 //**************************************************
 JSDraw.util.Validator = function () {
 }
 
 /**
  * Validates parameter is positive integer or not.
  * 
  * @param expr expression to validate
  */
 JSDraw.util.Validator.positiveInteger = function (expr) {
	var reg = /^\s*\d+\s*$/;
	return reg.test(expr);
 };
 
 /**
  * Validates parameter expression is color format or not. Color format is
  * /^#[0-9a-fA-F]{6}$/
  * 
  * @param expr expression to validate
  */
 JSDraw.util.Validator.color = function (expr) {
 	if(!expr) {
		return false;
	}
	var reg = /^#[0-9a-fA-F]{6}$/;
	return reg.test(expr);
 };
