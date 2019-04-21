module.exports = function () {
    window.$ = window.jQuery = require('jquery');
    moment = require('moment');

    let rpcOptions;
    let urlIdentifier = location.pathname.split('/')[1];

    //TODO: Add more routes
    switch (urlIdentifier) {
        case "":
            rpcOptions = {
                largeImageKey: "youtube",
                largeImageText: "Youtube Music",
                details: "In der Übersicht"
            };
            break;
        case "watch":
            //TODO: Make updates more persistent (no static array index). Thanks Google for the bullshit you are programming.
            var slider = $($("ytmusic-player-bar #sliderBar")[2]);
            rpcOptions = {
                largeImageKey: "youtube",
                largeImageText: "Youtube Music",
                details: $(".byline.style-scope.ytmusic-player-bar")[0].innerText,
                state: $(".title.style-scope.ytmusic-player-bar")[0].innerText,
                endTimestamp: Math.floor(Date.now() / 1000) + (slider.attr('aria-valuemax') - slider.attr('aria-valuenow'))
            };
            break;
        case "":
            rpcOptions = {
                largeImageKey: "youtube",
                largeImageText: "Youtube Music",
                details: "Ist auf der dunklen Seite unterwegs",
            };
            break;
    }
    return rpcOptions;
}