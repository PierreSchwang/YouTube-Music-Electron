module.exports = function () {
    if (this.loaded)
        return;
    this.loaded = true;

    const remote = require('electron').remote;
    const ipc = require('electron').ipcRenderer;
    const Locale = remote.getGlobal('Locale');
    window.$ = window.jQuery = require('jquery');

    function isPlayerBarVisible() {
        return $("ytmusic-player-bar").height() > 0;
    }

    function submitYoutubeInformations() {
        var urlIdentifier = location.pathname.split('/')[1];
        //TODO: Add more routes
        switch (urlIdentifier) {
            case "":
                ipc.send("YoutubeData", {
                    largeImageKey: "youtube",
                    largeImageText: "Youtube Music",
                    details: "In der Übersicht"
                });
                break;
            case "watch":
                // Check whether an ad is currently running 
                if ($(".ad-showing").length) {
                    ipc.send("YoutubeData", {
                        largeImageKey: "youtube",
                        largeImageText: "Youtube Music",
                        details: "Hört Werbung"
                    });
                } else {
                    //TODO: Make updates more persistent (no static array index). Thanks Google for the bullshit you are programming.
                    var slider = $($("ytmusic-player-bar #sliderBar")[2]);
                    ipc.send("YoutubeData", {
                        largeImageKey: "youtube",
                        largeImageText: "Youtube Music",
                        details: $(".byline.style-scope.ytmusic-player-bar")[0].innerText,
                        state: $(".title.style-scope.ytmusic-player-bar")[0].innerText,
                        endTimestamp: Math.floor(Date.now() / 1000) + (slider.attr('aria-valuemax') - slider.attr('aria-valuenow'))
                    });
                }
                break;
            case "":
                ipc.send("YoutubeData", {
                    largeImageKey: "youtube",
                    largeImageText: "Youtube Music",
                    details: "Ist auf der dunklen Seite unterwegs",
                });
                break;
        }
    }

    function startDiscordRpcSchedule() {
        submitYoutubeInformations();
        setInterval(submitYoutubeInformations, 15e3);
    }

    remote.globalShortcut.register("mediaplaypause", () => {
        if (!isPlayerBarVisible()) return;
        $(".play-pause-button").click();
    });
    remote.globalShortcut.register("medianexttrack", () => {
        if (!isPlayerBarVisible()) return;
        $(".next-button").click();
    });
    remote.globalShortcut.register("mediaprevioustrack", () => {
        if (!isPlayerBarVisible()) return;
        $(".previous-button").click();
    });


    startDiscordRpcSchedule();

};