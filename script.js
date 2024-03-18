(function () {

  const urlInput = document.getElementById("link");
  const submitButton = document.getElementById("submit-button");
  const submitButton2 = document.getElementById("submit-button2");
  const resultText = document.getElementById("result-text");

  function playVideo(isHash) {
    
        try {
          window.hls.destroy();
          player.destroy();
        } catch (error) {
          console.log(error)
        }
      
    var url;
    if (isHash) {
       url = urlInput.value;
    } else {
       url = "https://w3s.link/ipfs/" + urlInput.value + "/playlist.m3u8";
    }

    const validUrlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (validUrlPattern.test(url)) {

      var video = document.querySelector('#video');

      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.config.startLevel = 3; hls.loadSource(url);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          var availableQualities = [];
          var availableQualities = hls.levels.map((l) => l.height)
          console.log(availableQualities.push(0))
          console.log(availableQualities)
          // Add new qualities to option
          const defaultOptions = {};
          defaultOptions.quality = {
            default: availableQualities[availableQualities.length - 2],
            options: availableQualities,
            // this ensures Plyr to use Hls to update quality level
            forced: true,
            onChange: (e) => updateQuality(e),
          }

          const player = new Plyr(video, {
            ...defaultOptions, i18n: {
              qualityLabel: {
                0: 'Auto',
              },
            },
          })
          
          window.player = player;

          // Initialize here
          // const player = new Plyr(video, defaultOptions);
        });
      }
      hls.attachMedia(video);
      window.hls = hls;
    } else {
      resultText.innerText = "Invalid URL";
    }
  };

  submitButton.addEventListener("click", () => playVideo(false))
  submitButton2.addEventListener("click", () => playVideo(true))
})();

function updateQuality(newQuality) {
  if (newQuality === 0) {
    console.log("Quality auto");
    window.hls.currentLevel = -1;
  } else {
    window.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        console.log("Found quality match with " + newQuality);
        window.hls.currentLevel = levelIndex;
      }
    });
  }
}