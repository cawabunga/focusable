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

const $ = require('jquery');
const template = require('./template.html');

let $columnWrapper = null;
let $element = null;
let isVisible = false;
const containerClass = 'lightbox-highlight';
const containerSelector = '.' + containerClass;
let options = {
  fadeDuration: 700,
  hideOnClick: false,
  hideOnESC: false,
  findOnResize: false,
  padding: 5,
  click: $.noop
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
  if (!window.jQuery || !window.$ || !window.$.fn) {
    return;
  }

  $.fn.focusable = function(options) {
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

function bindClickEventListener(lightboxElement, handler) {
  lightboxElement.on('click', '.lightbox-cell:not(.lightbox-opening)', handler)
}

function setFocus($el, userOptions) {
  options = $.extend(options, userOptions);
  $element = $el;
  createColumns();

  if (options.circle) {
    createCircle();
  }

  $columnWrapper.find(containerSelector).fadeIn(options.fadeDuration);
};

function clearColumns() {
  $columnWrapper.find(containerSelector).remove();
}

function hide() {
  isVisible = false;
  $element = null;
  $columnWrapper.find(containerSelector).fadeOut(options.fadeDuration, clearColumns);
}

function getRectangle(elements) {
  const rects = elements.map(function (element) {
    return element.getBoundingClientRect();
  });

  const leftValues = rects.map(function (rect) {
    return rect.left;
  });
  const rightValues = rects.map(function (rect) {
    return rect.right;
  });
  const topValues = rects.map(function (rect) {
    return rect.top;
  });
  const bottomValues = rects.map(function (rect) {
    return rect.bottom;
  });

  const left = Math.min(...leftValues);
  const right = Math.max(...rightValues);
  const top = Math.min(...topValues);
  const bottom = Math.max(...bottomValues);
  const width = right - left;
  const height = bottom - top;

  return { left, right, top, bottom, width, height };
}

function createColumns(forceVisibility) {
  if (!$element) {
    return;
  }

  isVisible = true;
  clearColumns();

  const rectangle = getRectangle($element.toArray());
  const lightboxElement = createTable(rectangle);

  bindClickEventListener(lightboxElement, options.click)

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
  const elements = element.add(element.parents());
  let isFixed = false;
  elements.each(function() {
    if ($(this).css("position") === "fixed") {
      isFixed = true;
      return false;
    }
  });
  return isFixed;
}

function createTable(rectangle) {
  const pageDimensions = getPageDimensions();
  const windowDimensions = getWindowDimensions();
  const scrollDimensions = getScrollDimensions();

  const container = $(template);

  const topBlock = container.find('.lightbox-row:nth-of-type(1)');
  const middleBlock = container.find('.lightbox-row:nth-of-type(2)');
  const bottomBlock = container.find('.lightbox-row:nth-of-type(3)');

  const firstColumn = middleBlock.find('.lightbox-cell:nth-of-type(1)');
  const middleColumn = middleBlock.find('.lightbox-opening');

  if (isElementFixed($element)) {
    var topBlockHeight = Math.max(0, rectangle.top - options.padding);
    var middleBlockHeight = rectangle.height + 2 * options.padding;
    var bottomBlockHeight = Math.max(0, windowDimensions.height - topBlockHeight - middleBlockHeight);

    var firstColumnWidth = Math.max(0, rectangle.left - options.padding);
    var middleColumnWidth = rectangle.width + 2 * options.padding;
    var lastColumnnWidth = Math.max(0, windowDimensions.width - firstColumnWidth - middleColumnWidth);

  } else {
    var topBlockHeight = Math.max(0, scrollDimensions.height + rectangle.top - options.padding);
    var middleBlockHeight = rectangle.height + 2 * options.padding;
    var bottomBlockHeight = Math.max(0, pageDimensions.height - topBlockHeight - middleBlockHeight);

    var firstColumnWidth = Math.max(0, scrollDimensions.width + rectangle.left - options.padding);
    var middleColumnWidth = rectangle.width + 2 * options.padding;
    var lastColumnnWidth = Math.max(0, pageDimensions.width - firstColumnWidth - middleColumnWidth);
  }

  topBlock.height(topBlockHeight);
  middleBlock.height(middleBlockHeight);
  bottomBlock.height(bottomBlockHeight);

  firstColumn.width(firstColumnWidth);
  middleColumn.width(middleColumnWidth);

  if (isElementFixed($element)) container.css('position', 'fixed');
  if (topBlockHeight === 0)     container.css('top', -options.padding);
  if (bottomBlockHeight === 0)  container.css('bottom', -options.padding);
  if (firstColumnWidth === 0)   container.css('left', -options.padding);
  if (lastColumnnWidth === 0)   container.css('right', -options.padding);

  return container;
}

/**
 * Create an svg node that outputs a rectangle with a hole in center
 * @return {jQuery object}
 */
function makeRectWithHole (width, height, radius) {
   return $(
    '<svg width=' + width + ' height=' + height + '>' +
    '<defs>' +
    '    <mask id="hole">' +
    '        <rect width="100%" height="100%" fill="white"/>' +
    '        <circle r="' + radius +  '" cx="' + (width/2) + '" cy="' +  (height/2) +'" />' +
    '    </mask>' +
    '</defs>' +
    '<rect id="donut" style="fill:rgba(0,0,0,0.4);" width="' + width +'" height="' + height + '" mask="url(#hole)" />' +
    '</svg>');
};

/**
 * Add a hole
 * * @return {Void}
 */
function createCircle() {
  const bcr = $element.get(0).getBoundingClientRect();
  const circle = makeRectWithHole(bcr.width, bcr.height, Math.min(bcr.width/2, bcr.height/2));
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