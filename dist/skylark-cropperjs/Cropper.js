/**
 * skylark-cropperjs - A version of cropperjs that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-cropperjs/
 * @license MIT
 */
define(["skylark-langx/skylark","./defaults","./template","./render","./preview","./events","./handlers","./change","./methods","./constants","./utilities"],function(t,e,i,s,a,n,r,o,l,d,h){"use strict";const c=d.WINDOW.Cropper;class g{constructor(t,i={}){if(!t||!d.REGEXP_TAG_NAME.test(t.tagName))throw new Error("The first argument is required and must be an <img> or <canvas> element.");this.element=t,this.options=h.assign({},e,h.isPlainObject(i)&&i),this.cropped=!1,this.disabled=!1,this.pointers={},this.ready=!1,this.reloading=!1,this.replaced=!1,this.sized=!1,this.sizing=!1,this.init()}init(){const{element:t}=this,e=t.tagName.toLowerCase();let i;if(!t[d.NAMESPACE]){if(t[d.NAMESPACE]=this,"img"===e){if(this.isImg=!0,i=t.getAttribute("src")||"",this.originalUrl=i,!i)return;i=t.src}else"canvas"===e&&window.HTMLCanvasElement&&(i=t.toDataURL());this.load(i)}}load(t){if(!t)return;this.url=t,this.imageData={};const{element:e,options:i}=this;if(i.rotatable||i.scalable||(i.checkOrientation=!1),!i.checkOrientation||!window.ArrayBuffer)return void this.clone();if(d.REGEXP_DATA_URL.test(t))return void(d.REGEXP_DATA_URL_JPEG.test(t)?this.read(h.dataURLToArrayBuffer(t)):this.clone());const s=new XMLHttpRequest,a=this.clone.bind(this);this.reloading=!0,this.xhr=s,s.onabort=a,s.onerror=a,s.ontimeout=a,s.onprogress=(()=>{s.getResponseHeader("content-type")!==d.MIME_TYPE_JPEG&&s.abort()}),s.onload=(()=>{this.read(s.response)}),s.onloadend=(()=>{this.reloading=!1,this.xhr=null}),i.checkCrossOrigin&&h.isCrossOriginURL(t)&&e.crossOrigin&&(t=h.addTimestamp(t)),s.open("GET",t),s.responseType="arraybuffer",s.withCredentials="use-credentials"===e.crossOrigin,s.send()}read(t){const{options:e,imageData:i}=this,s=h.resetAndGetOrientation(t);let a=0,n=1,r=1;s>1&&(this.url=h.arrayBufferToDataURL(t,d.MIME_TYPE_JPEG),({rotate:a,scaleX:n,scaleY:r}=h.parseOrientation(s))),e.rotatable&&(i.rotate=a),e.scalable&&(i.scaleX=n,i.scaleY=r),this.clone()}clone(){const{element:t,url:e}=this;let{crossOrigin:i}=t,s=e;this.options.checkCrossOrigin&&h.isCrossOriginURL(e)&&(i||(i="anonymous"),s=h.addTimestamp(e)),this.crossOrigin=i,this.crossOriginUrl=s;const a=document.createElement("img");i&&(a.crossOrigin=i),a.src=s||e,a.alt=t.alt||"The image to crop",this.image=a,a.onload=this.start.bind(this),a.onerror=this.stop.bind(this),h.addClass(a,d.CLASS_HIDE),t.parentNode.insertBefore(a,t.nextSibling)}start(){const{image:t}=this;t.onload=null,t.onerror=null,this.sizing=!0;const e=d.WINDOW.navigator&&/(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(d.WINDOW.navigator.userAgent),i=(t,e)=>{h.assign(this.imageData,{naturalWidth:t,naturalHeight:e,aspectRatio:t/e}),this.sizing=!1,this.sized=!0,this.build()};if(t.naturalWidth&&!e)return void i(t.naturalWidth,t.naturalHeight);const s=document.createElement("img"),a=document.body||document.documentElement;this.sizingImage=s,s.onload=(()=>{i(s.width,s.height),e||a.removeChild(s)}),s.src=t.src,e||(s.style.cssText="left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;",a.appendChild(s))}stop(){const{image:t}=this;t.onload=null,t.onerror=null,t.parentNode.removeChild(t),this.image=null}build(){if(!this.sized||this.ready)return;const{element:t,options:e,image:s}=this,a=t.parentNode,n=document.createElement("div");n.innerHTML=i;const r=n.querySelector(`.${d.NAMESPACE}-container`),o=r.querySelector(`.${d.NAMESPACE}-canvas`),l=r.querySelector(`.${d.NAMESPACE}-drag-box`),c=r.querySelector(`.${d.NAMESPACE}-crop-box`),g=c.querySelector(`.${d.NAMESPACE}-face`);this.container=a,this.cropper=r,this.canvas=o,this.dragBox=l,this.cropBox=c,this.viewBox=r.querySelector(`.${d.NAMESPACE}-view-box`),this.face=g,o.appendChild(s),h.addClass(t,d.CLASS_HIDDEN),a.insertBefore(r,t.nextSibling),this.isImg||h.removeClass(s,d.CLASS_HIDE),this.initPreview(),this.bind(),e.initialAspectRatio=Math.max(0,e.initialAspectRatio)||NaN,e.aspectRatio=Math.max(0,e.aspectRatio)||NaN,e.viewMode=Math.max(0,Math.min(3,Math.round(e.viewMode)))||0,h.addClass(c,d.CLASS_HIDDEN),e.guides||h.addClass(c.getElementsByClassName(`${d.NAMESPACE}-dashed`),d.CLASS_HIDDEN),e.center||h.addClass(c.getElementsByClassName(`${d.NAMESPACE}-center`),d.CLASS_HIDDEN),e.background&&h.addClass(r,`${d.NAMESPACE}-bg`),e.highlight||h.addClass(g,d.CLASS_INVISIBLE),e.cropBoxMovable&&(h.addClass(g,d.CLASS_MOVE),h.setData(g,d.DATA_ACTION,d.ACTION_ALL)),e.cropBoxResizable||(h.addClass(c.getElementsByClassName(`${d.NAMESPACE}-line`),d.CLASS_HIDDEN),h.addClass(c.getElementsByClassName(`${d.NAMESPACE}-point`),d.CLASS_HIDDEN)),this.render(),this.ready=!0,this.setDragMode(e.dragMode),e.autoCrop&&this.crop(),this.undefined(e.data),h.isFunction(e.ready)&&h.addListener(t,d.EVENT_READY,e.ready,{once:!0}),h.dispatchEvent(t,d.EVENT_READY)}unbuild(){this.ready&&(this.ready=!1,this.unbind(),this.resetPreview(),this.cropper.parentNode.removeChild(this.cropper),h.removeClass(this.element,d.CLASS_HIDDEN))}uncreate(){this.ready?(this.unbuild(),this.ready=!1,this.cropped=!1):this.sizing?(this.sizingImage.onload=null,this.sizing=!1,this.sized=!1):this.reloading?(this.xhr.onabort=null,this.xhr.abort()):this.image&&this.stop()}static noConflict(){return window.Cropper=c,g}static setDefaults(t){h.assign(e,h.isPlainObject(t)&&t)}}return h.assign(g.prototype,s,a,n,r,o,l),t.attach("intg.Cropper",g)});
//# sourceMappingURL=sourcemaps/Cropper.js.map