Focusable [![Build Status](https://travis-ci.org/cawabunga/focusable.svg?branch=master)](https://travis-ci.org/cawabunga/focusable) [![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)
=============

An awesome and lightweight library for performing spotlight in your DOM elements, setting an animated overlay to the rest of the page.
**The library uses flexboxes and canvas.**
Apart from highlighting a regular elements also supports highlighting fixed positioned elements and highlighting multiple elements at one time.
You can find a [live demo here](http://cawabunga.github.io/focusable/).

### Showcase

![](https://raw.github.com/cawabunga/focusable/master/showcase/list.gif)

![](https://raw.github.com/cawabunga/focusable/master/showcase/header.gif)

![](https://raw.github.com/cawabunga/focusable/master/showcase/elements.gif)

### Installation
`$ npm i cawabunga/focusable --save`

Please, don't forget to include [css](src/style.css).

### API
###### Set spotlight (jQuery style)
```javascript
$('#my-element').setFocus(options);
```
###### Set spotlight (through library)
```javascript
Focusable.setFocus($('#my-element'), options);
```
###### Refresh current focused element
```javascript
Focusable.refresh();
```
###### Hide spotlight
```javascript
Focusable.hide();
```
###### Get focused element
```javascript
Focusable.getActiveElement();
```
###### Get options
```javascript
Focusable.getOptions();
```

###### Options
Property | Value | Default | Description
------------ | ------------- | ------------- | -------------
fadeDuration | Number | 700 | Duration of the overlay transition (milliseconds).
hideOnClick | Boolean | false | Hides the overlay when the user click into it.
hideOnESC | Boolean | false | Hides the overlay when the user press Esc.
findOnResize | Boolean | false | Refind the element in the DOM in case that the element don't still exists.
circle | Boolean | false | Have the spotlight in a circle shape. **The feauture is broken and will be removed in next version.**
padding | Number | 5 | Padding of the highlighted area in pixels.
click | Function | noop | Click handler on the backdrop.
canvas | Boolean | false | By the default the backdrop is being combined by multiple html tags: columns and rows. Whilst option is enabled the backdrop is being drawn by canvas.
multiple | Boolean | false | By the default the backdrop is being displayed as single area. By enabling this option you can highlight multiple elements (works only for canvas mode).
activeElementClasses | String | 'focused' | That css classes are being applied to active elements. Can be applied multiple classes: 'focused your-class'.


###### Examples
```javascript
// As a single rectangle adjusted to two elements:
Focusable.setFocus($('#one, #two'), {
  canvas: false,
  multiple: false
});

// As a multiple rectangles for each element:
Focusable.setFocus($('#one, #two'), {
  canvas: true,
  multiple: true
});

// You can simply disable propagation the click event:
Focusable.setFocus($('.element'), {
  click: function (event) {
    event.stopPropagation();
  }
});
```

###### Integration with other libraries
The library works like a charm with [shepherd](https://github.com/HubSpot/shepherd) walkthrough library.

Create a tour:
```javascript
new Shepherd.Tour({
  defaults: {
    when: {
      show: function () {
        var step = this;

        var defaultFocusableOptions = {
          fadeDuration: 0,
          canvas: false,
          multiple: false,
          click: function (event) {
            event.stopPropagation();
          }
        };

        if (step.options.focusable) {
          var focusableElement = $(step.options.focusable.element);
          var focusableOptions = $.extend({}, defaultFocusableOptions, step.options.focusable.options);

        } else if (step.options.attachTo) {
          var focusableElement = $(step.tether.target);
          var focusableOptions = defaultFocusableOptions;
        }

        if (focusableElement) {
          Focusable.setFocus(focusableElement, focusableOptions);
        } else {
          // here you can put custom overlay if you need
        }

      },

      hide: {
        var step = this;
        if (step.options.attachTo || step.options.focusable) {
          Focusable.hide();
        }
      }
    }
  }
});
```

And use in the steps descriptors:
```javascript
// Highlighting only active element
var step_1 = {
  title: 'First step',
  attachTo: '#element-1 bottom'
};

// Highlighting mutiple elements
var step_2 = {
  title: 'Second step',
  attachTo: '#element-2 bottom',
  focusable: {
    element: '#element-2, #element-3',
    options: {
      multiple: true,
      canvas: true,
    }
  },
};
```

###### Runing tests (outdated)
* `npm install`
* `grunt`
* See the result of testsuite in [http://localhost:9092](http://localhost:9092)

###### Dependencies
- jQuery
