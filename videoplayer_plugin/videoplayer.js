(function($) {
  $.fn.videoPlayer = function(options) {
    var settings = $.extend({
      autoplay: false,
      muted: false
    }, options);
    return this.each(function() {
      var video = this;
      var iconPlayBtn = "&#9658";
      var originalWidth=video.width
      if (!settings.autoplay) {
        pauseVideo(video);
      } else {
        playVideo(video);
      }
      var soundOn = "./videoplayer_plugin/high-volume.png";
      var soundOff = "./videoplayer_plugin/mute.png";
      iconSound = soundOn;
      video.volume = 1;
      if (settings.muted) {
        iconSound = soundOff;
        video.volume = 0;
      }
      $(video).wrap("<div class=\"plugin_videoplayer\">");
      $(video).after("<div class=\"controls_videoplayer\">" +
        "<div class=\"playBtn\">" + iconPlayBtn + "</div>" +
        "<div class=\"stopBtn\">&#9724;</div>" +
        "<span class=\"timer\">00:00</span>" +
        "<input type=\"range\" step=\"0.1\" min=\"0\" max=\"100\" value=\"0\" class=\"rewind\" />" +
        "<span class=\"duration\">00:00</span>" +
        "<div class=\"sound\"><img class=\"soundIcon\" src=\"" + iconSound + "\"></div>" +
        "<input type=\"range\" step=\"0.1\" min=\"0\" max=\"1\" value=\"" + video.volume + "\" class=\"volume\" />" +
        "</div>");

      var controls_videoplayer = $(video).next()[0];
      $(controls_videoplayer).width(video.width);
      var btn = $(video).next().find(".playBtn");
      var timer = $(video).next().find(".timer");
      var durationDiv = $(video).next().find(".duration");
      var rewind = $(video).next().find(".rewind");
      var sound = $(video).next().find(".sound");
      var volume = $(video).next().find(".volume");
      var resize=$(video).next().find(".resize");
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


      $(video).on(
        "timeupdate",
        function(event) {
          onTrackedVideoFrame(this.currentTime, this.duration);
        });


      $(rewind).on("change", function(event) {
        var newTime = $(rewind).val() * video.duration / 100;
        video.currentTime = newTime;
        playVideo(video);
        onTrackedVideoFrame(newTime, video.duration);
      });


      $(volume).on("change", function(event) {
        setVolume(volume.val());
      });


      $(stopBtn).click(function() {
        stopVideo(video);
      });



      function onTrackedVideoFrame(currentTime, duration) {
        cur_time = currentTime / 60;
        var currentmin = Math.trunc(cur_time);
        if (currentmin < 10) {
          currentmin = "0" + currentmin;
        }
        var currentsec = Math.trunc((cur_time - currentmin) * 100);
        if (currentsec < 10) {
          currentsec = "0" + currentsec;
        }
        if(currentTime==duration){
          stopVideo(video);
        }
        $(timer).text(currentmin + ":" + currentsec);
        var durationInMin = duration / 60;
        var durationMin = Math.trunc(durationInMin);
        var durationSec = Math.trunc((durationInMin - durationMin) * 100);
        $(durationDiv).text(durationMin + ":" + durationSec);
        $(rewind).val(currentTime * 100 / duration);
      }

      function stopVideo(curVideo){
        pauseVideo(curVideo);
        video.currentTime = 0;
      }


      function pauseVideo(curVideo) {
        curVideo.pause();
        iconPlayBtn = "&#9658";
        $(btn).html(iconPlayBtn);
      }

      function playVideo(curVideo) {
        curVideo.play();
        iconPlayBtn = "&#10073;&#10073;";
        $(btn).html(iconPlayBtn);
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
        $(sound).html("<img class=\"soundIcon\" src=\"" + iconSound + "\">");
      }
    });
  };

})(jQuery);