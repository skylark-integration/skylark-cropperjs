/**
 * skylark-cropperjs - A version of cropperjs that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-cropperjs/
 * @license MIT
 */
define(["./constants"],function(t){"use strict";var e=Number.isNaN||WINDOW.isNaN;function a(t){return"number"==typeof t&&!e(t)}var n=function(t){return t>0&&t<1/0};function r(t){return"object"===_typeof(t)&&null!==t}var i=Object.prototype.hasOwnProperty;function o(t){return"function"==typeof t}var s=Array.prototype.slice;function c(t){return Array.from?Array.from(t):s.call(t)}function u(t,e){return t&&o(e)&&(Array.isArray(t)||a(t.length)?c(t).forEach(function(a,n){e.call(t,a,n,t)}):r(t)&&Object.keys(t).forEach(function(a){e.call(t,t[a],a,t)})),t}var f=Object.assign||function(t){for(var e=arguments.length,a=new Array(e>1?e-1:0),n=1;n<e;n++)a[n-1]=arguments[n];return r(t)&&a.length>0&&a.forEach(function(e){r(e)&&Object.keys(e).forEach(function(a){t[a]=e[a]})}),t},h=/\.\d*(?:0|9){12}\d*$/;function l(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e11;return h.test(t)?Math.round(t*e)/e:t}var d=/^width|height|left|top|marginLeft|marginTop$/;function v(t,e){if(e)if(a(t.length))u(t,function(t){v(t,e)});else if(t.classList)t.classList.add(e);else{var n=t.className.trim();n?n.indexOf(e)<0&&(t.className="".concat(n," ").concat(e)):t.className=e}}function g(t,e){e&&(a(t.length)?u(t,function(t){g(t,e)}):t.classList?t.classList.remove(e):t.className.indexOf(e)>=0&&(t.className=t.className.replace(e,"")))}var m=/([a-z\d])([A-Z])/g;function p(t){return t.replace(m,"$1-$2").toLowerCase()}var b=/\s\s*/,y=function(){var t=!1;if(IS_BROWSER){var e=!1,a=function(){},n=Object.defineProperty({},"once",{get:function(){return t=!0,e},set:function(t){e=t}});WINDOW.addEventListener("test",a,n),WINDOW.removeEventListener("test",a,n)}return t}();var w=WINDOW.location,E=/^(\w+:)\/\/([^:/?#]*):?(\d*)/i;function O(t){var e=t.aspectRatio,a=t.height,r=t.width,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"contain",o=n(r),s=n(a);if(o&&s){var c=a*e;"contain"===i&&c>r||"cover"===i&&c<r?a=r/e:r=a*e}else o?a=r/e:s&&(r=a*e);return{width:r,height:a}}var M=String.fromCharCode;function C(t,e,a){var n="";a+=e;for(var r=e;r<a;r+=1)n+=M(t.getUint8(r));return n}var L=/^data:.*,/;return{isNaN:e,isNumber:a,isPositiveNumber:n,isUndefined:function(t){return void 0===t},isObject:r,isPlainObject:function(t){if(!r(t))return!1;try{var e=t.constructor,a=e.prototype;return e&&a&&i.call(a,"isPrototypeOf")}catch(t){return!1}},isFunction:o,toArray:c,forEach:u,assign:f,normalizeDecimalNumber:l,setStyle:function(t,e){var n=t.style;u(e,function(t,e){d.test(e)&&a(t)&&(t="".concat(t,"px")),n[e]=t})},hasClass:function(t,e){return t.classList?t.classList.contains(e):t.className.indexOf(e)>-1},addClass:v,removeClass:g,toggleClass:function t(e,n,r){n&&(a(e.length)?u(e,function(e){t(e,n,r)}):r?v(e,n):g(e,n))},toParamCase:p,getData:function(t,e){return r(t[e])?t[e]:t.dataset?t.dataset[e]:t.getAttribute("data-".concat(p(e)))},setData:function(t,e,a){r(a)?t[e]=a:t.dataset?t.dataset[e]=a:t.setAttribute("data-".concat(p(e)),a)},removeData:function(t,e){if(r(t[e]))try{delete t[e]}catch(a){t[e]=void 0}else if(t.dataset)try{delete t.dataset[e]}catch(a){t.dataset[e]=void 0}else t.removeAttribute("data-".concat(p(e)))},removeListener:function(t,e,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r=a;e.trim().split(b).forEach(function(e){if(!y){var i=t.listeners;i&&i[e]&&i[e][a]&&(r=i[e][a],delete i[e][a],0===Object.keys(i[e]).length&&delete i[e],0===Object.keys(i).length&&delete t.listeners)}t.removeEventListener(e,r,n)})},addListener:function(t,e,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r=a;e.trim().split(b).forEach(function(e){if(n.once&&!y){var i=t.listeners,o=void 0===i?{}:i;r=function(){delete o[e][a],t.removeEventListener(e,r,n);for(var i=arguments.length,s=new Array(i),c=0;c<i;c++)s[c]=arguments[c];a.apply(t,s)},o[e]||(o[e]={}),o[e][a]&&t.removeEventListener(e,o[e][a],n),o[e][a]=r,t.listeners=o}t.addEventListener(e,r,n)})},dispatchEvent:function(t,e,a){var n;return o(Event)&&o(CustomEvent)?n=new CustomEvent(e,{detail:a,bubbles:!0,cancelable:!0}):(n=document.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,a),t.dispatchEvent(n)},getOffset:function(t){var e=t.getBoundingClientRect();return{left:e.left+(window.pageXOffset-document.documentElement.clientLeft),top:e.top+(window.pageYOffset-document.documentElement.clientTop)}},isCrossOriginURL:function(t){var e=t.match(E);return null!==e&&(e[1]!==w.protocol||e[2]!==w.hostname||e[3]!==w.port)},addTimestamp:function(t){var e="timestamp=".concat((new Date).getTime());return t+(-1===t.indexOf("?")?"?":"&")+e},getTransforms:function(t){var e=t.rotate,n=t.scaleX,r=t.scaleY,i=t.translateX,o=t.translateY,s=[];a(i)&&0!==i&&s.push("translateX(".concat(i,"px)")),a(o)&&0!==o&&s.push("translateY(".concat(o,"px)")),a(e)&&0!==e&&s.push("rotate(".concat(e,"deg)")),a(n)&&1!==n&&s.push("scaleX(".concat(n,")")),a(r)&&1!==r&&s.push("scaleY(".concat(r,")"));var c=s.length?s.join(" "):"none";return{WebkitTransform:c,msTransform:c,transform:c}},getMaxZoomRatio:function(t){var e=_objectSpread2({},t),a=[];return u(t,function(t,n){delete e[n],u(e,function(e){var n=Math.abs(t.startX-e.startX),r=Math.abs(t.startY-e.startY),i=Math.abs(t.endX-e.endX),o=Math.abs(t.endY-e.endY),s=Math.sqrt(n*n+r*r),c=(Math.sqrt(i*i+o*o)-s)/s;a.push(c)})}),a.sort(function(t,e){return Math.abs(t)<Math.abs(e)}),a[0]},getPointer:function(t,e){var a=t.pageX,n=t.pageY,r={endX:a,endY:n};return e?r:_objectSpread2({startX:a,startY:n},r)},getPointersCenter:function(t){var e=0,a=0,n=0;return u(t,function(t){var r=t.startX,i=t.startY;e+=r,a+=i,n+=1}),{pageX:e/=n,pageY:a/=n}},getAdjustedSizes:O,getRotatedSizes:function(t){var e=t.width,a=t.height,n=t.degree;if(90==(n=Math.abs(n)%180))return{width:a,height:e};var r=n%90*Math.PI/180,i=Math.sin(r),o=Math.cos(r),s=e*o+a*i,c=e*i+a*o;return n>90?{width:c,height:s}:{width:s,height:c}},getSourceCanvas:function(t,e,a,n){var r=e.aspectRatio,i=e.naturalWidth,o=e.naturalHeight,s=e.rotate,c=void 0===s?0:s,u=e.scaleX,f=void 0===u?1:u,h=e.scaleY,d=void 0===h?1:h,v=a.aspectRatio,g=a.naturalWidth,m=a.naturalHeight,p=n.fillColor,b=void 0===p?"transparent":p,y=n.imageSmoothingEnabled,w=void 0===y||y,E=n.imageSmoothingQuality,M=void 0===E?"low":E,C=n.maxWidth,L=void 0===C?1/0:C,N=n.maxHeight,A=void 0===N?1/0:N,U=n.minWidth,x=void 0===U?0:U,R=n.minHeight,X=void 0===R?0:R,Y=document.createElement("canvas"),j=Y.getContext("2d"),S=O({aspectRatio:v,width:L,height:A}),W=O({aspectRatio:v,width:x,height:X},"cover"),k=Math.min(S.width,Math.max(W.width,g)),D=Math.min(S.height,Math.max(W.height,m)),P=O({aspectRatio:r,width:L,height:A}),T=O({aspectRatio:r,width:x,height:X},"cover"),I=Math.min(P.width,Math.max(T.width,i)),B=Math.min(P.height,Math.max(T.height,o)),_=[-I/2,-B/2,I,B];return Y.width=l(k),Y.height=l(D),j.fillStyle=b,j.fillRect(0,0,k,D),j.save(),j.translate(k/2,D/2),j.rotate(c*Math.PI/180),j.scale(f,d),j.imageSmoothingEnabled=w,j.imageSmoothingQuality=M,j.drawImage.apply(j,[t].concat(_toConsumableArray(_.map(function(t){return Math.floor(l(t))})))),j.restore(),Y},getStringFromCharCode:C,dataURLToArrayBuffer:function(t){var e=t.replace(L,""),a=atob(e),n=new ArrayBuffer(a.length),r=new Uint8Array(n);return u(r,function(t,e){r[e]=a.charCodeAt(e)}),n},arrayBufferToDataURL:function(t,e){for(var a=[],n=new Uint8Array(t);n.length>0;)a.push(M.apply(null,c(n.subarray(0,8192)))),n=n.subarray(8192);return"data:".concat(e,";base64,").concat(btoa(a.join("")))},resetAndGetOrientation:function(t){var e,a=new DataView(t);try{var n,r,i;if(255===a.getUint8(0)&&216===a.getUint8(1))for(var o=a.byteLength,s=2;s+1<o;){if(255===a.getUint8(s)&&225===a.getUint8(s+1)){r=s;break}s+=1}if(r){var c=r+10;if("Exif"===C(a,r+4,4)){var u=a.getUint16(c);if(((n=18761===u)||19789===u)&&42===a.getUint16(c+2,n)){var f=a.getUint32(c+4,n);f>=8&&(i=c+f)}}}if(i){var h,l,d=a.getUint16(i,n);for(l=0;l<d;l+=1)if(h=i+12*l+2,274===a.getUint16(h,n)){h+=8,e=a.getUint16(h,n),a.setUint16(h,1,n);break}}}catch(t){e=1}return e},parseOrientation:function(t){var e=0,a=1,n=1;switch(t){case 2:a=-1;break;case 3:e=-180;break;case 4:n=-1;break;case 5:e=90,n=-1;break;case 6:e=90;break;case 7:e=90,a=-1;break;case 8:e=-90}return{rotate:e,scaleX:a,scaleY:n}}}});
//# sourceMappingURL=sourcemaps/utilities.js.map
