if(!self.define){let e,a={};const s=(s,i)=>(s=new URL(s+".js",i).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(a[c])return;let f={};const o=e=>s(e,c),r={module:{uri:c},exports:f,require:o};a[c]=Promise.all(i.map((e=>r[e]||o(e)))).then((e=>(t(...e),f)))}}define(["./workbox-b4885d77"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"128_icon.png",revision:"9989c3c9049ba37d0a3372f54fe435e7"},{url:"16_icon.png",revision:"1ee9e83d6df3e01082b9b2a532975e55"},{url:"192_icon.png",revision:"2340a6662e078079127698358db0ae4b"},{url:"256_icon.png",revision:"3ee2f28b4282d7bb8d2deea0d63233b7"},{url:"32_icon.png",revision:"e0a567cc7bb914943ea60a99c4152239"},{url:"512_icon.png",revision:"89871a690dff2c5a598f373fc0dea252"},{url:"5e8787bf6c3086facab9.wasm",revision:null},{url:"64_icon.png",revision:"5428ec9b59f812e3d9561e99b8de9a55"},{url:"LICENSE.txt",revision:"3b83ef96387f14655fc854ddc3c6bd57"},{url:"README.txt",revision:"5ddc1084b3958ebfd35a4cdad5723873"},{url:"RobotoMono-Italic-VariableFont_wght.ttf",revision:"f7f9444826ffa286aa3569c60c75995b"},{url:"RobotoMono-VariableFont_wght.ttf",revision:"9e06bf8e4155ad3a942a9ff38f59fbc4"},{url:"WIP.png",revision:"3798d08e55fffe862cf00f19492ddc55"},{url:"battle_rating_statistics.css",revision:"68b329da9893e34099c7d8ad5cb9c940"},{url:"battle_rating_statistics.html",revision:"5110e327c0cc4d198d2d49cb3a516f71"},{url:"battle_rating_statistics.js",revision:"9885c4227a05d8158c3931cf87b1e468"},{url:"blk_proto.css",revision:"68b329da9893e34099c7d8ad5cb9c940"},{url:"blk_proto.html",revision:"8d41cca87e889a5a105eb4252f244a80"},{url:"blk_proto.js",revision:"cd099eb8cdeec242156fc58d88c7874c"},{url:"bombing_computer.html",revision:"39605e973faede0da122aafc060ab061"},{url:"bombing_computer.js",revision:"609c0d4f17e501cd00da0a11b9032eb1"},{url:"bombing_table.css",revision:"ddddf186c1ab7dbc56ac4cf48fe512eb"},{url:"bombing_table.html",revision:"8ed6767921086aff8c286595b8d3a613"},{url:"bombing_table.js",revision:"1d144ee4cdd0e2a808d8dcde45687fa7"},{url:"compare.css",revision:"d41f7ce4bfb6149947eedda76070f7fc"},{url:"compare.html",revision:"d3b03d73b1df80d37e6c5730e9e60259"},{url:"compare.js",revision:"8be01e5ebfbaf1528aa43a1c72a17eac"},{url:"custom_loadout.html",revision:"cd59b96a9427d25c382fb68d1dd43db4"},{url:"discord.css",revision:"e787d488f0e2beccf462524c9dabc507"},{url:"documentation.css",revision:"a528e64cd8475765912f589630316246"},{url:"documentation.html",revision:"7f70b09e574cea1f854df01b83ec7f98"},{url:"favicon.ico",revision:"efb9775891eaec03fdbfe5a407803642"},{url:"fm.css",revision:"8cefd363cb4cf52bfc5809c52e0c2f9d"},{url:"fm.html",revision:"6797a13b3bc5a02bd3b85b6d596b366a"},{url:"fm.js",revision:"2d306158497773d6f808624b2650be3c"},{url:"footer.css",revision:"bfad3547fd7e5ca42d7c642799121849"},{url:"footer.html",revision:"937d7a9288b36886f55d9e8b533e167d"},{url:"img/.gitkeep",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"index.css",revision:"ce0524777fdf4df350bcf461b3daa2a0"},{url:"index.html",revision:"c342f770b9133d6ac9272b8369dd6066"},{url:"index.js",revision:"998e13df52554411269f670ba0fdf41f"},{url:"js/polyfill.js",revision:"4d22966bdef7111829d4311a8dbf926a"},{url:"live_calc.css",revision:"c353bb94f0585644b5c90e3c2ed48b5b"},{url:"live_calc.html",revision:"78cd60eb58d442a27201b7f4becf805a"},{url:"live_calc.js",revision:"fc79dc5713c3be575049f7fb03c40622"},{url:"localhost.js",revision:"6a623025b456ca8f2627923ffb165a74"},{url:"localhost_err_dialog.css",revision:"bb9485c5c8698bb363e5c6ba371780f7"},{url:"localhost_err_dialog.html",revision:"ac0edc3a49c714ce3b09a6b85a201ab2"},{url:"manifest.json",revision:"0090dde090bd26707d54c2ca315b1852"},{url:"mathjax/LICENSE",revision:"3b83ef96387f14655fc854ddc3c6bd57"},{url:"mathjax/README.md",revision:"5256aa431040ed4d8e3e36c358a3ba27"},{url:"mathjax/es5/a11y/assistive-mml.js",revision:"918c4b601376f0a30785cc4b2c30f674"},{url:"mathjax/es5/a11y/complexity.js",revision:"84224127c322bb2aeaa14bf1d04c3ea3"},{url:"mathjax/es5/a11y/explorer.js",revision:"d47484887c0f4a163d6da7d784689d03"},{url:"mathjax/es5/a11y/semantic-enrich.js",revision:"0bc9ae214f26896d9c5fce25864277fb"},{url:"mathjax/es5/a11y/sre.js",revision:"813e4f9c198ecceba26f1dc768b2fae9"},{url:"mathjax/es5/adaptors/liteDOM.js",revision:"3deebcc025e2a32004fc3020d0c894c8"},{url:"mathjax/es5/core.js",revision:"f71bc0bfb7d2ac8261747f97a5d47dd4"},{url:"mathjax/es5/input/asciimath.js",revision:"c2d4076dd8e26d509bfe3a378e71cfa7"},{url:"mathjax/es5/input/mml.js",revision:"254feb449795092b38e972d1347d2e0c"},{url:"mathjax/es5/input/mml/entities.js",revision:"447e265a6d57481475bafb4d96cb24a0"},{url:"mathjax/es5/input/mml/extensions/mml3.js",revision:"bd10514b3a39695e04677f83c6dba5b5"},{url:"mathjax/es5/input/mml/extensions/mml3.sef.json",revision:"821fe9c5d34d5e5cef028e577b57e7d8"},{url:"mathjax/es5/input/tex-base.js",revision:"4d7207fab9d7152f1262998c54c70f17"},{url:"mathjax/es5/input/tex-full.js",revision:"5835895fdfb30335428c459dcc66c397"},{url:"mathjax/es5/input/tex.js",revision:"5c4f470da2ccb1acf85041fcecd6fff6"},{url:"mathjax/es5/input/tex/extensions/action.js",revision:"82f38dc5dbc07e16a58b4f46e785e531"},{url:"mathjax/es5/input/tex/extensions/all-packages.js",revision:"441050e5e08393be059505f8f8ae5ff0"},{url:"mathjax/es5/input/tex/extensions/ams.js",revision:"1bc2af18771242b1222acff1fba2e45c"},{url:"mathjax/es5/input/tex/extensions/amscd.js",revision:"255cca7d23142a2e567bcb55479e061b"},{url:"mathjax/es5/input/tex/extensions/autoload.js",revision:"9e5e62bc4fe5ff3d50c3546c9bfb1b28"},{url:"mathjax/es5/input/tex/extensions/bbox.js",revision:"f459b9ce964b8961cc1ff70298b171d3"},{url:"mathjax/es5/input/tex/extensions/boldsymbol.js",revision:"d760e63e3b60823d5657500aa6e25168"},{url:"mathjax/es5/input/tex/extensions/braket.js",revision:"ec3ac028377b3524b84e7dd3c0c2535e"},{url:"mathjax/es5/input/tex/extensions/bussproofs.js",revision:"f3adca1cbc0e808590ebd7657527bc45"},{url:"mathjax/es5/input/tex/extensions/cancel.js",revision:"f58274c9f463b215296b8ab98e03d88b"},{url:"mathjax/es5/input/tex/extensions/cases.js",revision:"f3e7ea5ce4d6e59f89c3d20a6f099935"},{url:"mathjax/es5/input/tex/extensions/centernot.js",revision:"c355de00ee56d6fd405e683b9a164776"},{url:"mathjax/es5/input/tex/extensions/color.js",revision:"01fa7bdb219173457f79bc02d4e562fe"},{url:"mathjax/es5/input/tex/extensions/colortbl.js",revision:"733216970fffb9bc232f91f9b2aa0ffd"},{url:"mathjax/es5/input/tex/extensions/colorv2.js",revision:"e57003d4dafb627ca6d1fc9cc9afe20d"},{url:"mathjax/es5/input/tex/extensions/configmacros.js",revision:"2293a193396536cc952f06ef9c7ccdc9"},{url:"mathjax/es5/input/tex/extensions/empheq.js",revision:"646f560f8eb7d8c911bc023a7cb212c0"},{url:"mathjax/es5/input/tex/extensions/enclose.js",revision:"cdc7b8ab5a9523971b1d38d9edbfb37e"},{url:"mathjax/es5/input/tex/extensions/extpfeil.js",revision:"1c400bd6cabff3d92fd23beb407d2258"},{url:"mathjax/es5/input/tex/extensions/gensymb.js",revision:"753faef0aa2b86157c56c5ebabfd1bb6"},{url:"mathjax/es5/input/tex/extensions/html.js",revision:"55035b2d982da9fac043592ca9f4fa2c"},{url:"mathjax/es5/input/tex/extensions/mathtools.js",revision:"6a8c3c09e18f448f4e4f476dd68cc0ee"},{url:"mathjax/es5/input/tex/extensions/mhchem.js",revision:"a9146aa693c09f4691058942f19366c1"},{url:"mathjax/es5/input/tex/extensions/newcommand.js",revision:"831e36797e263d5ca7e309dc9b3817ca"},{url:"mathjax/es5/input/tex/extensions/noerrors.js",revision:"306ed70d73440c68978c68a6a33ecc38"},{url:"mathjax/es5/input/tex/extensions/noundefined.js",revision:"6030554420d1b79c3e4e12557334434a"},{url:"mathjax/es5/input/tex/extensions/physics.js",revision:"34ffa3cc3446f8772c7cd9804af03cac"},{url:"mathjax/es5/input/tex/extensions/require.js",revision:"ddffe3c9bd5c024bb61e6067786d460c"},{url:"mathjax/es5/input/tex/extensions/setoptions.js",revision:"422038bb49cfa762a97c91625f7116b7"},{url:"mathjax/es5/input/tex/extensions/tagformat.js",revision:"d4442e62854022d3ccc25f62250289e6"},{url:"mathjax/es5/input/tex/extensions/textcomp.js",revision:"28742f119fd3173b5a6436a7e8d1b5be"},{url:"mathjax/es5/input/tex/extensions/textmacros.js",revision:"25e1a713baa09d10b8de20da4f138b3f"},{url:"mathjax/es5/input/tex/extensions/unicode.js",revision:"c95abb61e0e26ea3d0d6856e80348d43"},{url:"mathjax/es5/input/tex/extensions/upgreek.js",revision:"05380fb592bf1f80959ed3a3452900db"},{url:"mathjax/es5/input/tex/extensions/verb.js",revision:"51168d1882ff4646d76b5f9d15970ea7"},{url:"mathjax/es5/latest.js",revision:"c071e4e61133a33575c9b898c7b7cfdf"},{url:"mathjax/es5/loader.js",revision:"1bdc3a0eb0e9952a02c2f0fc7d107be0"},{url:"mathjax/es5/mml-chtml.js",revision:"91bc2fda5057b903ea4d9a5c7254420d"},{url:"mathjax/es5/mml-svg.js",revision:"8a3a96e4bc66315d208ba529067076f8"},{url:"mathjax/es5/node-main.js",revision:"030e0f466add1ad485c9515884a3d73e"},{url:"mathjax/es5/output/chtml.js",revision:"c80c187298a5b7d039aa08fa29fcccec"},{url:"mathjax/es5/output/chtml/fonts/tex.js",revision:"29662ef385c73c4dd9e99b17cd2d579b"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_AMS-Regular.woff",revision:"07173fb77d2ee655811499d40c8388e7"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Bold.woff",revision:"c2704fb5d3a6f94fa839d7cd46935a58"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Calligraphic-Regular.woff",revision:"c8f163c30c75aa2818c77d80a99ede24"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Bold.woff",revision:"bc42125861bd5bfc8686deeb612dcbb3"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Fraktur-Regular.woff",revision:"b80e08d5a79acbd1fafb1ca6f3515664"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Bold.woff",revision:"c9423d5dc9d82a38ca215f74e9cdd9f2"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Italic.woff",revision:"7e83626ba8bf2d20dc41565f1e6d0afc"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff",revision:"9995de4787f908d8237dba7007f6c3fe"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-BoldItalic.woff",revision:"77dbcee3c3d9a82a0c04a4ae7992b895"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff",revision:"5589d1a8fc62be6613020ef2fa13e410"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Regular.woff",revision:"ede66e09bbe848ef0b2f36ef048995ea"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Bold.woff",revision:"07281897a98a61c3733e1670f82a9fd5"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Italic.woff",revision:"3d580bd561716bfb1f0b4fdd7063a802"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_SansSerif-Regular.woff",revision:"bc3af04f9a671fcabd6498042c57478f"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Script-Regular.woff",revision:"4c74e33b0feb1fdbda49403a5e7ed604"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size1-Regular.woff",revision:"7ee67b5348ee634dd16b968d281cb882"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size2-Regular.woff",revision:"23a68923a42edaa3b7e6bc8a3917d388"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size3-Regular.woff",revision:"a7860eaf63c39f2603165893ce61a878"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Size4-Regular.woff",revision:"3b232dcedebc60224f28318bceb3ad42"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Typewriter-Regular.woff",revision:"72815766b08ca24d4d29ad1f5d4ecb45"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Bold.woff",revision:"77dd7f101fe6e19aeb5845f9592f7ee2"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Vector-Regular.woff",revision:"06568d8d53fb00816d101164854d8c6f"},{url:"mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Zero.woff",revision:"b26f96047d1cb466c83e9b27bf353c1f"},{url:"mathjax/es5/output/svg.js",revision:"4f55967d16197ebb01b86356d8ab179a"},{url:"mathjax/es5/output/svg/fonts/tex.js",revision:"6eab785a3788ea805bd2b552d1f0aab8"},{url:"mathjax/es5/sre/mathmaps/base.json",revision:"4bfb2f4030b8ff76d133b6ccacdaad1a"},{url:"mathjax/es5/sre/mathmaps/ca.json",revision:"71a76a1882b33e473d4564b27ce51210"},{url:"mathjax/es5/sre/mathmaps/da.json",revision:"36fe6fec3e22261f53c405b55b8ac0c1"},{url:"mathjax/es5/sre/mathmaps/de.json",revision:"a80a561c514fe9cd422f24e95d961977"},{url:"mathjax/es5/sre/mathmaps/en.json",revision:"16db6696238e2637da46adc8fe995b62"},{url:"mathjax/es5/sre/mathmaps/es.json",revision:"c8de077da08bee9b2fdf1e75745df2a5"},{url:"mathjax/es5/sre/mathmaps/fr.json",revision:"ae7e79a1daa3da3663b8ba8fab53023b"},{url:"mathjax/es5/sre/mathmaps/hi.json",revision:"e17f74d51ce89f74e62616f3ed2242ad"},{url:"mathjax/es5/sre/mathmaps/it.json",revision:"a96f5e6286074f0d2546bd10f88ff212"},{url:"mathjax/es5/sre/mathmaps/nb.json",revision:"95372b4ce6e65b703892229839b12d59"},{url:"mathjax/es5/sre/mathmaps/nemeth.json",revision:"500455c1672e4c1fccd86b6604dfbfb6"},{url:"mathjax/es5/sre/mathmaps/nn.json",revision:"3a5865f4ad3ca357ee9a4e6f2a09b728"},{url:"mathjax/es5/sre/mathmaps/sv.json",revision:"1a1d84b33d131ffc45d741428b4524d6"},{url:"mathjax/es5/startup.js",revision:"dc7130cdc866593293dbb5dde11ceb40"},{url:"mathjax/es5/tex-chtml-full-speech.js",revision:"2f6cd542ee78bb0406620092e6bec4de"},{url:"mathjax/es5/tex-chtml-full.js",revision:"541aca0b8f231a30a53a3cbf8cb97235"},{url:"mathjax/es5/tex-chtml.js",revision:"1d4e370eb01c3768d4304e3245b0afa6"},{url:"mathjax/es5/tex-mml-chtml.js",revision:"2e00d51c98dbb338e81054f240e1deb2"},{url:"mathjax/es5/tex-mml-svg.js",revision:"034cfac446e1b0444e04e26640fc3167"},{url:"mathjax/es5/tex-svg-full.js",revision:"e903f718ada4629fc5f2837c2d143a40"},{url:"mathjax/es5/tex-svg.js",revision:"e767e9be86ed9a6bbe91b3908df7faf1"},{url:"mathjax/es5/ui/lazy.js",revision:"1cdd9a0ac8e476ff0ae95f0074c36f0e"},{url:"mathjax/es5/ui/menu.js",revision:"755933cb19f2fd90817c976d0e32c3a9"},{url:"mathjax/es5/ui/safe.js",revision:"8c1fcfee7c879588ad409edcdd9cce53"},{url:"mathjax/package.json",revision:"15192084052671ed664c3c7f726c3188"},{url:"missile_ballistics.css",revision:"c37913e821f7b4a76d1f29017021e00b"},{url:"missile_ballistics.html",revision:"2d21ede26b60baeaa76c715fe9fef34e"},{url:"missile_ballistics.js",revision:"0825c24ae7faa038b8a7ba1625e5e442"},{url:"missile_input.css",revision:"7eb52de37712ba7f04e7d6d48f6a4e24"},{url:"missile_select.html",revision:"3160de3f3657658e182d1685d841db8e"},{url:"navbar.css",revision:"9fbb38402db064db6e932e6147fa52f0"},{url:"navbar.html",revision:"ecf96035b6935c911fd22a107af84204"},{url:"news.css",revision:"903f3ea2767f4d2108e2b71039ff737d"},{url:"news.html",revision:"388870823a688401051cdc1eb0d28c07"},{url:"privacy_policy.html",revision:"fec084f2ddc665e376a9efa2231c6aa1"},{url:"prototypes.html",revision:"720710946e701ae5192454a70c173ffe"},{url:"radar.css",revision:"eb03e6a9031a556572ddae98f1d65820"},{url:"radar.html",revision:"f039e78df6041d3b06f98e7786395ae1"},{url:"radar.js",revision:"9a38aaa1c2ad7a17442f5466b2eada80"},{url:"robots.txt",revision:"ea6b94db76687d4538d1341c4f2120dd"},{url:"settings.css",revision:"68b329da9893e34099c7d8ad5cb9c940"},{url:"settings.html",revision:"7b73114c4e712795455335129fb9b4ea"},{url:"settings.js",revision:"4e3a779a6bf72a6273f716563905a085"},{url:"shell_index.css",revision:"baa81bf5a932da8b643557707f65cf0b"},{url:"shell_index.html",revision:"a0640beead93a47fb38bc547d707ebd7"},{url:"shell_index.js",revision:"435bae2b7a24fdff5cdfdd51f5121e7f"},{url:"slider.css",revision:"c6af30a565d0b8ce392f1ccad8a5876a"},{url:"static/RobotoMono-Bold.ttf",revision:"e72fdf1cca2cebcbe91325bbe9f9e5da"},{url:"static/RobotoMono-BoldItalic.ttf",revision:"9f19015ac5913e03cdd542eb73d17d12"},{url:"static/RobotoMono-ExtraLight.ttf",revision:"9bab8fe7af63fb4a1d536f0690799953"},{url:"static/RobotoMono-ExtraLightItalic.ttf",revision:"2186a1bc18fe3a5b9d35b1f0a9661f97"},{url:"static/RobotoMono-Italic.ttf",revision:"4e76966e85cfc4edb3db058576edcb1b"},{url:"static/RobotoMono-Light.ttf",revision:"fa8ab495d494eccb28f4431f054ddbd4"},{url:"static/RobotoMono-LightItalic.ttf",revision:"060d28a8c0576728842455c0a92641e0"},{url:"static/RobotoMono-Medium.ttf",revision:"8ad82b1dc550319993a7d6c932b2656d"},{url:"static/RobotoMono-MediumItalic.ttf",revision:"50fcbc561a338706746be330f2b7ef99"},{url:"static/RobotoMono-Regular.ttf",revision:"e5ca8c0ac474df46fe45840707a0c483"},{url:"static/RobotoMono-SemiBold.ttf",revision:"2a12618b6d46fd798157e4b9d29cdf06"},{url:"static/RobotoMono-SemiBoldItalic.ttf",revision:"e0781b003f2cd1145518cc5f5f8d134c"},{url:"static/RobotoMono-Thin.ttf",revision:"7cb58857d294ac1e09b72ea9403c690a"},{url:"static/RobotoMono-ThinItalic.ttf",revision:"95e08d0c587d02c33914026841dd5e89"},{url:"styles.css",revision:"4b6ad6a14775b3a75c057c39e1ae83eb"},{url:"table.css",revision:"9e0731050a267af7e255290ef8534bec"},{url:"table.html",revision:"f9f92e669238a80e301228526e568024"},{url:"table.js",revision:"99355a444108e1835acef698ff5f5113"},{url:"thermal_index.css",revision:"4a053e8cd3113feb62feb257c6c0b0a4"},{url:"thermal_index.html",revision:"62f6eab9d38122891504c0d7a9281816"},{url:"thermal_index.js",revision:"bfd9e4d6487cd60cb6225c840cafc0a6"},{url:"tierlist.css",revision:"1c8998de2097068d69354ec4a377683e"},{url:"tierlist.html",revision:"24a536393dc8ca0b7f322c056637a84c"},{url:"util.js",revision:"a0f558e8cb7fe62e1f3fa5ace6a33377"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(/\.(?:html|css|js|wasm)$/,new e.NetworkFirst({cacheName:"short_term",plugins:[new e.ExpirationPlugin({maxAgeSeconds:3600,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:svg|ico|png|ttf)$/,new e.StaleWhileRevalidate({cacheName:"long_term",plugins:[new e.ExpirationPlugin({maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET")}));
