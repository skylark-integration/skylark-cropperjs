define([
    './constants',
    './utilities'
], function (constants, utilities) {
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
            utilities.addClass(cropper, constants.CLASS_HIDDEN);
            utilities.removeClass(element, constants.CLASS_HIDDEN);
            const containerData = {
                width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
                height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
            };
            this.containerData = containerData;
            utilities.setStyle(cropper, {
                width: containerData.width,
                height: containerData.height
            });
            utilities.addClass(element, constants.CLASS_HIDDEN);
            utilities.removeClass(cropper, constants.CLASS_HIDDEN);
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
            this.initialImageData = utilities.assign({}, imageData);
            this.initialCanvasData = utilities.assign({}, canvasData);
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
                } = utilities.getAdjustedSizes({
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
                } = utilities.getRotatedSizes({
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
            utilities.setStyle(this.canvas, utilities.assign({
                width: canvasData.width,
                height: canvasData.height
            }, utilities.getTransforms({
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
            utilities.assign(imageData, {
                width,
                height,
                left: (canvasData.width - width) / 2,
                top: (canvasData.height - height) / 2
            });
            utilities.setStyle(this.image, utilities.assign({
                width: imageData.width,
                height: imageData.height
            }, utilities.getTransforms(utilities.assign({
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
            this.initialCropBoxData = utilities.assign({}, cropBoxData);
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
                utilities.setData(this.face, constants.DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? constants.ACTION_MOVE : constants.ACTION_ALL);
            }
            utilities.setStyle(this.cropBox, utilities.assign({
                width: cropBoxData.width,
                height: cropBoxData.height
            }, utilities.getTransforms({
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
            utilities.dispatchEvent(this.element, constants.EVENT_CROP, this.getData());
        }
    };
});