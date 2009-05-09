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
 
 JSDraw.drawing = {};
 
 /**
  * The class for drawing shapes.
  */
 JSDraw.drawing.Graphics = function () {
 	//**************************************************
	// Meta-Class Attribute
	//**************************************************
 	var name = "JSDraw.drawing.Graphics"; /**< Name of this class. It is ready-only. */
	var version = "1.0.0"; /**< Version of this class. It is read-only. */
	
	/**
	 * Gets class name.
	 * 
	 * @return name of the class, always return "JSDraw.drawing.Graphics".
	 */
	this.getName = function () {
		return name;
	};
	
	/**
	 * Gets the version number of this class.
	 * 
	 * @return version number.
	 */
	this.getVersion = function () {
		return version;
	};
	
	//**************************************************
	// Graphics Attribute
	//**************************************************
	var color = "#000000"; /**< Color of graphics. */
	var fontFamily = "Arial"; /**< Font family name. */
	var fontSize = "12px"; /**< Font size. */
	var fontWeight = "normal"; /**< Font weight. */
	var fontStyle = "normal"; /**< Font style. */

	/**
	 * Gets color of current graphics.
	 * 
	 * @return color of current graphics.
	 */
	this.getColor = function () {
		return color;
	};
	
	/**
	 * Sets color of next graphics. The result will be effect next shape.
	 * 
	 * @param newColor to set as the current graphics color. Its format is /^#[0-9a-fA-F]{6}$/.
	 */
	this.setColor = function (newColor) {
		if(!JSDraw.util.Validator.color(newColor)) {
			return;
		}
		color = newColor;
	};
	
	/**
	 * Gets font family name.
	 * 
	 * @return font family
	 */
	this.getFontFamily = function () {
		return fontFamily;
	};
	
	/**
	 * Sets font family name of text.
	 * 
	 * @param font family name
	 */
	this.setFontFamily = function (family) {
		fontFamily = family;
	};
	
	/**
	 * Gets font size.
	 * 
	 * @return font size
	 */
	this.getFontSize = function () {
		return fontSize;
	}
	
	/**
	 * Sets font size. The valid value is the same to css defination.
	 * 
	 * @param font size
	 */
	this.setFontSize = function (size) {
		fontSize = size;
	};
	
	/**
	 * Gets font weight.
	 * 
	 * @return font weight
	 */
	this.getFontWeight = function () {
		return fontWeight;
	}
	
	/**
	 * Sets font weight. The valid value is the same to css defination.
	 * 
	 * @param weight font weight
	 */
	this.setFontWeight = function (weight) {
		fontWeight = weight;	
	};
	
	/**
	 * Gets font style.
	 */
	this.getFontStyle = function () {
		return fontStyle;
	}
	
	/**
	 * Sets font style. The valid value is the same to css defination.
	 * 
	 * @param style font style
	 */
	this.setFontStyle = function (style) {
		fontStyle = style;
	};
	
	//**************************************************
	// Drawing functions
	//**************************************************
	/**
	 * Fills a rectangle.
	 * 
	 * @param x abscissa of left top point of this rectangle, digit only without "px"
	 * @param y ordinate of left top point of this rectangle, digit only without "px"
	 * @param width width of rectangle, digit only without "px"
	 * @param height height of rectangle, digit only without "px"
	 */
	this.fillRect = function (x, y, width, height) {
		if(!checkPositiveInteger(x, y, width, height)) {
			alert("Input parameter should be positive integer!");
			return;
		}
		var rect = document.createElement("div");
		rect.style.position = "absolute";
		rect.style.left = x + "px";
		rect.style.top = y + "px";
		rect.style.backgroundColor = color;
		rect.style.width = width + "px";
		rect.style.height = height + "px";
		document.body.appendChild(rect);
	};
	
	/**
	 * Fills a square.
	 * 
	 * @param x abscissa of this square, digit only without "px"
	 * @param y ordinate of this square, digit only without "px"
	 * @param size size of this square, digit only without "px"
	 */
	this.fillSquare = function (x, y, size) {
		if(!checkPositiveInteger(x, y, size)) {
			alert("Input parameter should be positive integer!");
			return;
		}
		this.fillRect(x, y, size, size);
	};
	
	/**
	 * Draws a rectangle.
	 * 
	 * @param x abscissa of left top point of this rectangle, digit only without "px"
	 * @param y ordinate of left top point of this rectangle, digit only without "px"
	 * @param width width of rectangle, digit only without "px"
	 * @param height height of rectangle, digit only without "px"
	 * @param weight weight of this rectangle outline, digit only without "px"
	 */
	this.drawRect = function (x, y, width, height, weight) {
		if(!checkPositiveInteger(x, y, width, height, weight)) {
			alert("Input parameter should be positive integer!");
			return;
		}
		var xw = x + width;
		var yh = y + height;
		this.drawLine(x, y, xw, y, weight);
		this.drawLine(x, y, x, yh, weight);
		this.drawLine(xw, y, xw, yh, weight);
		this.drawLine(x, yh, xw, yh, weight);
	}
	
	/**
	 * Draws a line. Using Bresenham algorithm.
	 * 
	 * @param x0 abscissa of start point
	 * @param y0 ordinate of start point
	 * @param x1 abscissa of end point
	 * @param y1 ordinate of end point
	 * @param weight width of this line
	 */
	this.drawLine = function (x0, y0, x1, y1, weight) {
		if(!checkPositiveInteger(x0, y0, x1, y1, weight)) {
			alert("Input parameter should be positive integer!");
			return;
		}
		var dx = x1 - x0;
		var dy = y1 - y0;
		if(dx === 0) { // vertical
			this.fillRect(x0, y0, weight, dy);
		} else if(dy === 0) { // horizontal
			this.fillRect(x0, y0, dx, weight);
		} else { // others
			dx = dx > 0 ? dx : -dx;
			dy = dy > 0 ? dy : -dy;
			var e = -dx;
			var x = x0;
			var y = y0;
			for(var i = 0; i < dx; i++) {
				this.fillSquare(x, y, weight);
				x++;
				e = e + 2 * dy;
				if(e >= 0) {
					y++;
					e = e - 2 * dx;
				}
			}
		}
	};
	
	/**
	 * Draws a circle. Using Bresenham algorithm.
	 * 
	 * @param xc abscissa of the circle center point
	 * @param yc ordinate of the circle center point
	 * @param radius radius of this circle
	 * @param weight width of circle outline
	 */
	this.drawCircle = function (xc, yc, radius, weight) {
		if(!checkPositiveInteger(xc, yc, radius, weight)) {
			alert("Input parameter should be positive integer!");
			return;
		}
		var x = 0;
		var y = radius;
		var d = 3 - 2 * radius;
		while(x < y) {
			draw8Points(this, xc, yc, x, y, weight);
			if(d < 0) {
				d = d + 4 * x + 6;
			} else {
				d = d + 4 * (x - y) + 10;
				y--;
			}
			x++;
		}
		if(x === y) {
			draw8Points(this, xc, yc, x, y, weight);
		}
	};
	
	this.fillCircle = function (xc, yc, radius) {
		alert("fillCircle() Not implementation yet!");
//		if(!checkPositiveInteger(xc, yc, radius)) {
//			alert("Input parameter should be positive integer!");
//			return;
//		}
//		var x = 0;
//		var y = radius;
//		var d = 3 - 2 * radius;
//		while(x < y) {
//			draw8Lines(this, xc, yc, x, y);
//			if(d < 0) {
//				d = d + 4 * x + 6;
//			} else {
//				d = d + 4 * (x - y) + 10;
//				y--;
//			}
//			x++;
//		}
//		if(x === y) {
//			draw8Lines(this, xc, yc, x, y);
//		}
	};
	
	/**
	 * Draws a string at position (x, y).
	 * 
	 * @param abscissa of string left top point
	 * @param ordinate of the string left top point
	 * @param string to draw
	 */
	this.drawString = function (x, y, string) {
		if(!checkPositiveInteger(x, y)) {
			alert("Input parameter should be positive integer!");
			return;
		}
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.left = x + "px";
		div.style.top = y + "px";
		div.style.color = color;
		div.style.fontFamily = fontFamily;
		div.style.fontSize = fontSize;
		div.style.fontStyle = fontStyle;
		div.style.fontWeight = fontWeight;
		div.innerHTML = string;
		document.body.appendChild(div);
	}
	
	//**************************************************
	// Private functions
	//**************************************************
	/*
	 * Check all function arguments is positive integer or not.
	 * 
	 * @return true, if all arguments is positive integer
	 */
	var checkPositiveInteger = function () {
		for(var i = 0; i < arguments.length; i++) {
			if(!JSDraw.util.Validator.positiveInteger(arguments[i])) {
				return false;
			}
		}
		return true;
	};
	
	/*
	 * Draws 8 symmetrical points on a circle.
	 * 
	 * @param g graphics instance to draw
	 * @param xc abscissa of the circle center point
	 * @param yc ordinate of the circle center point
	 * @param x x axis offset
	 * @param y y axis offset
	 * @param weight weight of this circle outline
	 */
	var draw8Points = function (g, xc, yc, x, y, weight) {
		g.fillSquare(xc + x, yc + y, weight);
		g.fillSquare(xc - x, yc + y, weight);
		g.fillSquare(xc + x, yc - y, weight);
		g.fillSquare(xc - x, yc - y, weight);
		g.fillSquare(xc + y, yc + x, weight);
		g.fillSquare(xc - y, yc + x, weight);
		g.fillSquare(xc + y, yc - x, weight);
		g.fillSquare(xc - y, yc - x, weight);
	};
	
//	var draw8Lines = function (g, xc, yc, x, y) {
//		g.drawLine(xc - y, yc + x, xc + y, yc + x, 2);
//		g.drawLine(xc - x, yc + y, xc + x, yc + y, 2);
//		g.drawLine(xc - x, yc - y, xc + x, yc - y, 2);
//		g.drawLine(xc - y, yc - x, xc + y, yc - x, 2);
//	}
	
 };
 