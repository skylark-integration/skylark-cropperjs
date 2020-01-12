define([
    './constants',
    './utilities'
], function (constants, utilities) {
    'use strict';
    return {
        bind() {
            const {element, options, cropper} = this;
            if (utilities.isFunction(options.cropstart)) {
                utilities.addListener(element, constants.EVENT_CROP_START, options.cropstart);
            }
            if (utilities.isFunction(options.cropmove)) {
                utilities.addListener(element, constants.EVENT_CROP_MOVE, options.cropmove);
            }
            if (utilities.isFunction(options.cropend)) {
                utilities.addListener(element, constants.EVENT_CROP_END, options.cropend);
            }
            if (utilities.isFunction(options.crop)) {
                utilities.addListener(element, constants.EVENT_CROP, options.crop);
            }
            if (utilities.isFunction(options.zoom)) {
                utilities.addListener(element, constants.EVENT_ZOOM, options.zoom);
            }
            utilities.addListener(cropper, constants.EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));
            if (options.zoomable && options.zoomOnWheel) {
                utilities.addListener(cropper, constants.EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
                    passive: false,
                    capture: true
                });
            }
            if (options.toggleDragModeOnDblclick) {
                utilities.addListener(cropper, constants.EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
            }
            utilities.addListener(element.ownerDocument, constants.EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
            utilities.addListener(element.ownerDocument, constants.EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));
            if (options.responsive) {
                utilities.addListener(window, constants.EVENT_RESIZE, this.onResize = this.resize.bind(this));
            }
        },
        unbind() {
            const {element, options, cropper} = this;
            if (utilities.isFunction(options.cropstart)) {
                utilities.removeListener(element, constants.EVENT_CROP_START, options.cropstart);
            }
            if (utilities.isFunction(options.cropmove)) {
                utilities.removeListener(element, constants.EVENT_CROP_MOVE, options.cropmove);
            }
            if (utilities.isFunction(options.cropend)) {
                utilities.removeListener(element, constants.EVENT_CROP_END, options.cropend);
            }
            if (utilities.isFunction(options.crop)) {
                utilities.removeListener(element, constants.EVENT_CROP, options.crop);
            }
            if (utilities.isFunction(options.zoom)) {
                utilities.removeListener(element, constants.EVENT_ZOOM, options.zoom);
            }
            utilities.removeListener(cropper, constants.EVENT_POINTER_DOWN, this.onCropStart);
            if (options.zoomable && options.zoomOnWheel) {
                utilities.removeListener(cropper, constants.EVENT_WHEEL, this.onWheel, {
                    passive: false,
                    capture: true
                });
            }
            if (options.toggleDragModeOnDblclick) {
                utilities.removeListener(cropper, constants.EVENT_DBLCLICK, this.onDblclick);
            }
            utilities.removeListener(element.ownerDocument, constants.EVENT_POINTER_MOVE, this.onCropMove);
            utilities.removeListener(element.ownerDocument, constants.EVENT_POINTER_UP, this.onCropEnd);
            if (options.responsive) {
                utilities.removeListener(window, constants.EVENT_RESIZE, this.onResize);
            }
        }
    };
});