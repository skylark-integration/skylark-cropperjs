define([
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