var script = document.createElement("script");
script.src = "/base/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js";
document.getElementsByTagName("head")[0].appendChild(script);
var WCT_READY = false;

beforeEach(function(done) {
    window.addEventListener('WebComponentsReady', function() {
        WCT_READY = true;
        done();
    });
    if (WCT_READY) done();
});