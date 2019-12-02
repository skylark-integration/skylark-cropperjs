define(function () {
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