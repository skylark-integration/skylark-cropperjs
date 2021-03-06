define([
    './constants',
    './utilities'
], function (constants, utilities) {
    'use strict';
    return {
        crop() {
            if (this.ready && !this.cropped && !this.disabled) {
                this.cropped = true;
                this.limitCropBox(true, true);
                if (this.options.modal) {
                    utilities.addClass(this.dragBox, constants.CLASS_MODAL);
                }
                utilities.removeClass(this.cropBox, constants.CLASS_HIDDEN);
                this.setCropBoxData(this.initialCropBoxData);
            }
            return this;
        },
        reset() {
            if (this.ready && !this.disabled) {
                this.imageData = utilities.assign({}, this.initialImageData);
                this.canvasData = utilities.assign({}, this.initialCanvasData);
                this.cropBoxData = utilities.assign({}, this.initialCropBoxData);
                this.renderCanvas();
                if (this.cropped) {
                    this.renderCropBox();
                }
            }
            return this;
        },
        clear() {
            if (this.cropped && !this.disabled) {
                utilities.assign(this.cropBoxData, {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                });
                this.cropped = false;
                this.renderCropBox();
                this.limitCanvas(true, true);
                this.renderCanvas();
                utilities.removeClass(this.dragBox, constants.CLASS_MODAL);
                utilities.addClass(this.cropBox, constants.CLASS_HIDDEN);
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
                        utilities.forEach(this.previews, element => {
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
                utilities.removeClass(this.cropper, constants.CLASS_DISABLED);
            }
            return this;
        },
        disable() {
            if (this.ready && !this.disabled) {
                this.disabled = true;
                utilities.addClass(this.cropper, constants.CLASS_DISABLED);
            }
            return this;
        },
        destroy() {
            const {element} = this;
            if (!element[constants.NAMESPACE]) {
                return this;
            }
            element[constants.NAMESPACE] = undefined;
            if (this.isImg && this.replaced) {
                element.src = this.originalUrl;
            }
            this.uncreate();
            return this;
        },
        move(offsetX, offsetY = offsetX) {
            const {left, top} = this.canvasData;
            return this.moveTo(utilities.isUndefined(offsetX) ? offsetX : left + Number(offsetX), utilities.isUndefined(offsetY) ? offsetY : top + Number(offsetY));
        },
        moveTo(x, y = x) {
            const {canvasData} = this;
            let changed = false;
            x = Number(x);
            y = Number(y);
            if (this.ready && !this.disabled && this.options.movable) {
                if (utilities.isNumber(x)) {
                    canvasData.left = x;
                    changed = true;
                }
                if (utilities.isNumber(y)) {
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
                if (utilities.dispatchEvent(this.element, constants.EVENT_ZOOM, {
                        ratio,
                        oldRatio: width / naturalWidth,
                        originalEvent: _originalEvent
                    }) === false) {
                    return this;
                }
                if (_originalEvent) {
                    const {pointers} = this;
                    const offset = utilities.getOffset(this.cropper);
                    const center = pointers && Object.keys(pointers).length ? utilities.getPointersCenter(pointers) : {
                        pageX: _originalEvent.pageX,
                        pageY: _originalEvent.pageY
                    };
                    canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
                    canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
                } else if (utilities.isPlainObject(pivot) && utilities.isNumber(pivot.x) && utilities.isNumber(pivot.y)) {
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
            if (utilities.isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
                this.imageData.rotate = degree % 360;
                this.renderCanvas(true, true);
            }
            return this;
        },
        scaleX(scaleX) {
            const {scaleY} = this.imageData;
            return this.scale(scaleX, utilities.isNumber(scaleY) ? scaleY : 1);
        },
        scaleY(scaleY) {
            const {scaleX} = this.imageData;
            return this.scale(utilities.isNumber(scaleX) ? scaleX : 1, scaleY);
        },
        scale(scaleX, scaleY = scaleX) {
            const {imageData} = this;
            let transformed = false;
            scaleX = Number(scaleX);
            scaleY = Number(scaleY);
            if (this.ready && !this.disabled && this.options.scalable) {
                if (utilities.isNumber(scaleX)) {
                    imageData.scaleX = scaleX;
                    transformed = true;
                }
                if (utilities.isNumber(scaleY)) {
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
                utilities.forEach(data, (n, i) => {
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
            if (this.ready && !this.disabled && utilities.isPlainObject(data)) {
                let transformed = false;
                if (options.rotatable) {
                    if (utilities.isNumber(data.rotate) && data.rotate !== imageData.rotate) {
                        imageData.rotate = data.rotate;
                        transformed = true;
                    }
                }
                if (options.scalable) {
                    if (utilities.isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
                        imageData.scaleX = data.scaleX;
                        transformed = true;
                    }
                    if (utilities.isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
                        imageData.scaleY = data.scaleY;
                        transformed = true;
                    }
                }
                if (transformed) {
                    this.renderCanvas(true, true);
                }
                const ratio = imageData.width / imageData.naturalWidth;
                if (utilities.isNumber(data.x)) {
                    cropBoxData.left = data.x * ratio + canvasData.left;
                }
                if (utilities.isNumber(data.y)) {
                    cropBoxData.top = data.y * ratio + canvasData.top;
                }
                if (utilities.isNumber(data.width)) {
                    cropBoxData.width = data.width * ratio;
                }
                if (utilities.isNumber(data.height)) {
                    cropBoxData.height = data.height * ratio;
                }
                this.setCropBoxData(cropBoxData);
            }
            return this;
        },
        getContainerData() {
            return this.ready ? utilities.assign({}, this.containerData) : {};
        },
        getImageData() {
            return this.sized ? utilities.assign({}, this.imageData) : {};
        },
        getCanvasData() {
            const {canvasData} = this;
            const data = {};
            if (this.ready) {
                utilities.forEach([
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
            if (this.ready && !this.disabled && utilities.isPlainObject(data)) {
                if (utilities.isNumber(data.left)) {
                    canvasData.left = data.left;
                }
                if (utilities.isNumber(data.top)) {
                    canvasData.top = data.top;
                }
                if (utilities.isNumber(data.width)) {
                    canvasData.width = data.width;
                    canvasData.height = data.width / aspectRatio;
                } else if (utilities.isNumber(data.height)) {
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
            if (this.ready && this.cropped && !this.disabled && utilities.isPlainObject(data)) {
                if (utilities.isNumber(data.left)) {
                    cropBoxData.left = data.left;
                }
                if (utilities.isNumber(data.top)) {
                    cropBoxData.top = data.top;
                }
                if (utilities.isNumber(data.width) && data.width !== cropBoxData.width) {
                    widthChanged = true;
                    cropBoxData.width = data.width;
                }
                if (utilities.isNumber(data.height) && data.height !== cropBoxData.height) {
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
            const source = utilities.getSourceCanvas(this.image, this.imageData, canvasData, options);
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
            const maxSizes = utilities.getAdjustedSizes({
                aspectRatio,
                width: options.maxWidth || Infinity,
                height: options.maxHeight || Infinity
            });
            const minSizes = utilities.getAdjustedSizes({
                aspectRatio,
                width: options.minWidth || 0,
                height: options.minHeight || 0
            }, 'cover');
            let {width, height} = utilities.getAdjustedSizes({
                aspectRatio,
                width: options.width || (ratio !== 1 ? source.width : initialWidth),
                height: options.height || (ratio !== 1 ? source.height : initialHeight)
            });
            width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
            height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = utilities.normalizeDecimalNumber(width);
            canvas.height = utilities.normalizeDecimalNumber(height);
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
            context.drawImage(source, ...params.map(param => Math.floor(utilities.normalizeDecimalNumber(param))));
            return canvas;
        },
        setAspectRatio(aspectRatio) {
            const {options} = this;
            if (!this.disabled && !utilities.isUndefined(aspectRatio)) {
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
                const croppable = mode === constants.DRAG_MODE_CROP;
                const movable = options.movable && mode === constants.DRAG_MODE_MOVE;
                mode = croppable || movable ? mode : constants.DRAG_MODE_NONE;
                options.dragMode = mode;
                utilities.setData(dragBox, constants.DATA_ACTION, mode);
                utilities.toggleClass(dragBox, constants.CLASS_CROP, croppable);
                utilities.toggleClass(dragBox, constants.CLASS_MOVE, movable);
                if (!options.cropBoxMovable) {
                    utilities.setData(face, constants.DATA_ACTION, mode);
                    utilities.toggleClass(face, constants.CLASS_CROP, croppable);
                    utilities.toggleClass(face, constants.CLASS_MOVE, movable);
                }
            }
            return this;
        }
    };
});