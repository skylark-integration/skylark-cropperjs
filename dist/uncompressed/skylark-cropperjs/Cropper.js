define([
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