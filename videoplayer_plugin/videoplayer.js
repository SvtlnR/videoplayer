(function($) {
  $.fn.videoPlayer = function(options) {
    $("head").append($("<link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.3.1/css/all.css\" integrity=\"sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU\" crossorigin=\"anonymous\">"));
    var settings = $.extend({
      autoplay: false,
      muted: false
    }, options);
    return this.each(function() {
      var video = this;
      var iconPlay = "<i class=\"fas fa-play\"></i>";
      var iconPause = "<i class=\"fas fa-pause\"></i>";
      var btnPlay = iconPause;
      if (!settings.autoplay) {
        pauseVideo(video);
      } else {
        playVideo(video);
      }
      var soundOn = "<i class=\"fas fa-volume-up\"></i>";
      var soundOff = "<i class=\"fas fa-volume-off\"></i>";
      iconSound = soundOn;
      video.volume = 1;
      if (settings.muted) {
        iconSound = soundOff;
        video.volume = 0;
      }
      $(video).wrap("<div class=\"plugin_videoplayer\">");
      $(video).after("<div class=\"controls_videoplayer\"><div class=\"playBtn\">" + btnPlay + "</div><div class=\"stopBtn\"><i class=\"fas fa-stop\"></i></div><span class=\"timer\">00:00</span><input type=\"range\" step=\"0.1\" min=\"0\" max=\"100\" value=\"0\" class=\"rewind\"/><span class=\"duration\">00:00</span><div class=\"sound\">" + iconSound + "</div><input type=\"range\" step=\"0.1\" min=\"0\" max=\"1\" value=\"" + video.volume + "\" class=\"volume\"/></div>");
      var controls_videoplayer = $(video).next()[0];
      $(controls_videoplayer).width(video.width);
      var btn = $(video).next().find(".playBtn");
      var timer = $(video).next().find(".timer");
      var durationDiv = $(video).next().find(".duration");
      var rewind = $(video).next().find(".rewind");
      var sound = $(video).next().find(".sound");
      var volume = $(video).next().find(".volume");
      var resize = $(video).next().find(".resize");
      var stopBtn = $(video).next().find(".stopBtn");
      $(btn).click(function() {
        if (video.paused) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      });
      $(sound).click(function() {
        if (video.volume == 0) {
          setVolume(1);
        } else {
          setVolume(0);
        }
      });
      $(video).on("timeupdate", function(event) {
        onTrackedVideoFrame(this.currentTime, this.duration);
      });
      $(rewind).on("input", function(event) {
        pauseVideo(video);
        var newTime = $(rewind).val() * video.duration / 100;
        video.currentTime = newTime;
        playVideo(video);
      });
      $(volume).on("change", function(event) {
        setVolume(volume.val());
      });
      $(stopBtn).click(function() {
        stopVideo(video);
      });

      function onTrackedVideoFrame(currentTime, duration) {
        var currentmin = Math.trunc(currentTime / 60);
        var currentsec = Math.trunc(currentTime - currentmin * 60);
        if (currentTime == duration) {
          stopVideo(video);
        }
        if (currentsec < 10) {
          currentsec = "0" + currentsec;
        }
        if (currentmin < 10) {
          currentmin = "0" + currentmin;
        }
        $(timer).text(currentmin + ":" + currentsec);
        var durationMin = Math.trunc(duration / 60);
        var durationSec = Math.trunc(duration - durationMin * 60);
        if (durationMin < 10) {
          durationMin = "0" + durationMin;
        }
        if (durationSec < 10) {
          durationSec = "0" + durationSec;
        }
        $(durationDiv).text(durationMin + ":" + durationSec);
        $(rewind).val(currentTime * 100 / duration);
      }

      function stopVideo(curVideo) {
        pauseVideo(curVideo);
        video.currentTime = 0;
      }

      function pauseVideo(curVideo) {
        curVideo.pause();
        btnPlay = iconPlay;
        $(btn).html(btnPlay);
      }

      function playVideo(curVideo) {
        curVideo.play();
        btnPlay = iconPause;
        $(btn).html(btnPlay);
      }

      function setVolume(curVolume) {
        video.volume = curVolume;
        if (curVolume > 0) {
          iconSound = soundOn;
          $(volume).val(curVolume);
        } else {
          iconSound = soundOff;
          $(volume).val(0);
        }
        $(sound).html(iconSound);
      }
    });
  };
})(jQuery);