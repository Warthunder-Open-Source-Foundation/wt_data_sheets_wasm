(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(n,t,e){"use strict";e.r(t);var r=e(3),u=e(2);e.d(t,"main_js",(function(){return u.z})),e.d(t,"console_log",(function(){return u.x})),e.d(t,"constant_calc",(function(){return u.y})),e.d(t,"make_option_inputs",(function(){return u.A})),e.d(t,"__wbg_self_c6fbdfc2918d5e58",(function(){return u.m})),e.d(t,"__wbg_window_baec038b5ab35c54",(function(){return u.q})),e.d(t,"__wbindgen_object_drop_ref",(function(){return u.u})),e.d(t,"__wbg_globalThis_3f735a5746d41fbd",(function(){return u.g})),e.d(t,"__wbg_global_1bc0b39582740e95",(function(){return u.h})),e.d(t,"__wbindgen_is_undefined",(function(){return u.s})),e.d(t,"__wbg_newnoargs_be86524d73f67598",(function(){return u.k})),e.d(t,"__wbg_call_888d259a5fefc347",(function(){return u.c})),e.d(t,"__wbindgen_debug_string",(function(){return u.r})),e.d(t,"__wbindgen_throw",(function(){return u.w})),e.d(t,"__wbindgen_object_clone_ref",(function(){return u.t})),e.d(t,"__wbg_instanceof_Window_c4b70662a0d2c5ec",(function(){return u.i})),e.d(t,"__wbg_document_1c64944725c0d81d",(function(){return u.e})),e.d(t,"__wbg_querySelector_b92a6c73bcfe671b",(function(){return u.l})),e.d(t,"__wbg_createElement_86c152812a141a62",(function(){return u.d})),e.d(t,"__wbg_setAttribute_1b533bf07966de55",(function(){return u.n})),e.d(t,"__wbg_setinnerHTML_e5b817d6227a431c",(function(){return u.o})),e.d(t,"__wbg_appendChild_d318db34c4559916",(function(){return u.b})),e.d(t,"__wbg_settextContent_799ebbf96e16265d",(function(){return u.p})),e.d(t,"__wbg_URL_db6637e306672144",(function(){return u.a})),e.d(t,"__wbindgen_string_new",(function(){return u.v})),e.d(t,"__wbg_log_3445347661d4505e",(function(){return u.j})),e.d(t,"__wbg_getElementById_f3e94458ce77f0d0",(function(){return u.f})),r.d()},,function(n,t,e){"use strict";(function(n,r){e.d(t,"z",(function(){return j})),e.d(t,"x",(function(){return x})),e.d(t,"y",(function(){return T})),e.d(t,"A",(function(){return A})),e.d(t,"m",(function(){return k})),e.d(t,"q",(function(){return E})),e.d(t,"u",(function(){return O})),e.d(t,"g",(function(){return S})),e.d(t,"h",(function(){return q})),e.d(t,"s",(function(){return $})),e.d(t,"k",(function(){return C})),e.d(t,"c",(function(){return I})),e.d(t,"r",(function(){return P})),e.d(t,"w",(function(){return F})),e.d(t,"t",(function(){return L})),e.d(t,"i",(function(){return B})),e.d(t,"e",(function(){return D})),e.d(t,"l",(function(){return J})),e.d(t,"d",(function(){return M})),e.d(t,"n",(function(){return U})),e.d(t,"o",(function(){return z})),e.d(t,"b",(function(){return H})),e.d(t,"p",(function(){return R})),e.d(t,"a",(function(){return W})),e.d(t,"v",(function(){return N})),e.d(t,"j",(function(){return G})),e.d(t,"f",(function(){return K}));var u=e(3);const o=new Array(32).fill(void 0);function c(n){return o[n]}o.push(void 0,null,!0,!1);let i=o.length;function f(n){const t=c(n);return function(n){n<36||(o[n]=i,i=n)}(n),t}let d=0,l=null;function _(){return null!==l&&l.buffer===u.i.buffer||(l=new Uint8Array(u.i.buffer)),l}let b=new("undefined"==typeof TextEncoder?(0,n.require)("util").TextEncoder:TextEncoder)("utf-8");const a="function"==typeof b.encodeInto?function(n,t){return b.encodeInto(n,t)}:function(n,t){const e=b.encode(n);return t.set(e),{read:n.length,written:e.length}};function s(n,t,e){if(void 0===e){const e=b.encode(n),r=t(e.length);return _().subarray(r,r+e.length).set(e),d=e.length,r}let r=n.length,u=t(r);const o=_();let c=0;for(;c<r;c++){const t=n.charCodeAt(c);if(t>127)break;o[u+c]=t}if(c!==r){0!==c&&(n=n.slice(c)),u=e(u,r,r=c+3*n.length);const t=_().subarray(u+c,u+r);c+=a(n,t).written}return d=c,u}let g=null;function w(){return null!==g&&g.buffer===u.i.buffer||(g=new Int32Array(u.i.buffer)),g}let h=new("undefined"==typeof TextDecoder?(0,n.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function p(n,t){return h.decode(_().subarray(n,n+t))}function y(n){i===o.length&&o.push(o.length+1);const t=i;return i=o[t],o[t]=n,t}function m(n,t){try{return n.apply(this,t)}catch(n){u.a(y(n))}}function v(n){return null==n}function j(){u.g()}function x(n){var t=s(n,u.b,u.c),e=d;u.e(t,e)}function T(n,t,e,r){u.f(n,t,e,r)}function A(){u.h()}function k(){return m((function(){return y(self.self)}),arguments)}function E(){return m((function(){return y(window.window)}),arguments)}function O(n){f(n)}function S(){return m((function(){return y(globalThis.globalThis)}),arguments)}function q(){return m((function(){return y(r.global)}),arguments)}function $(n){return void 0===c(n)}function C(n,t){return y(new Function(p(n,t)))}function I(){return m((function(n,t){return y(c(n).call(c(t)))}),arguments)}function P(n,t){var e=s(function n(t){const e=typeof t;if("number"==e||"boolean"==e||null==t)return""+t;if("string"==e)return`"${t}"`;if("symbol"==e){const n=t.description;return null==n?"Symbol":`Symbol(${n})`}if("function"==e){const n=t.name;return"string"==typeof n&&n.length>0?`Function(${n})`:"Function"}if(Array.isArray(t)){const e=t.length;let r="[";e>0&&(r+=n(t[0]));for(let u=1;u<e;u++)r+=", "+n(t[u]);return r+="]",r}const r=/\[object ([^\]]+)\]/.exec(toString.call(t));let u;if(!(r.length>1))return toString.call(t);if(u=r[1],"Object"==u)try{return"Object("+JSON.stringify(t)+")"}catch(n){return"Object"}return t instanceof Error?`${t.name}: ${t.message}\n${t.stack}`:u}(c(t)),u.b,u.c),r=d;w()[n/4+1]=r,w()[n/4+0]=e}function F(n,t){throw new Error(p(n,t))}function L(n){return y(c(n))}function B(n){return c(n)instanceof Window}function D(n){var t=c(n).document;return v(t)?0:y(t)}function J(){return m((function(n,t,e){var r=c(n).querySelector(p(t,e));return v(r)?0:y(r)}),arguments)}function M(){return m((function(n,t,e){return y(c(n).createElement(p(t,e)))}),arguments)}function U(){return m((function(n,t,e,r,u){c(n).setAttribute(p(t,e),p(r,u))}),arguments)}function z(n,t,e){c(n).innerHTML=p(t,e)}function H(){return m((function(n,t){return y(c(n).appendChild(c(t)))}),arguments)}function R(n,t,e){c(n).textContent=0===t?void 0:p(t,e)}function W(){return m((function(n,t){var e=s(c(t).URL,u.b,u.c),r=d;w()[n/4+1]=r,w()[n/4+0]=e}),arguments)}function N(n,t){return y(p(n,t))}function G(n){console.log(c(n))}function K(n,t,e){var r=c(n).getElementById(p(t,e));return v(r)?0:y(r)}h.decode()}).call(this,e(4)(n),e(5))},function(n,t,e){"use strict";var r=e.w[n.i];n.exports=r;e(2);r.j()},function(n,t){n.exports=function(n){if(!n.webpackPolyfill){var t=Object.create(n);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(n,t){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(n){"object"==typeof window&&(e=window)}n.exports=e}]]);