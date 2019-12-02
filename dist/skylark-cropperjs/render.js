/**
 * skylark-cropperjs - A version of cropperjs that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-cropperjs/
 * @license MIT
 */
define(["./constants","./utilities"],function(t,i){"use strict";return{render(){this.initContainer(),this.initCanvas(),this.initCropBox(),this.renderCanvas(),this.cropped&&this.renderCropBox()},initContainer(){const{element:h,options:a,container:e,cropper:n}=this;i.addClass(n,t.CLASS_HIDDEN),i.removeClass(h,t.CLASS_HIDDEN);const o={width:Math.max(e.offsetWidth,Number(a.minContainerWidth)||200),height:Math.max(e.offsetHeight,Number(a.minContainerHeight)||100)};this.containerData=o,i.setStyle(n,{width:o.width,height:o.height}),i.addClass(h,t.CLASS_HIDDEN),i.removeClass(n,t.CLASS_HIDDEN)},initCanvas(){const{containerData:t,imageData:h}=this,{viewMode:a}=this.options,e=Math.abs(h.rotate)%180==90,n=e?h.naturalHeight:h.naturalWidth,o=e?h.naturalWidth:h.naturalHeight,m=n/o;let s=t.width,d=t.height;t.height*m>t.width?3===a?s=t.height*m:d=t.width/m:3===a?d=t.width/m:s=t.height*m;const g={aspectRatio:m,naturalWidth:n,naturalHeight:o,width:s,height:d};g.left=(t.width-s)/2,g.top=(t.height-d)/2,g.oldLeft=g.left,g.oldTop=g.top,this.canvasData=g,this.limited=1===a||2===a,this.limitCanvas(!0,!0),this.initialImageData=i.assign({},h),this.initialCanvasData=i.assign({},g)},limitCanvas(t,h){const{options:a,containerData:e,canvasData:n,cropBoxData:o}=this,{viewMode:m}=a,{aspectRatio:s}=n,d=this.cropped&&o;if(t){let t=Number(a.minCanvasWidth)||0,h=Number(a.minCanvasHeight)||0;m>1?(t=Math.max(t,e.width),h=Math.max(h,e.height),3===m&&(h*s>t?t=h*s:h=t/s)):m>0&&(t?t=Math.max(t,d?o.width:0):h?h=Math.max(h,d?o.height:0):d&&(t=o.width,(h=o.height)*s>t?t=h*s:h=t/s)),({width:t,height:h}=i.getAdjustedSizes({aspectRatio:s,width:t,height:h})),n.minWidth=t,n.minHeight=h,n.maxWidth=1/0,n.maxHeight=1/0}if(h)if(m>(d?0:1)){const t=e.width-n.width,i=e.height-n.height;n.minLeft=Math.min(0,t),n.minTop=Math.min(0,i),n.maxLeft=Math.max(0,t),n.maxTop=Math.max(0,i),d&&this.limited&&(n.minLeft=Math.min(o.left,o.left+(o.width-n.width)),n.minTop=Math.min(o.top,o.top+(o.height-n.height)),n.maxLeft=o.left,n.maxTop=o.top,2===m&&(n.width>=e.width&&(n.minLeft=Math.min(0,t),n.maxLeft=Math.max(0,t)),n.height>=e.height&&(n.minTop=Math.min(0,i),n.maxTop=Math.max(0,i))))}else n.minLeft=-n.width,n.minTop=-n.height,n.maxLeft=e.width,n.maxTop=e.height},renderCanvas(t,h){const{canvasData:a,imageData:e}=this;if(h){const{width:t,height:h}=i.getRotatedSizes({width:e.naturalWidth*Math.abs(e.scaleX||1),height:e.naturalHeight*Math.abs(e.scaleY||1),degree:e.rotate||0}),n=a.width*(t/a.naturalWidth),o=a.height*(h/a.naturalHeight);a.left-=(n-a.width)/2,a.top-=(o-a.height)/2,a.width=n,a.height=o,a.aspectRatio=t/h,a.naturalWidth=t,a.naturalHeight=h,this.limitCanvas(!0,!1)}(a.width>a.maxWidth||a.width<a.minWidth)&&(a.left=a.oldLeft),(a.height>a.maxHeight||a.height<a.minHeight)&&(a.top=a.oldTop),a.width=Math.min(Math.max(a.width,a.minWidth),a.maxWidth),a.height=Math.min(Math.max(a.height,a.minHeight),a.maxHeight),this.limitCanvas(!1,!0),a.left=Math.min(Math.max(a.left,a.minLeft),a.maxLeft),a.top=Math.min(Math.max(a.top,a.minTop),a.maxTop),a.oldLeft=a.left,a.oldTop=a.top,i.setStyle(this.canvas,i.assign({width:a.width,height:a.height},i.getTransforms({translateX:a.left,translateY:a.top}))),this.renderImage(t),this.cropped&&this.limited&&this.limitCropBox(!0,!0)},renderImage(t){const{canvasData:h,imageData:a}=this,e=a.naturalWidth*(h.width/h.naturalWidth),n=a.naturalHeight*(h.height/h.naturalHeight);i.assign(a,{width:e,height:n,left:(h.width-e)/2,top:(h.height-n)/2}),i.setStyle(this.image,i.assign({width:a.width,height:a.height},i.getTransforms(i.assign({translateX:a.left,translateY:a.top},a)))),t&&this.output()},initCropBox(){const{options:t,canvasData:h}=this,a=t.aspectRatio||t.initialAspectRatio,e=Number(t.autoCropArea)||.8,n={width:h.width,height:h.height};a&&(h.height*a>h.width?n.height=n.width/a:n.width=n.height*a),this.cropBoxData=n,this.limitCropBox(!0,!0),n.width=Math.min(Math.max(n.width,n.minWidth),n.maxWidth),n.height=Math.min(Math.max(n.height,n.minHeight),n.maxHeight),n.width=Math.max(n.minWidth,n.width*e),n.height=Math.max(n.minHeight,n.height*e),n.left=h.left+(h.width-n.width)/2,n.top=h.top+(h.height-n.height)/2,n.oldLeft=n.left,n.oldTop=n.top,this.initialCropBoxData=i.assign({},n)},limitCropBox(t,i){const{options:h,containerData:a,canvasData:e,cropBoxData:n,limited:o}=this,{aspectRatio:m}=h;if(t){let t=Number(h.minCropBoxWidth)||0,i=Number(h.minCropBoxHeight)||0,s=o?Math.min(a.width,e.width,e.width+e.left,a.width-e.left):a.width,d=o?Math.min(a.height,e.height,e.height+e.top,a.height-e.top):a.height;t=Math.min(t,a.width),i=Math.min(i,a.height),m&&(t&&i?i*m>t?i=t/m:t=i*m:t?i=t/m:i&&(t=i*m),d*m>s?d=s/m:s=d*m),n.minWidth=Math.min(t,s),n.minHeight=Math.min(i,d),n.maxWidth=s,n.maxHeight=d}i&&(o?(n.minLeft=Math.max(0,e.left),n.minTop=Math.max(0,e.top),n.maxLeft=Math.min(a.width,e.left+e.width)-n.width,n.maxTop=Math.min(a.height,e.top+e.height)-n.height):(n.minLeft=0,n.minTop=0,n.maxLeft=a.width-n.width,n.maxTop=a.height-n.height))},renderCropBox(){const{options:h,containerData:a,cropBoxData:e}=this;(e.width>e.maxWidth||e.width<e.minWidth)&&(e.left=e.oldLeft),(e.height>e.maxHeight||e.height<e.minHeight)&&(e.top=e.oldTop),e.width=Math.min(Math.max(e.width,e.minWidth),e.maxWidth),e.height=Math.min(Math.max(e.height,e.minHeight),e.maxHeight),this.limitCropBox(!1,!0),e.left=Math.min(Math.max(e.left,e.minLeft),e.maxLeft),e.top=Math.min(Math.max(e.top,e.minTop),e.maxTop),e.oldLeft=e.left,e.oldTop=e.top,h.movable&&h.cropBoxMovable&&i.setData(this.face,t.DATA_ACTION,e.width>=a.width&&e.height>=a.height?t.ACTION_MOVE:t.ACTION_ALL),i.setStyle(this.cropBox,i.assign({width:e.width,height:e.height},i.getTransforms({translateX:e.left,translateY:e.top}))),this.cropped&&this.limited&&this.limitCanvas(!0,!0),this.disabled||this.output()},output(){this.preview(),i.dispatchEvent(this.element,t.EVENT_CROP,this.getData())}}});
//# sourceMappingURL=sourcemaps/render.js.map