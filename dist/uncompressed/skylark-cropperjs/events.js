define([
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