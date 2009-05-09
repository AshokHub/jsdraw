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

 JSDraw = {};
 JSDraw.util = {};
 
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
			document.removeEventListener("DOMContentLoaded", fireDocumentReady, false);
			if(eventContainer) {
				eventContainer.fireEvents();
				eventContainer.clearListeners();
			}
		}
	};
	
	var initEventContainer = function () {
		eventContainer = new JSDraw.util.EventContainer();
		document.addEventListener("DOMContentLoaded", fireDocumentReady, false);
	};
	
 	var pub = {
		onDocumentReady : function (fn) {
			if(ready) {
				eventContainer.addEventListener(fn);
				eventContainer.fireEvents();
				eventContainer.clearListeners();
			} else {
				if(!eventContainer) {
					initEventContainer();
				}
				eventContainer.addEventListener(fn);
			}
		}
	};
	return pub;
 }();
 
 JSDraw.readyToDraw = JSDraw.EventManager.onDocumentReady;
 