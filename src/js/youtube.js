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

    function isPlaying() {
        return $("#bezel svg g path").attr("d") == "M8 5v14l11-7z"
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
                    if (!isPlaying()) {
                        ipc.send("YoutubeData", {
                            largeImageKey: "youtube",
                            largeImageText: "Youtube Music",
                            details: $(".title.style-scope.ytmusic-player-bar")[0].innerText,
                            state: "Pausiert"
                        });
                        return;
                    }
                    var slider = $($("ytmusic-player-bar #sliderBar")[2]);
                    ipc.send("YoutubeData", {
                        largeImageKey: "youtube",
                        largeImageText: "Youtube Music",
                        details: $(".title.style-scope.ytmusic-player-bar")[0].innerText,
                        state: $(".byline.style-scope.ytmusic-player-bar")[0].innerText,
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

    function nextTrack() {
        if (!isPlayerBarVisible()) return;
        $(".next-button").click();
    }

    function previousTrack() {
        if (!isPlayerBarVisible()) return;
        $(".previous-button").click();
    }

    function pausePlayTrack() {
        if (!isPlayerBarVisible()) return;
        $(".play-pause-button").click();
        updateToolbar()
    }

    function startDiscordRpcSchedule() {
        submitYoutubeInformations();
        setInterval(submitYoutubeInformations, 15e3);
    }


    remote.globalShortcut.register("mediaplaypause", pausePlayTrack);
    remote.globalShortcut.register("medianexttrack", nextTrack);
    remote.globalShortcut.register("mediaprevioustrack", previousTrack);
    $(".play-pause-button").click(updateToolbar);
    $("#player").click(updateToolbar);

    ipc.on("Toolbar", (event, args) => {
        switch (args) {
            case "back":
                previousTrack()
                break;
            case "pauseplay":
                pausePlayTrack()
                break;
            case "next":
                nextTrack()
                break;
        }
    })

    function injectSettings() {
        //TODO: create settings icon and inject
        var html = '';
        $("ytmusic-nav-bar .right-content").append(html);
    }

    function updateToolbar() {
        // A delay of 10 milliseconds because the icon is not updated fast enough.
        setTimeout(() => ipc.send("Toolbar", { type: "refresh", playing: isPlaying() }), 10)
    }

    startDiscordRpcSchedule();
    injectSettings();
    ipc.send("Toolbar");
};