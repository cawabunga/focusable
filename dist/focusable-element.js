(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["Focusable"] = factory(require("jquery"));
	else
		root["Focusable"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*!
 * Focus element overlay (Focusable) v0.1
 * https://github.com/zzarcon/focusable
 *
 * Copyright (c) 2014 @zzarcon <hezarco@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Date: 2014-11-18
 */

var $ = __webpack_require__(3);
var template = __webpack_require__(2);

var $columnWrapper = null;
var $element = null;
var isVisible = false;
var containerClass = 'lightbox-highlight';
var containerSelector = '.' + containerClass;
var options = {
  fadeDuration: 700,
  hideOnClick: false,
  hideOnESC: false,
  findOnResize: false,
  padding: 5,
  click: $.noop,
  canvas: false,
  multiple: false,
  activeElementClasses: 'focused'
};

$(document).ready(setup);

function setup() {
  $columnWrapper = $('body');
  createPlugin();
  addEvents();
}

/**
 * Defines Focusable as jQuey plugin
 * @return {jQuery object} this
 */
function createPlugin() {
  if (!window.jQuery || !window.$ || !window.$.fn) {
    return;
  }

  $.fn.focusable = function (options) {
    Focusable.setFocus(this, options);
    return this;
  };
}

function addEvents() {
  $columnWrapper.on('click', containerSelector, clickOnOverlay);
  $(window).on("resize", resizeHandler);
  $(window).on("keyup", keyupHandler);
}

function resizeHandler() {
  if (!$element) {
    return;
  }
  //Refind the element
  $element = options.findOnResize ? $($element.selector) : $element;

  refresh();
}

function keyupHandler(e) {
  options.hideOnESC && e.keyCode === 27 && isVisible && hide();
}

function clickOnOverlay() {
  if (!options.hideOnClick) {
    return;
  }

  hide();
}

function collides(rectangles, x, y) {
  return rectangles.reduce(function (memo, rectangle) {
    var left = rectangle.left;
    var right = rectangle.left + rectangle.width;
    var top = rectangle.top;
    var bottom = rectangle.top + rectangle.height;
    return memo || left <= x && x <= right && top <= y && y <= bottom;
  }, false);
}

function rejectByRectangles(rectangles, handler) {
  return function (event) {
    var x = event.offsetX;
    var y = event.offsetY;

    if (!collides(rectangles, x, y)) {
      handler.call(this, event);
    }
  };
}

function bindClickEventListener(lightboxElement, handler, rectangles) {
  if (lightboxElement[0].tagName === 'CANVAS') {
    lightboxElement.on('click', rejectByRectangles(rectangles, handler));
  } else {
    lightboxElement.on('click', '.lightbox-cell:not(.lightbox-opening)', handler);
  }
}

function setFocus($el, userOptions) {
  if ($element) {
    hide(true);
  }

  options = $.extend(options, userOptions);
  $element = $el;
  createColumns();

  if (options.circle) {
    createCircle();
  }

  $element.addClass(options.activeElementClasses);
  $columnWrapper.find(containerSelector).fadeIn(options.fadeDuration);
};

function clearColumns() {
  $columnWrapper.find(containerSelector).remove();
}

function hide() {
  var instant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  $element.removeClass(options.activeElementClasses);
  isVisible = false;
  $element = null;

  var fadeDuration = instant ? 0 : options.fadeDuration;
  $columnWrapper.find(containerSelector).fadeOut(fadeDuration, clearColumns);
}

function getSingleRectangle(elements) {
  var rects = elements.map(function (element) {
    return element.getBoundingClientRect();
  });

  var leftValues = rects.map(function (rect) {
    return rect.left;
  });
  var rightValues = rects.map(function (rect) {
    return rect.right;
  });
  var topValues = rects.map(function (rect) {
    return rect.top;
  });
  var bottomValues = rects.map(function (rect) {
    return rect.bottom;
  });

  var left = Math.min.apply(Math, _toConsumableArray(leftValues));
  var right = Math.max.apply(Math, _toConsumableArray(rightValues));
  var top = Math.min.apply(Math, _toConsumableArray(topValues));
  var bottom = Math.max.apply(Math, _toConsumableArray(bottomValues));
  var width = right - left;
  var height = bottom - top;

  return { left: left, right: right, top: top, bottom: bottom, width: width, height: height };
}

function getRectangles(elements) {
  return elements.map(function (element) {
    return element.getBoundingClientRect();
  });
}

function addPadding(rectangular) {
  var left = rectangular.left - options.padding;
  var right = rectangular.right + options.padding;
  var top = rectangular.top - options.padding;
  var bottom = rectangular.bottom + options.padding;
  var width = rectangular.width + 2 * options.padding;
  var height = rectangular.height + 2 * options.padding;

  return { left: left, right: right, top: top, bottom: bottom, width: width, height: height };
}

function addPageOffset(isFixed) {
  var scrollDimensions = getScrollDimensions();

  return function (rectangular) {
    var left = rectangular.left + (isFixed ? 0 : scrollDimensions.width);
    var right = rectangular.right + (isFixed ? 0 : scrollDimensions.width);
    var top = rectangular.top + (isFixed ? 0 : scrollDimensions.height);
    var bottom = rectangular.bottom + (isFixed ? 0 : scrollDimensions.height);
    var width = rectangular.width;
    var height = rectangular.height;

    return { left: left, right: right, top: top, bottom: bottom, width: width, height: height };
  };
}

function createColumns(forceVisibility) {
  if (!$element) {
    return;
  }

  isVisible = true;
  clearColumns();

  var isFixed = isElementFixed($element);

  var rectangles = void 0;
  if (options.multiple) {
    rectangles = getRectangles($element.toArray());
  } else {
    rectangles = [getSingleRectangle($element.toArray())];
  }

  rectangles = rectangles.map(addPadding).map(addPageOffset(isFixed));

  var lightboxElement = options.canvas ? createCanvasBackdrop(isFixed, rectangles) : createTable(isFixed, rectangles);

  bindClickEventListener(lightboxElement, options.click, rectangles);

  $columnWrapper.append(lightboxElement);

  if (forceVisibility === true) {
    $(containerSelector).show();
  }
}

function getPageDimensions() {
  return {
    height: document.body.scrollHeight,
    width: document.body.scrollWidth
  };
}

function getWindowDimensions() {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
}

function getScrollDimensions() {
  return {
    height: window.pageYOffset || window.scrollY,
    width: window.pageXOffset || window.scrollX
  };
}

function isElementFixed(element) {
  var elements = element.add(element.parents());
  var isFixed = false;
  elements.each(function () {
    if ($(this).css("position") === "fixed") {
      isFixed = true;
      return false;
    }
  });
  return isFixed;
}

function createTable(isFixed, rectangles) {
  var rectangle = rectangles[0];

  var pageDimensions = getPageDimensions();
  var windowDimensions = getWindowDimensions();

  var container = $(template);

  var topBlock = container.find('.lightbox-row:nth-of-type(1)');
  var middleBlock = container.find('.lightbox-row:nth-of-type(2)');
  var bottomBlock = container.find('.lightbox-row:nth-of-type(3)');

  var firstColumn = middleBlock.find('.lightbox-cell:nth-of-type(1)');
  var middleColumn = middleBlock.find('.lightbox-opening');

  var viewportDimensions = isFixed ? windowDimensions : pageDimensions;

  var topBlockHeight = Math.max(0, rectangle.top);
  var middleBlockHeight = rectangle.height;
  var bottomBlockHeight = Math.max(0, viewportDimensions.height - topBlockHeight - middleBlockHeight);

  var firstColumnWidth = Math.max(0, rectangle.left);
  var middleColumnWidth = rectangle.width;
  var lastColumnnWidth = Math.max(0, viewportDimensions.width - firstColumnWidth - middleColumnWidth);

  topBlock.height(topBlockHeight);
  middleBlock.height(middleBlockHeight);
  bottomBlock.height(bottomBlockHeight);

  firstColumn.width(firstColumnWidth);
  middleColumn.width(middleColumnWidth);

  if (isFixed) container.css('position', 'fixed');
  if (topBlockHeight === 0) container.css('top', -options.padding);
  if (bottomBlockHeight === 0) container.css('bottom', -options.padding);
  if (firstColumnWidth === 0) container.css('left', -options.padding);
  if (lastColumnnWidth === 0) container.css('right', -options.padding);

  return container;
}

function createCanvasBackdrop(isFixed, rectangles) {
  var pageDimensions = getPageDimensions();
  var windowDimensions = getWindowDimensions();

  var canvas = document.createElement('canvas');
  canvas.classList.add('lightbox-highlight', 'lightbox-highlight--canvas');
  var context = canvas.getContext('2d');

  var canvasWidth = void 0,
      canvasHeight = void 0;
  if (isFixed) {
    canvas.classList.add('lightbox-highlight--fixed');
    canvasWidth = windowDimensions.width;
    canvasHeight = windowDimensions.height;
  } else {
    canvasWidth = pageDimensions.width;
    canvasHeight = pageDimensions.height;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  rectangles.forEach(function (rectangle) {
    context.clearRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
  });

  return $(canvas);
}

/**
 * Create an svg node that outputs a rectangle with a hole in center
 * @return {jQuery object}
 */
function makeRectWithHole(width, height, radius) {
  return $('<svg width=' + width + ' height=' + height + '>' + '<defs>' + '    <mask id="hole">' + '        <rect width="100%" height="100%" fill="white"/>' + '        <circle r="' + radius + '" cx="' + width / 2 + '" cy="' + height / 2 + '" />' + '    </mask>' + '</defs>' + '<rect id="donut" style="fill:rgba(0,0,0,0.4);" width="' + width + '" height="' + height + '" mask="url(#hole)" />' + '</svg>');
};

/**
 * Add a hole
 * * @return {Void}
 */
function createCircle() {
  var bcr = $element.get(0).getBoundingClientRect();
  var circle = makeRectWithHole(bcr.width, bcr.height, Math.min(bcr.width / 2, bcr.height / 2));
  circle.attr('class', containerClass);
  circle.css({
    left: bcr.left,
    top: bcr.top,
    background: 'transparent'
  });
  $columnWrapper.prepend(circle);
}

/**
 * Prepend px to the received value
 * @return {String}
 */
function px(value) {
  return value + 'px';
}

function getActiveElement() {
  return $element;
}

function getOptions() {
  return options;
}

function getVisibility() {
  return isVisible;
}

function refresh() {
  createColumns(true);
}

module.exports = {
  setFocus: setFocus,
  hide: hide,
  refresh: refresh,
  getActiveElement: getActiveElement,
  getOptions: getOptions,
  isVisible: getVisibility
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<div class=\"lightbox-highlight\">\n    <div class=\"lightbox-row\"><div class=\"lightbox-cell\"></div></div>\n    <div class=\"lightbox-row lightbox-opening-row\">\n      <div class=\"lightbox-cell\"></div>\n      <div class=\"lightbox-cell lightbox-opening\"></div>\n      <div class=\"lightbox-cell\"></div>\n    </div>\n    <div class=\"lightbox-row\"><div class=\"lightbox-cell\"></div></div>\n</div>"

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});