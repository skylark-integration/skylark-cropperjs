/**
 * skylark-cropperjs - A version of cropperjs that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-cropperjs/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-cropperjs/constants',[],function () {
    'use strict';
    const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    const WINDOW = IS_BROWSER ? window : {};
    const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
    const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
    const NAMESPACE = 'cropper';
    const ACTION_ALL = 'all';
    const ACTION_CROP = 'crop';
    const ACTION_MOVE = 'move';
    const ACTION_ZOOM = 'zoom';
    const ACTION_EAST = 'e';
    const ACTION_WEST = 'w';
    const ACTION_SOUTH = 's';
    const ACTION_NORTH = 'n';
    const ACTION_NORTH_EAST = 'ne';
    const ACTION_NORTH_WEST = 'nw';
    const ACTION_SOUTH_EAST = 'se';
    const ACTION_SOUTH_WEST = 'sw';
    const CLASS_CROP = `${ NAMESPACE }-crop`;
    const CLASS_DISABLED = `${ NAMESPACE }-disabled`;
    const CLASS_HIDDEN = `${ NAMESPACE }-hidden`;
    const CLASS_HIDE = `${ NAMESPACE }-hide`;
    const CLASS_INVISIBLE = `${ NAMESPACE }-invisible`;
    const CLASS_MODAL = `${ NAMESPACE }-modal`;
    const CLASS_MOVE = `${ NAMESPACE }-move`;
    const DATA_ACTION = `${ NAMESPACE }Action`;
    const DATA_PREVIEW = `${ NAMESPACE }Preview`;
    const DRAG_MODE_CROP = 'crop';
    const DRAG_MODE_MOVE = 'move';
    const DRAG_MODE_NONE = 'none';
    const EVENT_CROP = 'crop';
    const EVENT_CROP_END = 'cropend';
    const EVENT_CROP_MOVE = 'cropmove';
    const EVENT_CROP_START = 'cropstart';
    const EVENT_DBLCLICK = 'dblclick';
    const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
    const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
    const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
    const EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
    const EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
    const EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
    const EVENT_READY = 'ready';
    const EVENT_RESIZE = 'resize';
    const EVENT_WHEEL = 'wheel';
    const EVENT_ZOOM = 'zoom';
    const MIME_TYPE_JPEG = 'image/jpeg';
    const REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
    const REGEXP_DATA_URL = /^data:/;
    const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
    const REGEXP_TAG_NAME = /^img|canvas$/i;
    const MIN_CONTAINER_WIDTH = 200;
    const MIN_CONTAINER_HEIGHT = 100;
    return {
        IS_BROWSER: IS_BROWSER,
        WINDOW: WINDOW,
        IS_TOUCH_DEVICE: IS_TOUCH_DEVICE,
        HAS_POINTER_EVENT: HAS_POINTER_EVENT,
        NAMESPACE: NAMESPACE,
        ACTION_ALL: ACTION_ALL,
        ACTION_CROP: ACTION_CROP,
        ACTION_MOVE: ACTION_MOVE,
        ACTION_ZOOM: ACTION_ZOOM,
        ACTION_EAST: ACTION_EAST,
        ACTION_WEST: ACTION_WEST,
        ACTION_SOUTH: ACTION_SOUTH,
        ACTION_NORTH: ACTION_NORTH,
        ACTION_NORTH_EAST: ACTION_NORTH_EAST,
        ACTION_NORTH_WEST: ACTION_NORTH_WEST,
        ACTION_SOUTH_EAST: ACTION_SOUTH_EAST,
        ACTION_SOUTH_WEST: ACTION_SOUTH_WEST,
        CLASS_CROP: CLASS_CROP,
        CLASS_DISABLED: CLASS_DISABLED,
        CLASS_HIDDEN: CLASS_HIDDEN,
        CLASS_HIDE: CLASS_HIDE,
        CLASS_INVISIBLE: CLASS_INVISIBLE,
        CLASS_MODAL: CLASS_MODAL,
        CLASS_MOVE: CLASS_MOVE,
        DATA_ACTION: DATA_ACTION,
        DATA_PREVIEW: DATA_PREVIEW,
        DRAG_MODE_CROP: DRAG_MODE_CROP,
        DRAG_MODE_MOVE: DRAG_MODE_MOVE,
        DRAG_MODE_NONE: DRAG_MODE_NONE,
        EVENT_CROP: EVENT_CROP,
        EVENT_CROP_END: EVENT_CROP_END,
        EVENT_CROP_MOVE: EVENT_CROP_MOVE,
        EVENT_CROP_START: EVENT_CROP_START,
        EVENT_DBLCLICK: EVENT_DBLCLICK,
        EVENT_TOUCH_START: EVENT_TOUCH_START,
        EVENT_TOUCH_MOVE: EVENT_TOUCH_MOVE,
        EVENT_TOUCH_END: EVENT_TOUCH_END,
        EVENT_POINTER_DOWN: EVENT_POINTER_DOWN,
        EVENT_POINTER_MOVE: EVENT_POINTER_MOVE,
        EVENT_POINTER_UP: EVENT_POINTER_UP,
        EVENT_READY: EVENT_READY,
        EVENT_RESIZE: EVENT_RESIZE,
        EVENT_WHEEL: EVENT_WHEEL,
        EVENT_ZOOM: EVENT_ZOOM,
        MIME_TYPE_JPEG: MIME_TYPE_JPEG,
        REGEXP_ACTIONS: REGEXP_ACTIONS,
        REGEXP_DATA_URL: REGEXP_DATA_URL,
        REGEXP_DATA_URL_JPEG: REGEXP_DATA_URL_JPEG,
        REGEXP_TAG_NAME: REGEXP_TAG_NAME,
        MIN_CONTAINER_WIDTH: MIN_CONTAINER_WIDTH,
        MIN_CONTAINER_HEIGHT: MIN_CONTAINER_HEIGHT
    };
});
define('skylark-cropperjs/defaults',['./constants'], function (a) {
    'use strict';
    return {
        viewMode: 0,
        dragMode: a.DRAG_MODE_CROP,
        initialAspectRatio: NaN,
        aspectRatio: NaN,
        data: null,
        preview: '',
        responsive: true,
        restore: true,
        checkCrossOrigin: true,
        checkOrientation: true,
        modal: true,
        guides: true,
        center: true,
        highlight: true,
        background: true,
        autoCrop: true,
        autoCropArea: 0.8,
        movable: true,
        rotatable: true,
        scalable: true,
        zoomable: true,
        zoomOnTouch: true,
        zoomOnWheel: true,
        wheelZoomRatio: 0.1,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
        minCanvasWidth: 0,
        minCanvasHeight: 0,
        minCropBoxWidth: 0,
        minCropBoxHeight: 0,
        minContainerWidth: 200,
        minContainerHeight: 100,
        ready: null,
        cropstart: null,
        cropmove: null,
        cropend: null,
        crop: null,
        zoom: null
    };
});
define('skylark-cropperjs/template',[],function () {
    'use strict';
    return '<div class="cropper-container" touch-action="none">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-cropper-action="e"></span>' + '<span class="cropper-line line-n" data-cropper-action="n"></span>' + '<span class="cropper-line line-w" data-cropper-action="w"></span>' + '<span class="cropper-line line-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-e" data-cropper-action="e"></span>' + '<span class="cropper-point point-n" data-cropper-action="n"></span>' + '<span class="cropper-point point-w" data-cropper-action="w"></span>' + '<span class="cropper-point point-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-ne" data-cropper-action="ne"></span>' + '<span class="cropper-point point-nw" data-cropper-action="nw"></span>' + '<span class="cropper-point point-sw" data-cropper-action="sw"></span>' + '<span class="cropper-point point-se" data-cropper-action="se"></span>' + '</div>' + '</div>';
});
define('skylark-cropperjs/utilities',['./constants'], function (a) {
    'use strict';


/**
 * Check if the given value is not a number.
 */

var isNaN = Number.isNaN || WINDOW.isNaN;
/**
 * Check if the given value is a number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
 */

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}
/**
 * Check if the given value is a positive number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
 */

var isPositiveNumber = function isPositiveNumber(value) {
  return value > 0 && value < Infinity;
};
/**
 * Check if the given value is undefined.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
 */

function isUndefined(value) {
  return typeof value === 'undefined';
}
/**
 * Check if the given value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is an object, else `false`.
 */

function isObject(value) {
  return _typeof(value) === 'object' && value !== null;
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Check if the given value is a plain object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
 */

function isPlainObject(value) {
  if (!isObject(value)) {
    return false;
  }

  try {
    var _constructor = value.constructor;
    var prototype = _constructor.prototype;
    return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
  } catch (error) {
    return false;
  }
}
/**
 * Check if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a function, else `false`.
 */

function isFunction(value) {
  return typeof value === 'function';
}
var slice = Array.prototype.slice;
/**
 * Convert array-like or iterable object to an array.
 * @param {*} value - The value to convert.
 * @returns {Array} Returns a new array.
 */

function toArray(value) {
  return Array.from ? Array.from(value) : slice.call(value);
}
/**
 * Iterate the given data.
 * @param {*} data - The data to iterate.
 * @param {Function} callback - The process function for each element.
 * @returns {*} The original data.
 */

function forEach(data, callback) {
  if (data && isFunction(callback)) {
    if (Array.isArray(data) || isNumber(data.length)
    /* array-like */
    ) {
        toArray(data).forEach(function (value, key) {
          callback.call(data, value, key, data);
        });
      } else if (isObject(data)) {
      Object.keys(data).forEach(function (key) {
        callback.call(data, data[key], key, data);
      });
    }
  }

  return data;
}
/**
 * Extend the given object.
 * @param {*} target - The target object to extend.
 * @param {*} args - The rest objects for merging to the target object.
 * @returns {Object} The extended object.
 */

var assign = Object.assign || function assign(target) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isObject(target) && args.length > 0) {
    args.forEach(function (arg) {
      if (isObject(arg)) {
        Object.keys(arg).forEach(function (key) {
          target[key] = arg[key];
        });
      }
    });
  }

  return target;
};
var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;
/**
 * Normalize decimal number.
 * Check out {@link http://0.30000000000000004.com/}
 * @param {number} value - The value to normalize.
 * @param {number} [times=100000000000] - The times for normalizing.
 * @returns {number} Returns the normalized number.
 */

function normalizeDecimalNumber(value) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
  return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
}
var REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;
/**
 * Apply styles to the given element.
 * @param {Element} element - The target element.
 * @param {Object} styles - The styles for applying.
 */

function setStyle(element, styles) {
  var style = element.style;
  forEach(styles, function (value, property) {
    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
      value = "".concat(value, "px");
    }

    style[property] = value;
  });
}
/**
 * Check if the given element has a special class.
 * @param {Element} element - The element to check.
 * @param {string} value - The class to search.
 * @returns {boolean} Returns `true` if the special class was found.
 */

function hasClass(element, value) {
  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
}
/**
 * Add classes to the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be added.
 */

function addClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    forEach(element, function (elem) {
      addClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.add(value);
    return;
  }

  var className = element.className.trim();

  if (!className) {
    element.className = value;
  } else if (className.indexOf(value) < 0) {
    element.className = "".concat(className, " ").concat(value);
  }
}
/**
 * Remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be removed.
 */

function removeClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    forEach(element, function (elem) {
      removeClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.remove(value);
    return;
  }

  if (element.className.indexOf(value) >= 0) {
    element.className = element.className.replace(value, '');
  }
}
/**
 * Add or remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be toggled.
 * @param {boolean} added - Add only.
 */

function toggleClass(element, value, added) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    forEach(element, function (elem) {
      toggleClass(elem, value, added);
    });
    return;
  } // IE10-11 doesn't support the second parameter of `classList.toggle`


  if (added) {
    addClass(element, value);
  } else {
    removeClass(element, value);
  }
}
var REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;
/**
 * Transform the given string from camelCase to kebab-case
 * @param {string} value - The value to transform.
 * @returns {string} The transformed value.
 */

function toParamCase(value) {
  return value.replace(REGEXP_CAMEL_CASE, '$1-$2').toLowerCase();
}
/**
 * Get data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to get.
 * @returns {string} The data value.
 */

function getData(element, name) {
  if (isObject(element[name])) {
    return element[name];
  }

  if (element.dataset) {
    return element.dataset[name];
  }

  return element.getAttribute("data-".concat(toParamCase(name)));
}
/**
 * Set data to the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to set.
 * @param {string} data - The data value.
 */

function setData(element, name, data) {
  if (isObject(data)) {
    element[name] = data;
  } else if (element.dataset) {
    element.dataset[name] = data;
  } else {
    element.setAttribute("data-".concat(toParamCase(name)), data);
  }
}
/**
 * Remove data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to remove.
 */

function removeData(element, name) {
  if (isObject(element[name])) {
    try {
      delete element[name];
    } catch (error) {
      element[name] = undefined;
    }
  } else if (element.dataset) {
    // #128 Safari not allows to delete dataset property
    try {
      delete element.dataset[name];
    } catch (error) {
      element.dataset[name] = undefined;
    }
  } else {
    element.removeAttribute("data-".concat(toParamCase(name)));
  }
}
var REGEXP_SPACES = /\s\s*/;

var onceSupported = function () {
  var supported = false;

  if (IS_BROWSER) {
    var once = false;

    var listener = function listener() {};

    var options = Object.defineProperty({}, 'once', {
      get: function get() {
        supported = true;
        return once;
      },

      /**
       * This setter can fix a `TypeError` in strict mode
       * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
       * @param {boolean} value - The value to set
       */
      set: function set(value) {
        once = value;
      }
    });
    WINDOW.addEventListener('test', listener, options);
    WINDOW.removeEventListener('test', listener, options);
  }

  return supported;
}();
/**
 * Remove event listener from the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */


function removeListener(element, type, listener) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var handler = listener;
  type.trim().split(REGEXP_SPACES).forEach(function (event) {
    if (!onceSupported) {
      var listeners = element.listeners;

      if (listeners && listeners[event] && listeners[event][listener]) {
        handler = listeners[event][listener];
        delete listeners[event][listener];

        if (Object.keys(listeners[event]).length === 0) {
          delete listeners[event];
        }

        if (Object.keys(listeners).length === 0) {
          delete element.listeners;
        }
      }
    }

    element.removeEventListener(event, handler, options);
  });
}
/**
 * Add event listener to the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */

function addListener(element, type, listener) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _handler = listener;
  type.trim().split(REGEXP_SPACES).forEach(function (event) {
    if (options.once && !onceSupported) {
      var _element$listeners = element.listeners,
          listeners = _element$listeners === void 0 ? {} : _element$listeners;

      _handler = function handler() {
        delete listeners[event][listener];
        element.removeEventListener(event, _handler, options);

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        listener.apply(element, args);
      };

      if (!listeners[event]) {
        listeners[event] = {};
      }

      if (listeners[event][listener]) {
        element.removeEventListener(event, listeners[event][listener], options);
      }

      listeners[event][listener] = _handler;
      element.listeners = listeners;
    }

    element.addEventListener(event, _handler, options);
  });
}
/**
 * Dispatch event on the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Object} data - The additional event data.
 * @returns {boolean} Indicate if the event is default prevented or not.
 */

function dispatchEvent(element, type, data) {
  var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

  if (isFunction(Event) && isFunction(CustomEvent)) {
    event = new CustomEvent(type, {
      detail: data,
      bubbles: true,
      cancelable: true
    });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, true, true, data);
  }

  return element.dispatchEvent(event);
}
/**
 * Get the offset base on the document.
 * @param {Element} element - The target element.
 * @returns {Object} The offset data.
 */

function getOffset(element) {
  var box = element.getBoundingClientRect();
  return {
    left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
    top: box.top + (window.pageYOffset - document.documentElement.clientTop)
  };
}
var location = WINDOW.location;
var REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
/**
 * Check if the given URL is a cross origin URL.
 * @param {string} url - The target URL.
 * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
 */

function isCrossOriginURL(url) {
  var parts = url.match(REGEXP_ORIGINS);
  return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
}
/**
 * Add timestamp to the given URL.
 * @param {string} url - The target URL.
 * @returns {string} The result URL.
 */

function addTimestamp(url) {
  var timestamp = "timestamp=".concat(new Date().getTime());
  return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
}
/**
 * Get transforms base on the given object.
 * @param {Object} obj - The target object.
 * @returns {string} A string contains transform values.
 */

function getTransforms(_ref) {
  var rotate = _ref.rotate,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      translateX = _ref.translateX,
      translateY = _ref.translateY;
  var values = [];

  if (isNumber(translateX) && translateX !== 0) {
    values.push("translateX(".concat(translateX, "px)"));
  }

  if (isNumber(translateY) && translateY !== 0) {
    values.push("translateY(".concat(translateY, "px)"));
  } // Rotate should come first before scale to match orientation transform


  if (isNumber(rotate) && rotate !== 0) {
    values.push("rotate(".concat(rotate, "deg)"));
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    values.push("scaleX(".concat(scaleX, ")"));
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    values.push("scaleY(".concat(scaleY, ")"));
  }

  var transform = values.length ? values.join(' ') : 'none';
  return {
    WebkitTransform: transform,
    msTransform: transform,
    transform: transform
  };
}
/**
 * Get the max ratio of a group of pointers.
 * @param {string} pointers - The target pointers.
 * @returns {number} The result ratio.
 */

function getMaxZoomRatio(pointers) {
  var pointers2 = _objectSpread2({}, pointers);

  var ratios = [];
  forEach(pointers, function (pointer, pointerId) {
    delete pointers2[pointerId];
    forEach(pointers2, function (pointer2) {
      var x1 = Math.abs(pointer.startX - pointer2.startX);
      var y1 = Math.abs(pointer.startY - pointer2.startY);
      var x2 = Math.abs(pointer.endX - pointer2.endX);
      var y2 = Math.abs(pointer.endY - pointer2.endY);
      var z1 = Math.sqrt(x1 * x1 + y1 * y1);
      var z2 = Math.sqrt(x2 * x2 + y2 * y2);
      var ratio = (z2 - z1) / z1;
      ratios.push(ratio);
    });
  });
  ratios.sort(function (a, b) {
    return Math.abs(a) < Math.abs(b);
  });
  return ratios[0];
}
/**
 * Get a pointer from an event object.
 * @param {Object} event - The target event object.
 * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
 * @returns {Object} The result pointer contains start and/or end point coordinates.
 */

function getPointer(_ref2, endOnly) {
  var pageX = _ref2.pageX,
      pageY = _ref2.pageY;
  var end = {
    endX: pageX,
    endY: pageY
  };
  return endOnly ? end : _objectSpread2({
    startX: pageX,
    startY: pageY
  }, end);
}
/**
 * Get the center point coordinate of a group of pointers.
 * @param {Object} pointers - The target pointers.
 * @returns {Object} The center point coordinate.
 */

function getPointersCenter(pointers) {
  var pageX = 0;
  var pageY = 0;
  var count = 0;
  forEach(pointers, function (_ref3) {
    var startX = _ref3.startX,
        startY = _ref3.startY;
    pageX += startX;
    pageY += startY;
    count += 1;
  });
  pageX /= count;
  pageY /= count;
  return {
    pageX: pageX,
    pageY: pageY
  };
}
/**
 * Get the max sizes in a rectangle under the given aspect ratio.
 * @param {Object} data - The original sizes.
 * @param {string} [type='contain'] - The adjust type.
 * @returns {Object} The result sizes.
 */

function getAdjustedSizes(_ref4) // or 'cover'
{
  var aspectRatio = _ref4.aspectRatio,
      height = _ref4.height,
      width = _ref4.width;
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contain';
  var isValidWidth = isPositiveNumber(width);
  var isValidHeight = isPositiveNumber(height);

  if (isValidWidth && isValidHeight) {
    var adjustedWidth = height * aspectRatio;

    if (type === 'contain' && adjustedWidth > width || type === 'cover' && adjustedWidth < width) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }
  } else if (isValidWidth) {
    height = width / aspectRatio;
  } else if (isValidHeight) {
    width = height * aspectRatio;
  }

  return {
    width: width,
    height: height
  };
}
/**
 * Get the new sizes of a rectangle after rotated.
 * @param {Object} data - The original sizes.
 * @returns {Object} The result sizes.
 */

function getRotatedSizes(_ref5) {
  var width = _ref5.width,
      height = _ref5.height,
      degree = _ref5.degree;
  degree = Math.abs(degree) % 180;

  if (degree === 90) {
    return {
      width: height,
      height: width
    };
  }

  var arc = degree % 90 * Math.PI / 180;
  var sinArc = Math.sin(arc);
  var cosArc = Math.cos(arc);
  var newWidth = width * cosArc + height * sinArc;
  var newHeight = width * sinArc + height * cosArc;
  return degree > 90 ? {
    width: newHeight,
    height: newWidth
  } : {
    width: newWidth,
    height: newHeight
  };
}
/**
 * Get a canvas which drew the given image.
 * @param {HTMLImageElement} image - The image for drawing.
 * @param {Object} imageData - The image data.
 * @param {Object} canvasData - The canvas data.
 * @param {Object} options - The options.
 * @returns {HTMLCanvasElement} The result canvas.
 */

function getSourceCanvas(image, _ref6, _ref7, _ref8) {
  var imageAspectRatio = _ref6.aspectRatio,
      imageNaturalWidth = _ref6.naturalWidth,
      imageNaturalHeight = _ref6.naturalHeight,
      _ref6$rotate = _ref6.rotate,
      rotate = _ref6$rotate === void 0 ? 0 : _ref6$rotate,
      _ref6$scaleX = _ref6.scaleX,
      scaleX = _ref6$scaleX === void 0 ? 1 : _ref6$scaleX,
      _ref6$scaleY = _ref6.scaleY,
      scaleY = _ref6$scaleY === void 0 ? 1 : _ref6$scaleY;
  var aspectRatio = _ref7.aspectRatio,
      naturalWidth = _ref7.naturalWidth,
      naturalHeight = _ref7.naturalHeight;
  var _ref8$fillColor = _ref8.fillColor,
      fillColor = _ref8$fillColor === void 0 ? 'transparent' : _ref8$fillColor,
      _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
      imageSmoothingEnabled = _ref8$imageSmoothingE === void 0 ? true : _ref8$imageSmoothingE,
      _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
      imageSmoothingQuality = _ref8$imageSmoothingQ === void 0 ? 'low' : _ref8$imageSmoothingQ,
      _ref8$maxWidth = _ref8.maxWidth,
      maxWidth = _ref8$maxWidth === void 0 ? Infinity : _ref8$maxWidth,
      _ref8$maxHeight = _ref8.maxHeight,
      maxHeight = _ref8$maxHeight === void 0 ? Infinity : _ref8$maxHeight,
      _ref8$minWidth = _ref8.minWidth,
      minWidth = _ref8$minWidth === void 0 ? 0 : _ref8$minWidth,
      _ref8$minHeight = _ref8.minHeight,
      minHeight = _ref8$minHeight === void 0 ? 0 : _ref8$minHeight;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var maxSizes = getAdjustedSizes({
    aspectRatio: aspectRatio,
    width: maxWidth,
    height: maxHeight
  });
  var minSizes = getAdjustedSizes({
    aspectRatio: aspectRatio,
    width: minWidth,
    height: minHeight
  }, 'cover');
  var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
  var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight)); // Note: should always use image's natural sizes for drawing as
  // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90

  var destMaxSizes = getAdjustedSizes({
    aspectRatio: imageAspectRatio,
    width: maxWidth,
    height: maxHeight
  });
  var destMinSizes = getAdjustedSizes({
    aspectRatio: imageAspectRatio,
    width: minWidth,
    height: minHeight
  }, 'cover');
  var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
  var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
  var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];
  canvas.width = normalizeDecimalNumber(width);
  canvas.height = normalizeDecimalNumber(height);
  context.fillStyle = fillColor;
  context.fillRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(rotate * Math.PI / 180);
  context.scale(scaleX, scaleY);
  context.imageSmoothingEnabled = imageSmoothingEnabled;
  context.imageSmoothingQuality = imageSmoothingQuality;
  context.drawImage.apply(context, [image].concat(_toConsumableArray(params.map(function (param) {
    return Math.floor(normalizeDecimalNumber(param));
  }))));
  context.restore();
  return canvas;
}
var fromCharCode = String.fromCharCode;
/**
 * Get string from char code in data view.
 * @param {DataView} dataView - The data view for read.
 * @param {number} start - The start index.
 * @param {number} length - The read length.
 * @returns {string} The read result.
 */

function getStringFromCharCode(dataView, start, length) {
  var str = '';
  length += start;

  for (var i = start; i < length; i += 1) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}
var REGEXP_DATA_URL_HEAD = /^data:.*,/;
/**
 * Transform Data URL to array buffer.
 * @param {string} dataURL - The Data URL to transform.
 * @returns {ArrayBuffer} The result array buffer.
 */

function dataURLToArrayBuffer(dataURL) {
  var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
  var binary = atob(base64);
  var arrayBuffer = new ArrayBuffer(binary.length);
  var uint8 = new Uint8Array(arrayBuffer);
  forEach(uint8, function (value, i) {
    uint8[i] = binary.charCodeAt(i);
  });
  return arrayBuffer;
}
/**
 * Transform array buffer to Data URL.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
 * @param {string} mimeType - The mime type of the Data URL.
 * @returns {string} The result Data URL.
 */

function arrayBufferToDataURL(arrayBuffer, mimeType) {
  var chunks = []; // Chunk Typed Array for better performance (#435)

  var chunkSize = 8192;
  var uint8 = new Uint8Array(arrayBuffer);

  while (uint8.length > 0) {
    // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
    // eslint-disable-next-line prefer-spread
    chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
    uint8 = uint8.subarray(chunkSize);
  }

  return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
}
/**
 * Get orientation value from given array buffer.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */

function resetAndGetOrientation(arrayBuffer) {
  var dataView = new DataView(arrayBuffer);
  var orientation; // Ignores range error when the image does not have correct Exif information

  try {
    var littleEndian;
    var app1Start;
    var ifdStart; // Only handle JPEG image (start by 0xFFD8)

    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      var length = dataView.byteLength;
      var offset = 2;

      while (offset + 1 < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }

        offset += 1;
      }
    }

    if (app1Start) {
      var exifIDCode = app1Start + 4;
      var tiffOffset = app1Start + 10;

      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        var endianness = dataView.getUint16(tiffOffset);
        littleEndian = endianness === 0x4949;

        if (littleEndian || endianness === 0x4D4D
        /* bigEndian */
        ) {
            if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
              var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

              if (firstIFDOffset >= 0x00000008) {
                ifdStart = tiffOffset + firstIFDOffset;
              }
            }
          }
      }
    }

    if (ifdStart) {
      var _length = dataView.getUint16(ifdStart, littleEndian);

      var _offset;

      var i;

      for (i = 0; i < _length; i += 1) {
        _offset = ifdStart + i * 12 + 2;

        if (dataView.getUint16(_offset, littleEndian) === 0x0112
        /* Orientation */
        ) {
            // 8 is the offset of the current tag's value
            _offset += 8; // Get the original orientation value

            orientation = dataView.getUint16(_offset, littleEndian); // Override the orientation with its default value

            dataView.setUint16(_offset, 1, littleEndian);
            break;
          }
      }
    }
  } catch (error) {
    orientation = 1;
  }

  return orientation;
}
/**
 * Parse Exif Orientation value.
 * @param {number} orientation - The orientation to parse.
 * @returns {Object} The parsed result.
 */

function parseOrientation(orientation) {
  var rotate = 0;
  var scaleX = 1;
  var scaleY = 1;

  switch (orientation) {
    // Flip horizontal
    case 2:
      scaleX = -1;
      break;
    // Rotate left 180��

    case 3:
      rotate = -180;
      break;
    // Flip vertical

    case 4:
      scaleY = -1;
      break;
    // Flip vertical and rotate right 90��

    case 5:
      rotate = 90;
      scaleY = -1;
      break;
    // Rotate right 90��

    case 6:
      rotate = 90;
      break;
    // Flip horizontal and rotate right 90��

    case 7:
      rotate = 90;
      scaleX = -1;
      break;
    // Rotate left 90��

    case 8:
      rotate = -90;
      break;

    default:
  }

  return {
    rotate: rotate,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

    return {
        isNaN: isNaN,
        isNumber: isNumber,
        isPositiveNumber: isPositiveNumber,
        isUndefined: isUndefined,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isFunction: isFunction,
        toArray: toArray,
        forEach: forEach,
        assign: assign,
        normalizeDecimalNumber: normalizeDecimalNumber,
        setStyle: setStyle,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        toParamCase: toParamCase,
        getData: getData,
        setData: setData,
        removeData: removeData,
        removeListener: removeListener,
        addListener: addListener,
        dispatchEvent: dispatchEvent,
        getOffset: getOffset,
        isCrossOriginURL: isCrossOriginURL,
        addTimestamp: addTimestamp,
        getTransforms: getTransforms,
        getMaxZoomRatio: getMaxZoomRatio,
        getPointer: getPointer,
        getPointersCenter: getPointersCenter,
        getAdjustedSizes: getAdjustedSizes,
        getRotatedSizes: getRotatedSizes,
        getSourceCanvas: getSourceCanvas,
        getStringFromCharCode: getStringFromCharCode,
        dataURLToArrayBuffer: dataURLToArrayBuffer,
        arrayBufferToDataURL: arrayBufferToDataURL,
        resetAndGetOrientation: resetAndGetOrientation,
        parseOrientation: parseOrientation
    };
});
define('skylark-cropperjs/render',[
    './constants',
    './utilities'
], function (a, b) {
    'use strict';
    return {
        render() {
            this.initContainer();
            this.initCanvas();
            this.initCropBox();
            this.renderCanvas();
            if (this.cropped) {
                this.renderCropBox();
            }
        },
        initContainer() {
            const {element, options, container, cropper} = this;
            b.addClass(cropper, a.CLASS_HIDDEN);
            b.removeClass(element, a.CLASS_HIDDEN);
            const containerData = {
                width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
                height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
            };
            this.containerData = containerData;
            b.setStyle(cropper, {
                width: containerData.width,
                height: containerData.height
            });
            b.addClass(element, a.CLASS_HIDDEN);
            b.removeClass(cropper, a.CLASS_HIDDEN);
        },
        initCanvas() {
            const {containerData, imageData} = this;
            const {viewMode} = this.options;
            const rotated = Math.abs(imageData.rotate) % 180 === 90;
            const naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
            const naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
            const aspectRatio = naturalWidth / naturalHeight;
            let canvasWidth = containerData.width;
            let canvasHeight = containerData.height;
            if (containerData.height * aspectRatio > containerData.width) {
                if (viewMode === 3) {
                    canvasWidth = containerData.height * aspectRatio;
                } else {
                    canvasHeight = containerData.width / aspectRatio;
                }
            } else if (viewMode === 3) {
                canvasHeight = containerData.width / aspectRatio;
            } else {
                canvasWidth = containerData.height * aspectRatio;
            }
            const canvasData = {
                aspectRatio,
                naturalWidth,
                naturalHeight,
                width: canvasWidth,
                height: canvasHeight
            };
            canvasData.left = (containerData.width - canvasWidth) / 2;
            canvasData.top = (containerData.height - canvasHeight) / 2;
            canvasData.oldLeft = canvasData.left;
            canvasData.oldTop = canvasData.top;
            this.canvasData = canvasData;
            this.limited = viewMode === 1 || viewMode === 2;
            this.limitCanvas(true, true);
            this.initialImageData = b.assign({}, imageData);
            this.initialCanvasData = b.assign({}, canvasData);
        },
        limitCanvas(sizeLimited, positionLimited) {
            const {options, containerData, canvasData, cropBoxData} = this;
            const {viewMode} = options;
            const {aspectRatio} = canvasData;
            const cropped = this.cropped && cropBoxData;
            if (sizeLimited) {
                let minCanvasWidth = Number(options.minCanvasWidth) || 0;
                let minCanvasHeight = Number(options.minCanvasHeight) || 0;
                if (viewMode > 1) {
                    minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
                    minCanvasHeight = Math.max(minCanvasHeight, containerData.height);
                    if (viewMode === 3) {
                        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                            minCanvasWidth = minCanvasHeight * aspectRatio;
                        } else {
                            minCanvasHeight = minCanvasWidth / aspectRatio;
                        }
                    }
                } else if (viewMode > 0) {
                    if (minCanvasWidth) {
                        minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
                    } else if (minCanvasHeight) {
                        minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
                    } else if (cropped) {
                        minCanvasWidth = cropBoxData.width;
                        minCanvasHeight = cropBoxData.height;
                        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                            minCanvasWidth = minCanvasHeight * aspectRatio;
                        } else {
                            minCanvasHeight = minCanvasWidth / aspectRatio;
                        }
                    }
                }
                ({
                    width: minCanvasWidth,
                    height: minCanvasHeight
                } = b.getAdjustedSizes({
                    aspectRatio,
                    width: minCanvasWidth,
                    height: minCanvasHeight
                }));
                canvasData.minWidth = minCanvasWidth;
                canvasData.minHeight = minCanvasHeight;
                canvasData.maxWidth = Infinity;
                canvasData.maxHeight = Infinity;
            }
            if (positionLimited) {
                if (viewMode > (cropped ? 0 : 1)) {
                    const newCanvasLeft = containerData.width - canvasData.width;
                    const newCanvasTop = containerData.height - canvasData.height;
                    canvasData.minLeft = Math.min(0, newCanvasLeft);
                    canvasData.minTop = Math.min(0, newCanvasTop);
                    canvasData.maxLeft = Math.max(0, newCanvasLeft);
                    canvasData.maxTop = Math.max(0, newCanvasTop);
                    if (cropped && this.limited) {
                        canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
                        canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
                        canvasData.maxLeft = cropBoxData.left;
                        canvasData.maxTop = cropBoxData.top;
                        if (viewMode === 2) {
                            if (canvasData.width >= containerData.width) {
                                canvasData.minLeft = Math.min(0, newCanvasLeft);
                                canvasData.maxLeft = Math.max(0, newCanvasLeft);
                            }
                            if (canvasData.height >= containerData.height) {
                                canvasData.minTop = Math.min(0, newCanvasTop);
                                canvasData.maxTop = Math.max(0, newCanvasTop);
                            }
                        }
                    }
                } else {
                    canvasData.minLeft = -canvasData.width;
                    canvasData.minTop = -canvasData.height;
                    canvasData.maxLeft = containerData.width;
                    canvasData.maxTop = containerData.height;
                }
            }
        },
        renderCanvas(changed, transformed) {
            const {canvasData, imageData} = this;
            if (transformed) {
                const {
                    width: naturalWidth,
                    height: naturalHeight
                } = b.getRotatedSizes({
                    width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
                    height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
                    degree: imageData.rotate || 0
                });
                const width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
                const height = canvasData.height * (naturalHeight / canvasData.naturalHeight);
                canvasData.left -= (width - canvasData.width) / 2;
                canvasData.top -= (height - canvasData.height) / 2;
                canvasData.width = width;
                canvasData.height = height;
                canvasData.aspectRatio = naturalWidth / naturalHeight;
                canvasData.naturalWidth = naturalWidth;
                canvasData.naturalHeight = naturalHeight;
                this.limitCanvas(true, false);
            }
            if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
                canvasData.left = canvasData.oldLeft;
            }
            if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
                canvasData.top = canvasData.oldTop;
            }
            canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
            canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
            this.limitCanvas(false, true);
            canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
            canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
            canvasData.oldLeft = canvasData.left;
            canvasData.oldTop = canvasData.top;
            b.setStyle(this.canvas, b.assign({
                width: canvasData.width,
                height: canvasData.height
            }, b.getTransforms({
                translateX: canvasData.left,
                translateY: canvasData.top
            })));
            this.renderImage(changed);
            if (this.cropped && this.limited) {
                this.limitCropBox(true, true);
            }
        },
        renderImage(changed) {
            const {canvasData, imageData} = this;
            const width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
            const height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
            b.assign(imageData, {
                width,
                height,
                left: (canvasData.width - width) / 2,
                top: (canvasData.height - height) / 2
            });
            b.setStyle(this.image, b.assign({
                width: imageData.width,
                height: imageData.height
            }, b.getTransforms(b.assign({
                translateX: imageData.left,
                translateY: imageData.top
            }, imageData))));
            if (changed) {
                this.output();
            }
        },
        initCropBox() {
            const {options, canvasData} = this;
            const aspectRatio = options.aspectRatio || options.initialAspectRatio;
            const autoCropArea = Number(options.autoCropArea) || 0.8;
            const cropBoxData = {
                width: canvasData.width,
                height: canvasData.height
            };
            if (aspectRatio) {
                if (canvasData.height * aspectRatio > canvasData.width) {
                    cropBoxData.height = cropBoxData.width / aspectRatio;
                } else {
                    cropBoxData.width = cropBoxData.height * aspectRatio;
                }
            }
            this.cropBoxData = cropBoxData;
            this.limitCropBox(true, true);
            cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
            cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
            cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
            cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
            cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
            cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
            cropBoxData.oldLeft = cropBoxData.left;
            cropBoxData.oldTop = cropBoxData.top;
            this.initialCropBoxData = b.assign({}, cropBoxData);
        },
        limitCropBox(sizeLimited, positionLimited) {
            const {options, containerData, canvasData, cropBoxData, limited} = this;
            const {aspectRatio} = options;
            if (sizeLimited) {
                let minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
                let minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
                let maxCropBoxWidth = limited ? Math.min(containerData.width, canvasData.width, canvasData.width + canvasData.left, containerData.width - canvasData.left) : containerData.width;
                let maxCropBoxHeight = limited ? Math.min(containerData.height, canvasData.height, canvasData.height + canvasData.top, containerData.height - canvasData.top) : containerData.height;
                minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
                minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);
                if (aspectRatio) {
                    if (minCropBoxWidth && minCropBoxHeight) {
                        if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
                            minCropBoxHeight = minCropBoxWidth / aspectRatio;
                        } else {
                            minCropBoxWidth = minCropBoxHeight * aspectRatio;
                        }
                    } else if (minCropBoxWidth) {
                        minCropBoxHeight = minCropBoxWidth / aspectRatio;
                    } else if (minCropBoxHeight) {
                        minCropBoxWidth = minCropBoxHeight * aspectRatio;
                    }
                    if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
                        maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
                    } else {
                        maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
                    }
                }
                cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
                cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
                cropBoxData.maxWidth = maxCropBoxWidth;
                cropBoxData.maxHeight = maxCropBoxHeight;
            }
            if (positionLimited) {
                if (limited) {
                    cropBoxData.minLeft = Math.max(0, canvasData.left);
                    cropBoxData.minTop = Math.max(0, canvasData.top);
                    cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
                    cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
                } else {
                    cropBoxData.minLeft = 0;
                    cropBoxData.minTop = 0;
                    cropBoxData.maxLeft = containerData.width - cropBoxData.width;
                    cropBoxData.maxTop = containerData.height - cropBoxData.height;
                }
            }
        },
        renderCropBox() {
            const {options, containerData, cropBoxData} = this;
            if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
                cropBoxData.left = cropBoxData.oldLeft;
            }
            if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
                cropBoxData.top = cropBoxData.oldTop;
            }
            cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
            cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
            this.limitCropBox(false, true);
            cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
            cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
            cropBoxData.oldLeft = cropBoxData.left;
            cropBoxData.oldTop = cropBoxData.top;
            if (options.movable && options.cropBoxMovable) {
                b.setData(this.face, a.DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? a.ACTION_MOVE : a.ACTION_ALL);
            }
            b.setStyle(this.cropBox, b.assign({
                width: cropBoxData.width,
                height: cropBoxData.height
            }, b.getTransforms({
                translateX: cropBoxData.left,
                translateY: cropBoxData.top
            })));
            if (this.cropped && this.limited) {
                this.limitCanvas(true, true);
            }
            if (!this.disabled) {
                this.output();
            }
        },
        output() {
            this.preview();
            b.dispatchEvent(this.element, a.EVENT_CROP, this.getData());
        }
    };
});
define('skylark-cropperjs/preview',[
    './constants',
    './utilities'
], function (a, b) {
    'use strict';
    return {
        initPreview() {
            const {element, crossOrigin} = this;
            const {preview} = this.options;
            const url = crossOrigin ? this.crossOriginUrl : this.url;
            const alt = element.alt || 'The image to preview';
            const image = document.createElement('img');
            if (crossOrigin) {
                image.crossOrigin = crossOrigin;
            }
            image.src = url;
            image.alt = alt;
            this.viewBox.appendChild(image);
            this.viewBoxImage = image;
            if (!preview) {
                return;
            }
            let previews = preview;
            if (typeof preview === 'string') {
                previews = element.ownerDocument.querySelectorAll(preview);
            } else if (preview.querySelector) {
                previews = [preview];
            }
            this.previews = previews;
            b.forEach(previews, el => {
                const img = document.createElement('img');
                b.setData(el, a.DATA_PREVIEW, {
                    width: el.offsetWidth,
                    height: el.offsetHeight,
                    html: el.innerHTML
                });
                if (crossOrigin) {
                    img.crossOrigin = crossOrigin;
                }
                img.src = url;
                img.alt = alt;
                img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
                el.innerHTML = '';
                el.appendChild(img);
            });
        },
        resetPreview() {
            b.forEach(this.previews, element => {
                const data = b.getData(element, a.DATA_PREVIEW);
                b.setStyle(element, {
                    width: data.width,
                    height: data.height
                });
                element.innerHTML = data.html;
                b.removeData(element, a.DATA_PREVIEW);
            });
        },
        preview() {
            const {imageData, canvasData, cropBoxData} = this;
            const {
                width: cropBoxWidth,
                height: cropBoxHeight
            } = cropBoxData;
            const {width, height} = imageData;
            const left = cropBoxData.left - canvasData.left - imageData.left;
            const top = cropBoxData.top - canvasData.top - imageData.top;
            if (!this.cropped || this.disabled) {
                return;
            }
            b.setStyle(this.viewBoxImage, b.assign({
                width,
                height
            }, b.getTransforms(b.assign({
                translateX: -left,
                translateY: -top
            }, imageData))));
            b.forEach(this.previews, element => {
                const data = b.getData(element, a.DATA_PREVIEW);
                const originalWidth = data.width;
                const originalHeight = data.height;
                let newWidth = originalWidth;
                let newHeight = originalHeight;
                let ratio = 1;
                if (cropBoxWidth) {
                    ratio = originalWidth / cropBoxWidth;
                    newHeight = cropBoxHeight * ratio;
                }
                if (cropBoxHeight && newHeight > originalHeight) {
                    ratio = originalHeight / cropBoxHeight;
                    newWidth = cropBoxWidth * ratio;
                    newHeight = originalHeight;
                }
                b.setStyle(element, {
                    width: newWidth,
                    height: newHeight
                });
                b.setStyle(element.getElementsByTagName('img')[0], b.assign({
                    width: width * ratio,
                    height: height * ratio
                }, b.getTransforms(b.assign({
                    translateX: -left * ratio,
                    translateY: -top * ratio
                }, imageData))));
            });
        }
    };
});
define('skylark-cropperjs/events',[
    './constants',
    './utilities'
], function (a, b) {
    'use strict';
    return {
        bind() {
            const {element, options, cropper} = this;
            if (b.isFunction(options.cropstart)) {
                b.addListener(element, a.EVENT_CROP_START, options.cropstart);
            }
            if (b.isFunction(options.cropmove)) {
                b.addListener(element, a.EVENT_CROP_MOVE, options.cropmove);
            }
            if (b.isFunction(options.cropend)) {
                b.addListener(element, a.EVENT_CROP_END, options.cropend);
            }
            if (b.isFunction(options.crop)) {
                b.addListener(element, a.EVENT_CROP, options.crop);
            }
            if (b.isFunction(options.zoom)) {
                b.addListener(element, a.EVENT_ZOOM, options.zoom);
            }
            b.addListener(cropper, a.EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));
            if (options.zoomable && options.zoomOnWheel) {
                b.addListener(cropper, a.EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
                    passive: false,
                    capture: true
                });
            }
            if (options.toggleDragModeOnDblclick) {
                b.addListener(cropper, a.EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
            }
            b.addListener(element.ownerDocument, a.EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
            b.addListener(element.ownerDocument, a.EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));
            if (options.responsive) {
                b.addListener(window, a.EVENT_RESIZE, this.onResize = this.resize.bind(this));
            }
        },
        unbind() {
            const {element, options, cropper} = this;
            if (b.isFunction(options.cropstart)) {
                b.removeListener(element, a.EVENT_CROP_START, options.cropstart);
            }
            if (b.isFunction(options.cropmove)) {
                b.removeListener(element, a.EVENT_CROP_MOVE, options.cropmove);
            }
            if (b.isFunction(options.cropend)) {
                b.removeListener(element, a.EVENT_CROP_END, options.cropend);
            }
            if (b.isFunction(options.crop)) {
                b.removeListener(element, a.EVENT_CROP, options.crop);
            }
            if (b.isFunction(options.zoom)) {
                b.removeListener(element, a.EVENT_ZOOM, options.zoom);
            }
            b.removeListener(cropper, a.EVENT_POINTER_DOWN, this.onCropStart);
            if (options.zoomable && options.zoomOnWheel) {
                b.removeListener(cropper, a.EVENT_WHEEL, this.onWheel, {
                    passive: false,
                    capture: true
                });
            }
            if (options.toggleDragModeOnDblclick) {
                b.removeListener(cropper, a.EVENT_DBLCLICK, this.onDblclick);
            }
            b.removeListener(element.ownerDocument, a.EVENT_POINTER_MOVE, this.onCropMove);
            b.removeListener(element.ownerDocument, a.EVENT_POINTER_UP, this.onCropEnd);
            if (options.responsive) {
                b.removeListener(window, a.EVENT_RESIZE, this.onResize);
            }
        }
    };
});
define('skylark-cropperjs/handlers',[
    './constants',
    './utilities'
], function (a, b) {
    'use strict';
    return {
        resize() {
            const {options, container, containerData} = this;
            const minContainerWidth = Number(options.minContainerWidth) || a.MIN_CONTAINER_WIDTH;
            const minContainerHeight = Number(options.minContainerHeight) || a.MIN_CONTAINER_HEIGHT;
            if (this.disabled || containerData.width <= minContainerWidth || containerData.height <= minContainerHeight) {
                return;
            }
            const ratio = container.offsetWidth / containerData.width;
            if (ratio !== 1 || container.offsetHeight !== containerData.height) {
                let canvasData;
                let cropBoxData;
                if (options.restore) {
                    canvasData = this.getCanvasData();
                    cropBoxData = this.getCropBoxData();
                }
                this.render();
                if (options.restore) {
                    this.setCanvasData(b.forEach(canvasData, (n, i) => {
                        canvasData[i] = n * ratio;
                    }));
                    this.setCropBoxData(b.forEach(cropBoxData, (n, i) => {
                        cropBoxData[i] = n * ratio;
                    }));
                }
            }
        },
        dblclick() {
            if (this.disabled || this.options.dragMode === a.DRAG_MODE_NONE) {
                return;
            }
            this.setDragMode(b.hasClass(this.dragBox, a.CLASS_CROP) ? a.DRAG_MODE_MOVE : a.DRAG_MODE_CROP);
        },
        wheel(event) {
            const ratio = Number(this.options.wheelZoomRatio) || 0.1;
            let delta = 1;
            if (this.disabled) {
                return;
            }
            event.preventDefault();
            if (this.wheeling) {
                return;
            }
            this.wheeling = true;
            setTimeout(() => {
                this.wheeling = false;
            }, 50);
            if (event.deltaY) {
                delta = event.deltaY > 0 ? 1 : -1;
            } else if (event.wheelDelta) {
                delta = -event.wheelDelta / 120;
            } else if (event.detail) {
                delta = event.detail > 0 ? 1 : -1;
            }
            this.zoom(-delta * ratio, event);
        },
        cropStart(event) {
            const {buttons, button} = event;
            if (this.disabled || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && (b.isNumber(buttons) && buttons !== 1 || b.isNumber(button) && button !== 0 || event.ctrlKey)) {
                return;
            }
            const {options, pointers} = this;
            let action;
            if (event.changedTouches) {
                b.forEach(event.changedTouches, touch => {
                    pointers[touch.identifier] = b.getPointer(touch);
                });
            } else {
                pointers[event.pointerId || 0] = b.getPointer(event);
            }
            if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
                action = a.ACTION_ZOOM;
            } else {
                action = b.getData(event.target, a.DATA_ACTION);
            }
            if (!a.REGEXP_ACTIONS.test(action)) {
                return;
            }
            if (b.dispatchEvent(this.element, a.EVENT_CROP_START, {
                    originalEvent: event,
                    action
                }) === false) {
                return;
            }
            event.preventDefault();
            this.action = action;
            this.cropping = false;
            if (action === a.ACTION_CROP) {
                this.cropping = true;
                b.addClass(this.dragBox, a.CLASS_MODAL);
            }
        },
        cropMove(event) {
            const {action} = this;
            if (this.disabled || !action) {
                return;
            }
            const {pointers} = this;
            event.preventDefault();
            if (b.dispatchEvent(this.element, a.EVENT_CROP_MOVE, {
                    originalEvent: event,
                    action
                }) === false) {
                return;
            }
            if (event.changedTouches) {
                b.forEach(event.changedTouches, touch => {
                    b.assign(pointers[touch.identifier] || {}, b.getPointer(touch, true));
                });
            } else {
                b.assign(pointers[event.pointerId || 0] || {}, b.getPointer(event, true));
            }
            this.change(event);
        },
        cropEnd(event) {
            if (this.disabled) {
                return;
            }
            const {action, pointers} = this;
            if (event.changedTouches) {
                b.forEach(event.changedTouches, touch => {
                    delete pointers[touch.identifier];
                });
            } else {
                delete pointers[event.pointerId || 0];
            }
            if (!action) {
                return;
            }
            event.preventDefault();
            if (!Object.keys(pointers).length) {
                this.action = '';
            }
            if (this.cropping) {
                this.cropping = false;
                b.toggleClass(this.dragBox, a.CLASS_MODAL, this.cropped && this.options.modal);
            }
            b.dispatchEvent(this.element, a.EVENT_CROP_END, {
                originalEvent: event,
                action
            });
        }
    };
});
define('skylark-cropperjs/change',[
    './constants',
    './utilities'
], function (a, b) {
    'use strict';
    return {
        change(event) {
            const {options, canvasData, containerData, cropBoxData, pointers} = this;
            let {action} = this;
            let {aspectRatio} = options;
            let {left, top, width, height} = cropBoxData;
            const right = left + width;
            const bottom = top + height;
            let minLeft = 0;
            let minTop = 0;
            let maxWidth = containerData.width;
            let maxHeight = containerData.height;
            let renderable = true;
            let offset;
            if (!aspectRatio && event.shiftKey) {
                aspectRatio = width && height ? width / height : 1;
            }
            if (this.limited) {
                ({minLeft, minTop} = cropBoxData);
                maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
                maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
            }
            const pointer = pointers[Object.keys(pointers)[0]];
            const range = {
                x: pointer.endX - pointer.startX,
                y: pointer.endY - pointer.startY
            };
            const check = side => {
                switch (side) {
                case a.ACTION_EAST:
                    if (right + range.x > maxWidth) {
                        range.x = maxWidth - right;
                    }
                    break;
                case a.ACTION_WEST:
                    if (left + range.x < minLeft) {
                        range.x = minLeft - left;
                    }
                    break;
                case a.ACTION_NORTH:
                    if (top + range.y < minTop) {
                        range.y = minTop - top;
                    }
                    break;
                case a.ACTION_SOUTH:
                    if (bottom + range.y > maxHeight) {
                        range.y = maxHeight - bottom;
                    }
                    break;
                default:
                }
            };
            switch (action) {
            case a.ACTION_ALL:
                left += range.x;
                top += range.y;
                break;
            case a.ACTION_EAST:
                if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
                    renderable = false;
                    break;
                }
                check(a.ACTION_EAST);
                width += range.x;
                if (width < 0) {
                    action = a.ACTION_WEST;
                    width = -width;
                    left -= width;
                }
                if (aspectRatio) {
                    height = width / aspectRatio;
                    top += (cropBoxData.height - height) / 2;
                }
                break;
            case a.ACTION_NORTH:
                if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
                    renderable = false;
                    break;
                }
                check(a.ACTION_NORTH);
                height -= range.y;
                top += range.y;
                if (height < 0) {
                    action = a.ACTION_SOUTH;
                    height = -height;
                    top -= height;
                }
                if (aspectRatio) {
                    width = height * aspectRatio;
                    left += (cropBoxData.width - width) / 2;
                }
                break;
            case a.ACTION_WEST:
                if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
                    renderable = false;
                    break;
                }
                check(a.ACTION_WEST);
                width -= range.x;
                left += range.x;
                if (width < 0) {
                    action = a.ACTION_EAST;
                    width = -width;
                    left -= width;
                }
                if (aspectRatio) {
                    height = width / aspectRatio;
                    top += (cropBoxData.height - height) / 2;
                }
                break;
            case a.ACTION_SOUTH:
                if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
                    renderable = false;
                    break;
                }
                check(a.ACTION_SOUTH);
                height += range.y;
                if (height < 0) {
                    action = a.ACTION_NORTH;
                    height = -height;
                    top -= height;
                }
                if (aspectRatio) {
                    width = height * aspectRatio;
                    left += (cropBoxData.width - width) / 2;
                }
                break;
            case a.ACTION_NORTH_EAST:
                if (aspectRatio) {
                    if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
                        renderable = false;
                        break;
                    }
                    check(a.ACTION_NORTH);
                    height -= range.y;
                    top += range.y;
                    width = height * aspectRatio;
                } else {
                    check(a.ACTION_NORTH);
                    check(a.ACTION_EAST);
                    if (range.x >= 0) {
                        if (right < maxWidth) {
                            width += range.x;
                        } else if (range.y <= 0 && top <= minTop) {
                            renderable = false;
                        }
                    } else {
                        width += range.x;
                    }
                    if (range.y <= 0) {
                        if (top > minTop) {
                            height -= range.y;
                            top += range.y;
                        }
                    } else {
                        height -= range.y;
                        top += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = a.ACTION_SOUTH_WEST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = a.ACTION_NORTH_WEST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = a.ACTION_SOUTH_EAST;
                    height = -height;
                    top -= height;
                }
                break;
            case a.ACTION_NORTH_WEST:
                if (aspectRatio) {
                    if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
                        renderable = false;
                        break;
                    }
                    check(a.ACTION_NORTH);
                    height -= range.y;
                    top += range.y;
                    width = height * aspectRatio;
                    left += cropBoxData.width - width;
                } else {
                    check(a.ACTION_NORTH);
                    check(a.ACTION_WEST);
                    if (range.x <= 0) {
                        if (left > minLeft) {
                            width -= range.x;
                            left += range.x;
                        } else if (range.y <= 0 && top <= minTop) {
                            renderable = false;
                        }
                    } else {
                        width -= range.x;
                        left += range.x;
                    }
                    if (range.y <= 0) {
                        if (top > minTop) {
                            height -= range.y;
                            top += range.y;
                        }
                    } else {
                        height -= range.y;
                        top += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = a.ACTION_SOUTH_EAST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = a.ACTION_NORTH_EAST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = a.ACTION_SOUTH_WEST;
                    height = -height;
                    top -= height;
                }
                break;
            case a.ACTION_SOUTH_WEST:
                if (aspectRatio) {
                    if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
                        renderable = false;
                        break;
                    }
                    check(a.ACTION_WEST);
                    width -= range.x;
                    left += range.x;
                    height = width / aspectRatio;
                } else {
                    check(a.ACTION_SOUTH);
                    check(a.ACTION_WEST);
                    if (range.x <= 0) {
                        if (left > minLeft) {
                            width -= range.x;
                            left += range.x;
                        } else if (range.y >= 0 && bottom >= maxHeight) {
                            renderable = false;
                        }
                    } else {
                        width -= range.x;
                        left += range.x;
                    }
                    if (range.y >= 0) {
                        if (bottom < maxHeight) {
                            height += range.y;
                        }
                    } else {
                        height += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = a.ACTION_NORTH_EAST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = a.ACTION_SOUTH_EAST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = a.ACTION_NORTH_WEST;
                    height = -height;
                    top -= height;
                }
                break;
            case a.ACTION_SOUTH_EAST:
                if (aspectRatio) {
                    if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
                        renderable = false;
                        break;
                    }
                    check(a.ACTION_EAST);
                    width += range.x;
                    height = width / aspectRatio;
                } else {
                    check(a.ACTION_SOUTH);
                    check(a.ACTION_EAST);
                    if (range.x >= 0) {
                        if (right < maxWidth) {
                            width += range.x;
                        } else if (range.y >= 0 && bottom >= maxHeight) {
                            renderable = false;
                        }
                    } else {
                        width += range.x;
                    }
                    if (range.y >= 0) {
                        if (bottom < maxHeight) {
                            height += range.y;
                        }
                    } else {
                        height += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = a.ACTION_NORTH_WEST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = a.ACTION_SOUTH_WEST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = a.ACTION_NORTH_EAST;
                    height = -height;
                    top -= height;
                }
                break;
            case a.ACTION_MOVE:
                this.move(range.x, range.y);
                renderable = false;
                break;
            case a.ACTION_ZOOM:
                this.zoom(b.getMaxZoomRatio(pointers), event);
                renderable = false;
                break;
            case a.ACTION_CROP:
                if (!range.x || !range.y) {
                    renderable = false;
                    break;
                }
                offset = b.getOffset(this.cropper);
                left = pointer.startX - offset.left;
                top = pointer.startY - offset.top;
                width = cropBoxData.minWidth;
                height = cropBoxData.minHeight;
                if (range.x > 0) {
                    action = range.y > 0 ? a.ACTION_SOUTH_EAST : a.ACTION_NORTH_EAST;
                } else if (range.x < 0) {
                    left -= width;
                    action = range.y > 0 ? a.ACTION_SOUTH_WEST : a.ACTION_NORTH_WEST;
                }
                if (range.y < 0) {
                    top -= height;
                }
                if (!this.cropped) {
                    b.removeClass(this.cropBox, a.CLASS_HIDDEN);
                    this.cropped = true;
                    if (this.limited) {
                        this.limitCropBox(true, true);
                    }
                }
                break;
            default:
            }
            if (renderable) {
                cropBoxData.width = width;
                cropBoxData.height = height;
                cropBoxData.left = left;
                cropBoxData.top = top;
                this.action = action;
                this.renderCropBox();
            }
            b.forEach(pointers, p => {
                p.startX = p.endX;
                p.startY = p.endY;
            });
        }
    };
});
define('skylark-cropperjs/methods',[
    './constants',
    './utilities'
], function (a, b) {
    'use strict';
    return {
        crop() {
            if (this.ready && !this.cropped && !this.disabled) {
                this.cropped = true;
                this.limitCropBox(true, true);
                if (this.options.modal) {
                    b.addClass(this.dragBox, a.CLASS_MODAL);
                }
                b.removeClass(this.cropBox, a.CLASS_HIDDEN);
                this.setCropBoxData(this.initialCropBoxData);
            }
            return this;
        },
        reset() {
            if (this.ready && !this.disabled) {
                this.imageData = b.assign({}, this.initialImageData);
                this.canvasData = b.assign({}, this.initialCanvasData);
                this.cropBoxData = b.assign({}, this.initialCropBoxData);
                this.renderCanvas();
                if (this.cropped) {
                    this.renderCropBox();
                }
            }
            return this;
        },
        clear() {
            if (this.cropped && !this.disabled) {
                b.assign(this.cropBoxData, {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                });
                this.cropped = false;
                this.renderCropBox();
                this.limitCanvas(true, true);
                this.renderCanvas();
                b.removeClass(this.dragBox, a.CLASS_MODAL);
                b.addClass(this.cropBox, a.CLASS_HIDDEN);
            }
            return this;
        },
        replace(url, hasSameSize = false) {
            if (!this.disabled && url) {
                if (this.isImg) {
                    this.element.src = url;
                }
                if (hasSameSize) {
                    this.url = url;
                    this.image.src = url;
                    if (this.ready) {
                        this.viewBoxImage.src = url;
                        b.forEach(this.previews, element => {
                            element.getElementsByTagName('img')[0].src = url;
                        });
                    }
                } else {
                    if (this.isImg) {
                        this.replaced = true;
                    }
                    this.options.data = null;
                    this.uncreate();
                    this.load(url);
                }
            }
            return this;
        },
        enable() {
            if (this.ready && this.disabled) {
                this.disabled = false;
                b.removeClass(this.cropper, a.CLASS_DISABLED);
            }
            return this;
        },
        disable() {
            if (this.ready && !this.disabled) {
                this.disabled = true;
                b.addClass(this.cropper, a.CLASS_DISABLED);
            }
            return this;
        },
        destroy() {
            const {element} = this;
            if (!element[a.NAMESPACE]) {
                return this;
            }
            element[a.NAMESPACE] = undefined;
            if (this.isImg && this.replaced) {
                element.src = this.originalUrl;
            }
            this.uncreate();
            return this;
        },
        move(offsetX, offsetY = offsetX) {
            const {left, top} = this.canvasData;
            return this.moveTo(b.isUndefined(offsetX) ? offsetX : left + Number(offsetX), b.isUndefined(offsetY) ? offsetY : top + Number(offsetY));
        },
        moveTo(x, y = x) {
            const {canvasData} = this;
            let changed = false;
            x = Number(x);
            y = Number(y);
            if (this.ready && !this.disabled && this.options.movable) {
                if (b.isNumber(x)) {
                    canvasData.left = x;
                    changed = true;
                }
                if (b.isNumber(y)) {
                    canvasData.top = y;
                    changed = true;
                }
                if (changed) {
                    this.renderCanvas(true);
                }
            }
            return this;
        },
        zoom(ratio, _originalEvent) {
            const {canvasData} = this;
            ratio = Number(ratio);
            if (ratio < 0) {
                ratio = 1 / (1 - ratio);
            } else {
                ratio = 1 + ratio;
            }
            return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
        },
        zoomTo(ratio, pivot, _originalEvent) {
            const {options, canvasData} = this;
            const {width, height, naturalWidth, naturalHeight} = canvasData;
            ratio = Number(ratio);
            if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
                const newWidth = naturalWidth * ratio;
                const newHeight = naturalHeight * ratio;
                if (b.dispatchEvent(this.element, a.EVENT_ZOOM, {
                        ratio,
                        oldRatio: width / naturalWidth,
                        originalEvent: _originalEvent
                    }) === false) {
                    return this;
                }
                if (_originalEvent) {
                    const {pointers} = this;
                    const offset = b.getOffset(this.cropper);
                    const center = pointers && Object.keys(pointers).length ? b.getPointersCenter(pointers) : {
                        pageX: _originalEvent.pageX,
                        pageY: _originalEvent.pageY
                    };
                    canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
                    canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
                } else if (b.isPlainObject(pivot) && b.isNumber(pivot.x) && b.isNumber(pivot.y)) {
                    canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
                    canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
                } else {
                    canvasData.left -= (newWidth - width) / 2;
                    canvasData.top -= (newHeight - height) / 2;
                }
                canvasData.width = newWidth;
                canvasData.height = newHeight;
                this.renderCanvas(true);
            }
            return this;
        },
        rotate(degree) {
            return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
        },
        rotateTo(degree) {
            degree = Number(degree);
            if (b.isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
                this.imageData.rotate = degree % 360;
                this.renderCanvas(true, true);
            }
            return this;
        },
        scaleX(scaleX) {
            const {scaleY} = this.imageData;
            return this.scale(scaleX, b.isNumber(scaleY) ? scaleY : 1);
        },
        scaleY(scaleY) {
            const {scaleX} = this.imageData;
            return this.scale(b.isNumber(scaleX) ? scaleX : 1, scaleY);
        },
        scale(scaleX, scaleY = scaleX) {
            const {imageData} = this;
            let transformed = false;
            scaleX = Number(scaleX);
            scaleY = Number(scaleY);
            if (this.ready && !this.disabled && this.options.scalable) {
                if (b.isNumber(scaleX)) {
                    imageData.scaleX = scaleX;
                    transformed = true;
                }
                if (b.isNumber(scaleY)) {
                    imageData.scaleY = scaleY;
                    transformed = true;
                }
                if (transformed) {
                    this.renderCanvas(true, true);
                }
            }
            return this;
        },
        getData(rounded = false) {
            const {options, imageData, canvasData, cropBoxData} = this;
            let data;
            if (this.ready && this.cropped) {
                data = {
                    x: cropBoxData.left - canvasData.left,
                    y: cropBoxData.top - canvasData.top,
                    width: cropBoxData.width,
                    height: cropBoxData.height
                };
                const ratio = imageData.width / imageData.naturalWidth;
                b.forEach(data, (n, i) => {
                    data[i] = n / ratio;
                });
                if (rounded) {
                    const bottom = Math.round(data.y + data.height);
                    const right = Math.round(data.x + data.width);
                    data.x = Math.round(data.x);
                    data.y = Math.round(data.y);
                    data.width = right - data.x;
                    data.height = bottom - data.y;
                }
            } else {
                data = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
            }
            if (options.rotatable) {
                data.rotate = imageData.rotate || 0;
            }
            if (options.scalable) {
                data.scaleX = imageData.scaleX || 1;
                data.scaleY = imageData.scaleY || 1;
            }
            return data;
        },
        setData(data) {
            const {options, imageData, canvasData} = this;
            const cropBoxData = {};
            if (this.ready && !this.disabled && b.isPlainObject(data)) {
                let transformed = false;
                if (options.rotatable) {
                    if (b.isNumber(data.rotate) && data.rotate !== imageData.rotate) {
                        imageData.rotate = data.rotate;
                        transformed = true;
                    }
                }
                if (options.scalable) {
                    if (b.isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
                        imageData.scaleX = data.scaleX;
                        transformed = true;
                    }
                    if (b.isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
                        imageData.scaleY = data.scaleY;
                        transformed = true;
                    }
                }
                if (transformed) {
                    this.renderCanvas(true, true);
                }
                const ratio = imageData.width / imageData.naturalWidth;
                if (b.isNumber(data.x)) {
                    cropBoxData.left = data.x * ratio + canvasData.left;
                }
                if (b.isNumber(data.y)) {
                    cropBoxData.top = data.y * ratio + canvasData.top;
                }
                if (b.isNumber(data.width)) {
                    cropBoxData.width = data.width * ratio;
                }
                if (b.isNumber(data.height)) {
                    cropBoxData.height = data.height * ratio;
                }
                this.setCropBoxData(cropBoxData);
            }
            return this;
        },
        getContainerData() {
            return this.ready ? b.assign({}, this.containerData) : {};
        },
        getImageData() {
            return this.sized ? b.assign({}, this.imageData) : {};
        },
        getCanvasData() {
            const {canvasData} = this;
            const data = {};
            if (this.ready) {
                b.forEach([
                    'left',
                    'top',
                    'width',
                    'height',
                    'naturalWidth',
                    'naturalHeight'
                ], n => {
                    data[n] = canvasData[n];
                });
            }
            return data;
        },
        setCanvasData(data) {
            const {canvasData} = this;
            const {aspectRatio} = canvasData;
            if (this.ready && !this.disabled && b.isPlainObject(data)) {
                if (b.isNumber(data.left)) {
                    canvasData.left = data.left;
                }
                if (b.isNumber(data.top)) {
                    canvasData.top = data.top;
                }
                if (b.isNumber(data.width)) {
                    canvasData.width = data.width;
                    canvasData.height = data.width / aspectRatio;
                } else if (b.isNumber(data.height)) {
                    canvasData.height = data.height;
                    canvasData.width = data.height * aspectRatio;
                }
                this.renderCanvas(true);
            }
            return this;
        },
        getCropBoxData() {
            const {cropBoxData} = this;
            let data;
            if (this.ready && this.cropped) {
                data = {
                    left: cropBoxData.left,
                    top: cropBoxData.top,
                    width: cropBoxData.width,
                    height: cropBoxData.height
                };
            }
            return data || {};
        },
        setCropBoxData(data) {
            const {cropBoxData} = this;
            const {aspectRatio} = this.options;
            let widthChanged;
            let heightChanged;
            if (this.ready && this.cropped && !this.disabled && b.isPlainObject(data)) {
                if (b.isNumber(data.left)) {
                    cropBoxData.left = data.left;
                }
                if (b.isNumber(data.top)) {
                    cropBoxData.top = data.top;
                }
                if (b.isNumber(data.width) && data.width !== cropBoxData.width) {
                    widthChanged = true;
                    cropBoxData.width = data.width;
                }
                if (b.isNumber(data.height) && data.height !== cropBoxData.height) {
                    heightChanged = true;
                    cropBoxData.height = data.height;
                }
                if (aspectRatio) {
                    if (widthChanged) {
                        cropBoxData.height = cropBoxData.width / aspectRatio;
                    } else if (heightChanged) {
                        cropBoxData.width = cropBoxData.height * aspectRatio;
                    }
                }
                this.renderCropBox();
            }
            return this;
        },
        getCroppedCanvas(options = {}) {
            if (!this.ready || !window.HTMLCanvasElement) {
                return null;
            }
            const {canvasData} = this;
            const source = b.getSourceCanvas(this.image, this.imageData, canvasData, options);
            if (!this.cropped) {
                return source;
            }
            let {
                x: initialX,
                y: initialY,
                width: initialWidth,
                height: initialHeight
            } = this.getData();
            const ratio = source.width / Math.floor(canvasData.naturalWidth);
            if (ratio !== 1) {
                initialX *= ratio;
                initialY *= ratio;
                initialWidth *= ratio;
                initialHeight *= ratio;
            }
            const aspectRatio = initialWidth / initialHeight;
            const maxSizes = b.getAdjustedSizes({
                aspectRatio,
                width: options.maxWidth || Infinity,
                height: options.maxHeight || Infinity
            });
            const minSizes = b.getAdjustedSizes({
                aspectRatio,
                width: options.minWidth || 0,
                height: options.minHeight || 0
            }, 'cover');
            let {width, height} = b.getAdjustedSizes({
                aspectRatio,
                width: options.width || (ratio !== 1 ? source.width : initialWidth),
                height: options.height || (ratio !== 1 ? source.height : initialHeight)
            });
            width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
            height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = b.normalizeDecimalNumber(width);
            canvas.height = b.normalizeDecimalNumber(height);
            context.fillStyle = options.fillColor || 'transparent';
            context.fillRect(0, 0, width, height);
            const {imageSmoothingEnabled = true, imageSmoothingQuality} = options;
            context.imageSmoothingEnabled = imageSmoothingEnabled;
            if (imageSmoothingQuality) {
                context.imageSmoothingQuality = imageSmoothingQuality;
            }
            const sourceWidth = source.width;
            const sourceHeight = source.height;
            let srcX = initialX;
            let srcY = initialY;
            let srcWidth;
            let srcHeight;
            let dstX;
            let dstY;
            let dstWidth;
            let dstHeight;
            if (srcX <= -initialWidth || srcX > sourceWidth) {
                srcX = 0;
                srcWidth = 0;
                dstX = 0;
                dstWidth = 0;
            } else if (srcX <= 0) {
                dstX = -srcX;
                srcX = 0;
                srcWidth = Math.min(sourceWidth, initialWidth + srcX);
                dstWidth = srcWidth;
            } else if (srcX <= sourceWidth) {
                dstX = 0;
                srcWidth = Math.min(initialWidth, sourceWidth - srcX);
                dstWidth = srcWidth;
            }
            if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
                srcY = 0;
                srcHeight = 0;
                dstY = 0;
                dstHeight = 0;
            } else if (srcY <= 0) {
                dstY = -srcY;
                srcY = 0;
                srcHeight = Math.min(sourceHeight, initialHeight + srcY);
                dstHeight = srcHeight;
            } else if (srcY <= sourceHeight) {
                dstY = 0;
                srcHeight = Math.min(initialHeight, sourceHeight - srcY);
                dstHeight = srcHeight;
            }
            const params = [
                srcX,
                srcY,
                srcWidth,
                srcHeight
            ];
            if (dstWidth > 0 && dstHeight > 0) {
                const scale = width / initialWidth;
                params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
            }
            context.drawImage(source, ...params.map(param => Math.floor(b.normalizeDecimalNumber(param))));
            return canvas;
        },
        setAspectRatio(aspectRatio) {
            const {options} = this;
            if (!this.disabled && !b.isUndefined(aspectRatio)) {
                options.aspectRatio = Math.max(0, aspectRatio) || NaN;
                if (this.ready) {
                    this.initCropBox();
                    if (this.cropped) {
                        this.renderCropBox();
                    }
                }
            }
            return this;
        },
        setDragMode(mode) {
            const {options, dragBox, face} = this;
            if (this.ready && !this.disabled) {
                const croppable = mode === a.DRAG_MODE_CROP;
                const movable = options.movable && mode === a.DRAG_MODE_MOVE;
                mode = croppable || movable ? mode : a.DRAG_MODE_NONE;
                options.dragMode = mode;
                b.setData(dragBox, a.DATA_ACTION, mode);
                b.toggleClass(dragBox, a.CLASS_CROP, croppable);
                b.toggleClass(dragBox, a.CLASS_MOVE, movable);
                if (!options.cropBoxMovable) {
                    b.setData(face, a.DATA_ACTION, mode);
                    b.toggleClass(face, a.CLASS_CROP, croppable);
                    b.toggleClass(face, a.CLASS_MOVE, movable);
                }
            }
            return this;
        }
    };
});
define('skylark-cropperjs/Cropper',[
    'skylark-langx/skylark',
    './defaults',
    './template',
    './render',
    './preview',
    './events',
    './handlers',
    './change',
    './methods',
    './constants',
    './utilities'
], function (skylark, DEFAULTS, TEMPLATE, render, preview, events, handlers, change, methods, a, b) {
    'use strict';
    const AnotherCropper = a.WINDOW.Cropper;
    class Cropper {
        constructor(element, options = {}) {
            if (!element || !a.REGEXP_TAG_NAME.test(element.tagName)) {
                throw new Error('The first argument is required and must be an <img> or <canvas> element.');
            }
            this.element = element;
            this.options = b.assign({}, DEFAULTS, b.isPlainObject(options) && options);
            this.cropped = false;
            this.disabled = false;
            this.pointers = {};
            this.ready = false;
            this.reloading = false;
            this.replaced = false;
            this.sized = false;
            this.sizing = false;
            this.init();
        }
        init() {
            const {element} = this;
            const tagName = element.tagName.toLowerCase();
            let url;
            if (element[a.NAMESPACE]) {
                return;
            }
            element[a.NAMESPACE] = this;
            if (tagName === 'img') {
                this.isImg = true;
                url = element.getAttribute('src') || '';
                this.originalUrl = url;
                if (!url) {
                    return;
                }
                url = element.src;
            } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
                url = element.toDataURL();
            }
            this.load(url);
        }
        load(url) {
            if (!url) {
                return;
            }
            this.url = url;
            this.imageData = {};
            const {element, options} = this;
            if (!options.rotatable && !options.scalable) {
                options.checkOrientation = false;
            }
            if (!options.checkOrientation || !window.ArrayBuffer) {
                this.clone();
                return;
            }
            if (a.REGEXP_DATA_URL.test(url)) {
                if (a.REGEXP_DATA_URL_JPEG.test(url)) {
                    this.read(b.dataURLToArrayBuffer(url));
                } else {
                    this.clone();
                }
                return;
            }
            const xhr = new XMLHttpRequest();
            const clone = this.clone.bind(this);
            this.reloading = true;
            this.xhr = xhr;
            xhr.onabort = clone;
            xhr.onerror = clone;
            xhr.ontimeout = clone;
            xhr.onprogress = () => {
                if (xhr.getResponseHeader('content-type') !== a.MIME_TYPE_JPEG) {
                    xhr.abort();
                }
            };
            xhr.onload = () => {
                this.read(xhr.response);
            };
            xhr.onloadend = () => {
                this.reloading = false;
                this.xhr = null;
            };
            if (options.checkCrossOrigin && b.isCrossOriginURL(url) && element.crossOrigin) {
                url = b.addTimestamp(url);
            }
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.withCredentials = element.crossOrigin === 'use-credentials';
            xhr.send();
        }
        read(arrayBuffer) {
            const {options, imageData} = this;
            const orientation = b.resetAndGetOrientation(arrayBuffer);
            let rotate = 0;
            let scaleX = 1;
            let scaleY = 1;
            if (orientation > 1) {
                this.url = b.arrayBufferToDataURL(arrayBuffer, a.MIME_TYPE_JPEG);
                ({rotate, scaleX, scaleY} = b.parseOrientation(orientation));
            }
            if (options.rotatable) {
                imageData.rotate = rotate;
            }
            if (options.scalable) {
                imageData.scaleX = scaleX;
                imageData.scaleY = scaleY;
            }
            this.clone();
        }
        clone() {
            const {element, url} = this;
            let {crossOrigin} = element;
            let crossOriginUrl = url;
            if (this.options.checkCrossOrigin && b.isCrossOriginURL(url)) {
                if (!crossOrigin) {
                    crossOrigin = 'anonymous';
                }
                crossOriginUrl = b.addTimestamp(url);
            }
            this.crossOrigin = crossOrigin;
            this.crossOriginUrl = crossOriginUrl;
            const image = document.createElement('img');
            if (crossOrigin) {
                image.crossOrigin = crossOrigin;
            }
            image.src = crossOriginUrl || url;
            image.alt = element.alt || 'The image to crop';
            this.image = image;
            image.onload = this.start.bind(this);
            image.onerror = this.stop.bind(this);
            b.addClass(image, a.CLASS_HIDE);
            element.parentNode.insertBefore(image, element.nextSibling);
        }
        start() {
            const {image} = this;
            image.onload = null;
            image.onerror = null;
            this.sizing = true;
            const isIOSWebKit = a.WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(a.WINDOW.navigator.userAgent);
            const done = (naturalWidth, naturalHeight) => {
                b.assign(this.imageData, {
                    naturalWidth,
                    naturalHeight,
                    aspectRatio: naturalWidth / naturalHeight
                });
                this.sizing = false;
                this.sized = true;
                this.build();
            };
            if (image.naturalWidth && !isIOSWebKit) {
                done(image.naturalWidth, image.naturalHeight);
                return;
            }
            const sizingImage = document.createElement('img');
            const body = document.body || document.documentElement;
            this.sizingImage = sizingImage;
            sizingImage.onload = () => {
                done(sizingImage.width, sizingImage.height);
                if (!isIOSWebKit) {
                    body.removeChild(sizingImage);
                }
            };
            sizingImage.src = image.src;
            if (!isIOSWebKit) {
                sizingImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
                body.appendChild(sizingImage);
            }
        }
        stop() {
            const {image} = this;
            image.onload = null;
            image.onerror = null;
            image.parentNode.removeChild(image);
            this.image = null;
        }
        build() {
            if (!this.sized || this.ready) {
                return;
            }
            const {element, options, image} = this;
            const container = element.parentNode;
            const template = document.createElement('div');
            template.innerHTML = TEMPLATE;
            const cropper = template.querySelector(`.${ a.NAMESPACE }-container`);
            const canvas = cropper.querySelector(`.${ a.NAMESPACE }-canvas`);
            const dragBox = cropper.querySelector(`.${ a.NAMESPACE }-drag-box`);
            const cropBox = cropper.querySelector(`.${ a.NAMESPACE }-crop-box`);
            const face = cropBox.querySelector(`.${ a.NAMESPACE }-face`);
            this.container = container;
            this.cropper = cropper;
            this.canvas = canvas;
            this.dragBox = dragBox;
            this.cropBox = cropBox;
            this.viewBox = cropper.querySelector(`.${ a.NAMESPACE }-view-box`);
            this.face = face;
            canvas.appendChild(image);
            b.addClass(element, a.CLASS_HIDDEN);
            container.insertBefore(cropper, element.nextSibling);
            if (!this.isImg) {
                b.removeClass(image, a.CLASS_HIDE);
            }
            this.initPreview();
            this.bind();
            options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
            options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
            options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
            b.addClass(cropBox, a.CLASS_HIDDEN);
            if (!options.guides) {
                b.addClass(cropBox.getElementsByClassName(`${ a.NAMESPACE }-dashed`), a.CLASS_HIDDEN);
            }
            if (!options.center) {
                b.addClass(cropBox.getElementsByClassName(`${ a.NAMESPACE }-center`), a.CLASS_HIDDEN);
            }
            if (options.background) {
                b.addClass(cropper, `${ a.NAMESPACE }-bg`);
            }
            if (!options.highlight) {
                b.addClass(face, a.CLASS_INVISIBLE);
            }
            if (options.cropBoxMovable) {
                b.addClass(face, a.CLASS_MOVE);
                b.setData(face, a.DATA_ACTION, a.ACTION_ALL);
            }
            if (!options.cropBoxResizable) {
                b.addClass(cropBox.getElementsByClassName(`${ a.NAMESPACE }-line`), a.CLASS_HIDDEN);
                b.addClass(cropBox.getElementsByClassName(`${ a.NAMESPACE }-point`), a.CLASS_HIDDEN);
            }
            this.render();
            this.ready = true;
            this.setDragMode(options.dragMode);
            if (options.autoCrop) {
                this.crop();
            }
            this.undefined(options.data);
            if (b.isFunction(options.ready)) {
                b.addListener(element, a.EVENT_READY, options.ready, { once: true });
            }
            b.dispatchEvent(element, a.EVENT_READY);
        }
        unbuild() {
            if (!this.ready) {
                return;
            }
            this.ready = false;
            this.unbind();
            this.resetPreview();
            this.cropper.parentNode.removeChild(this.cropper);
            b.removeClass(this.element, a.CLASS_HIDDEN);
        }
        uncreate() {
            if (this.ready) {
                this.unbuild();
                this.ready = false;
                this.cropped = false;
            } else if (this.sizing) {
                this.sizingImage.onload = null;
                this.sizing = false;
                this.sized = false;
            } else if (this.reloading) {
                this.xhr.onabort = null;
                this.xhr.abort();
            } else if (this.image) {
                this.stop();
            }
        }
        static noConflict() {
            window.Cropper = AnotherCropper;
            return Cropper;
        }
        static setDefaults(options) {
            b.assign(DEFAULTS, b.isPlainObject(options) && options);
        }
    }
    b.assign(Cropper.prototype, render, preview, events, handlers, change, methods);
    return skylark.attach('intg.Cropper', Cropper);
});
define('skylark-cropperjs/main',[
	"./Cropper"
],function(Cropper){
	return Cropper;
});
define('skylark-cropperjs', ['skylark-cropperjs/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-cropperjs.js.map
