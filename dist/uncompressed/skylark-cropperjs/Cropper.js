define([
    'skylark-langx-ns',
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
], function (skylark, DEFAULTS, TEMPLATE, render, preview, events, handlers, change, methods, constants, utilities) {
    'use strict';
    const AnotherCropper = constants.WINDOW.Cropper;
    class Cropper {
        constructor(element, options = {}) {
            if (!element || !constants.REGEXP_TAG_NAME.test(element.tagName)) {
                throw new Error('The first argument is required and must be an <img> or <canvas> element.');
            }
            this.element = element;
            this.options = utilities.assign({}, DEFAULTS, utilities.isPlainObject(options) && options);
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
            if (element[constants.NAMESPACE]) {
                return;
            }
            element[constants.NAMESPACE] = this;
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
            if (constants.REGEXP_DATA_URL.test(url)) {
                if (constants.REGEXP_DATA_URL_JPEG.test(url)) {
                    this.read(utilities.dataURLToArrayBuffer(url));
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
                if (xhr.getResponseHeader('content-type') !== constants.MIME_TYPE_JPEG) {
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
            if (options.checkCrossOrigin && utilities.isCrossOriginURL(url) && element.crossOrigin) {
                url = utilities.addTimestamp(url);
            }
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.withCredentials = element.crossOrigin === 'use-credentials';
            xhr.send();
        }
        read(arrayBuffer) {
            const {options, imageData} = this;
            const orientation = utilities.resetAndGetOrientation(arrayBuffer);
            let rotate = 0;
            let scaleX = 1;
            let scaleY = 1;
            if (orientation > 1) {
                this.url = utilities.arrayBufferToDataURL(arrayBuffer, constants.MIME_TYPE_JPEG);
                ({rotate, scaleX, scaleY} = utilities.parseOrientation(orientation));
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
            if (this.options.checkCrossOrigin && utilities.isCrossOriginURL(url)) {
                if (!crossOrigin) {
                    crossOrigin = 'anonymous';
                }
                crossOriginUrl = utilities.addTimestamp(url);
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
            utilities.addClass(image, constants.CLASS_HIDE);
            element.parentNode.insertBefore(image, element.nextSibling);
        }
        start() {
            const {image} = this;
            image.onload = null;
            image.onerror = null;
            this.sizing = true;
            const isIOSWebKit = constants.WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(constants.WINDOW.navigator.userAgent);
            const done = (naturalWidth, naturalHeight) => {
                utilities.assign(this.imageData, {
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
            const cropper = template.querySelector(`.${ constants.NAMESPACE }-container`);
            const canvas = cropper.querySelector(`.${ constants.NAMESPACE }-canvas`);
            const dragBox = cropper.querySelector(`.${ constants.NAMESPACE }-drag-box`);
            const cropBox = cropper.querySelector(`.${ constants.NAMESPACE }-crop-box`);
            const face = cropBox.querySelector(`.${ constants.NAMESPACE }-face`);
            this.container = container;
            this.cropper = cropper;
            this.canvas = canvas;
            this.dragBox = dragBox;
            this.cropBox = cropBox;
            this.viewBox = cropper.querySelector(`.${ constants.NAMESPACE }-view-box`);
            this.face = face;
            canvas.appendChild(image);
            utilities.addClass(element, constants.CLASS_HIDDEN);
            container.insertBefore(cropper, element.nextSibling);
            if (!this.isImg) {
                utilities.removeClass(image, constants.CLASS_HIDE);
            }
            this.initPreview();
            this.bind();
            options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
            options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
            options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
            utilities.addClass(cropBox, constants.CLASS_HIDDEN);
            if (!options.guides) {
                utilities.addClass(cropBox.getElementsByClassName(`${ constants.NAMESPACE }-dashed`), constants.CLASS_HIDDEN);
            }
            if (!options.center) {
                utilities.addClass(cropBox.getElementsByClassName(`${ constants.NAMESPACE }-center`), constants.CLASS_HIDDEN);
            }
            if (options.background) {
                utilities.addClass(cropper, `${ constants.NAMESPACE }-bg`);
            }
            if (!options.highlight) {
                utilities.addClass(face, constants.CLASS_INVISIBLE);
            }
            if (options.cropBoxMovable) {
                utilities.addClass(face, constants.CLASS_MOVE);
                utilities.setData(face, constants.DATA_ACTION, constants.ACTION_ALL);
            }
            if (!options.cropBoxResizable) {
                utilities.addClass(cropBox.getElementsByClassName(`${ constants.NAMESPACE }-line`), constants.CLASS_HIDDEN);
                utilities.addClass(cropBox.getElementsByClassName(`${ constants.NAMESPACE }-point`), constants.CLASS_HIDDEN);
            }
            this.render();
            this.ready = true;
            this.setDragMode(options.dragMode);
            if (options.autoCrop) {
                this.crop();
            }
            this.setData(options.data);
            if (utilities.isFunction(options.ready)) {
                utilities.addListener(element, constants.EVENT_READY, options.ready, { once: true });
            }
            utilities.dispatchEvent(element, constants.EVENT_READY);
        }
        unbuild() {
            if (!this.ready) {
                return;
            }
            this.ready = false;
            this.unbind();
            this.resetPreview();
            this.cropper.parentNode.removeChild(this.cropper);
            utilities.removeClass(this.element, constants.CLASS_HIDDEN);
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
            utilities.assign(DEFAULTS, utilities.isPlainObject(options) && options);
        }
    }
    utilities.assign(Cropper.prototype, render, preview, events, handlers, change, methods);
    return skylark.attach('intg.Cropper', Cropper);
});