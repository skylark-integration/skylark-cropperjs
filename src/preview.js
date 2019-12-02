define([
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