define([
    './constants',
    './utilities'
], function (constants, utilities) {
    'use strict';
    return {
        resize() {
            const {options, container, containerData} = this;
            const minContainerWidth = Number(options.minContainerWidth) || constants.MIN_CONTAINER_WIDTH;
            const minContainerHeight = Number(options.minContainerHeight) || constants.MIN_CONTAINER_HEIGHT;
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
                    this.setCanvasData(utilities.forEach(canvasData, (n, i) => {
                        canvasData[i] = n * ratio;
                    }));
                    this.setCropBoxData(utilities.forEach(cropBoxData, (n, i) => {
                        cropBoxData[i] = n * ratio;
                    }));
                }
            }
        },
        dblclick() {
            if (this.disabled || this.options.dragMode === constants.DRAG_MODE_NONE) {
                return;
            }
            this.setDragMode(utilities.hasClass(this.dragBox, constants.CLASS_CROP) ? constants.DRAG_MODE_MOVE : constants.DRAG_MODE_CROP);
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
            if (this.disabled || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && (utilities.isNumber(buttons) && buttons !== 1 || utilities.isNumber(button) && button !== 0 || event.ctrlKey)) {
                return;
            }
            const {options, pointers} = this;
            let action;
            if (event.changedTouches) {
                utilities.forEach(event.changedTouches, touch => {
                    pointers[touch.identifier] = utilities.getPointer(touch);
                });
            } else {
                pointers[event.pointerId || 0] = utilities.getPointer(event);
            }
            if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
                action = constants.ACTION_ZOOM;
            } else {
                action = utilities.getData(event.target, constants.DATA_ACTION);
            }
            if (!constants.REGEXP_ACTIONS.test(action)) {
                return;
            }
            if (utilities.dispatchEvent(this.element, constants.EVENT_CROP_START, {
                    originalEvent: event,
                    action
                }) === false) {
                return;
            }
            event.preventDefault();
            this.action = action;
            this.cropping = false;
            if (action === constants.ACTION_CROP) {
                this.cropping = true;
                utilities.addClass(this.dragBox, constants.CLASS_MODAL);
            }
        },
        cropMove(event) {
            const {action} = this;
            if (this.disabled || !action) {
                return;
            }
            const {pointers} = this;
            event.preventDefault();
            if (utilities.dispatchEvent(this.element, constants.EVENT_CROP_MOVE, {
                    originalEvent: event,
                    action
                }) === false) {
                return;
            }
            if (event.changedTouches) {
                utilities.forEach(event.changedTouches, touch => {
                    utilities.assign(pointers[touch.identifier] || {}, utilities.getPointer(touch, true));
                });
            } else {
                utilities.assign(pointers[event.pointerId || 0] || {}, utilities.getPointer(event, true));
            }
            this.change(event);
        },
        cropEnd(event) {
            if (this.disabled) {
                return;
            }
            const {action, pointers} = this;
            if (event.changedTouches) {
                utilities.forEach(event.changedTouches, touch => {
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
                utilities.toggleClass(this.dragBox, constants.CLASS_MODAL, this.cropped && this.options.modal);
            }
            utilities.dispatchEvent(this.element, constants.EVENT_CROP_END, {
                originalEvent: event,
                action
            });
        }
    };
});