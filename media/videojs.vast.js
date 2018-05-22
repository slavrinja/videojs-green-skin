function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
}
(function(window, vjs, vast) {
  'use strict';

  var extend = function(obj) {
    var arg, i, k;
    for (i = 1; i < arguments.length; i++) {
      arg = arguments[i];
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          obj[k] = arg[k];
        }
      }
    }
    return obj;
  },

  defaults = {
    // seconds before skip button shows, negative values to disable skip button altogether
    skip: 5
  },

  Vast = function (player, settings) {

    // return vast plugin
    return {
      createSourceObjects: function (media_files) {
        var sourcesByFormat = {}, i, j, tech;
        var techOrder = player.options().techOrder;
        for (i = 0, j = techOrder.length; i < j; i++) {
          var techName = techOrder[i].charAt(0).toUpperCase() + techOrder[i].slice(1);
          tech = window.videojs[techName];

          // Check if the current tech is defined before continuing
          if (!tech) {
            continue;
          }

          // Check if the browser supports this technology
          if (tech.isSupported()) {
            // Loop through each source object
            for (var a = 0, b = media_files.length; a < b; a++) {
              var media_file = media_files[a];
              var source = {type:media_file.mimeType, src:media_file.fileURL};
              // Check if source can be played with this technology
              if (tech.canPlaySource(source)) {
                if (sourcesByFormat[techOrder[i]] === undefined) {
                  sourcesByFormat[techOrder[i]] = [];
                }
                sourcesByFormat[techOrder[i]].push({
                  type:media_file.mimeType,
                  src: media_file.fileURL,
                  width: media_file.width,
                  height: media_file.height
                });
              }
            }
          }
        }
        // Create sources in preferred format order
        var sources = [];
        for (j = 0; j < techOrder.length; j++) {
          tech = techOrder[j];
          if (sourcesByFormat[tech] !== undefined) {
            for (i = 0; i < sourcesByFormat[tech].length; i++) {
              sources.push(sourcesByFormat[tech][i]);
            }
          }
        }
        return sources;
      },
	   
      getContent: function () {

        // query vast url given in settings
        vast.client.get(settings.url, function(response) {
          if (response) {
            // we got a response, deal with it
            for (var adIdx = 0; adIdx < response.ads.length; adIdx++) {
              var ad = response.ads[adIdx];
              player.vast.companion = undefined;
              for (var creaIdx = 0; creaIdx < ad.creatives.length; creaIdx++) {
                var creative = ad.creatives[creaIdx], foundCreative = false, foundCompanion = false;
                if (creative.type === "linear" && !foundCreative) {

                  if (creative.mediaFiles.length) {

                    player.vast.sources = player.vast.createSourceObjects(creative.mediaFiles);

                    if (!player.vast.sources.length) {
                      player.trigger('adscanceled');
                      return;
                    }

                    player.vastTracker = new vast.tracker(ad, creative);

                    foundCreative = true;
                  }

                } else if (creative.type === "companion" && !foundCompanion && settings.iscompanion === "1") {
					//alert("found");
				  //alert(settings.palyerid);
                  player.vast.companion = creative;
				  
				  for (var cpIdx = 0, cpLen = creative.variations.length; cpIdx < cpLen; cpIdx++)
                        {
							
                            var companionAd = creative.variations[cpIdx];
                            var docElement = document.createElement("div");
                            var aElement = document.createElement('a');
                            var companionAsset = new Image();
                            aElement.setAttribute('target', '_blank');

                            if (companionAd.type != "image/jpeg") continue;

                            companionAsset.src = creative.variations[cpIdx].staticResource;
                           /* companionAsset.width = creative.variations[cpIdx].width;
                            companionAsset.height = creative.variations[cpIdx].height;*/
							
							var iwidth = creative.variations[cpIdx].width;
                            var iheight = creative.variations[cpIdx].height;
                            aElement.href = creative.variations[cpIdx].companionClickThroughURLTemplate;
                            aElement.appendChild(companionAsset);
							if(settings.compdiv != ''){
								document.getElementById(settings.compdiv).style.display = 'none';
								document.getElementById(settings.compdiv).appendChild(aElement);
							}
							else{
								
								/*if(iwidth > 2*iheight){
									document.getElementById("2com"+settings.palyerid).appendChild(aElement);
								}
								else{
									document.getElementById("1com"+settings.palyerid).appendChild(aElement);								
								}*/
								if(settings.topadw != 'none'){
									if(iwidth == settings.topadw && iheight == settings.topadh){
										aElement.id = "a2com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("2com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.lopadw != 'none'){
									if(iwidth == settings.lopadw && iheight == settings.lopadh){
										aElement.id = "a4com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("4com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.ropadw != 'none'){
									if(iwidth == settings.ropadw && iheight == settings.ropadh){
										aElement.id = "a1com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("1com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.bopadw != 'none'){
									if(iwidth == settings.bopadw && iheight == settings.bopadh){
										aElement.id = "a3com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("3com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.wopadw != 'none'){
									if(iwidth == settings.wopadw && iheight == settings.wopadh){
										aElement.id = "vapcompaniw"+settings.palyerid;
										aElement.style.display = 'none';
										if(document.getElementById("vapcompaniw"+iwidth+"-"+iheight) != null){
											document.getElementById("vapcompaniw"+iwidth+"-"+iheight).appendChild(aElement);	
										}
									}
								}
								if(settings.wopadw1 != 'none'){
									if(iwidth == settings.wopadw1 && iheight == settings.wopadh1){
										aElement.id = "avapcompaniw"+settings.palyerid;
										aElement.style.display = 'none';
										if(document.getElementById("vapcompaniw"+iwidth+"-"+iheight) != null){
											document.getElementById("vapcompaniw"+iwidth+"-"+iheight).appendChild(aElement);	
										}
									}
								}
								if(settings.wopadw2 != 'none'){
									if(iwidth == settings.wopadw2 && iheight == settings.wopadh2){
										aElement.id = "aavapcompaniw"+settings.palyerid;
										aElement.style.display = 'none';
										if(document.getElementById("vapcompaniw"+iwidth+"-"+iheight) != null){
											document.getElementById("vapcompaniw"+iwidth+"-"+iheight).appendChild(aElement);	
										}
									}
								}
								
								/*if(iwidth == 728){
									aElement.id = "a2com"+settings.palyerid;
									aElement.style.display = 'none';
									document.getElementById("2com"+settings.palyerid).appendChild(aElement);
								}
								else if(iwidth == 300 && iheight == 60){
									aElement.id = "a3com"+settings.palyerid;
									aElement.style.display = 'none';
									document.getElementById("3com"+settings.palyerid).appendChild(aElement);
								}
								else{
									aElement.id = "a1com"+settings.palyerid;
									aElement.style.display = 'none';
									document.getElementById("1com"+settings.palyerid).appendChild(aElement);								
								}*/
							}
							
                            //docElement.appendChild(aElement);
                            //document.body.appendChild(docElement);
                        }

                  foundCompanion = true;

                }
              }

              if (player.vastTracker) {
                // vast tracker and content is ready to go, trigger event
                player.trigger('vast-ready');
                break;
              } else {
                // Inform ad server we can't find suitable media file for this ad
                vast.util.track(ad.errorURLTemplates, {ERRORCODE: 403});
              }
            }
          }

          if (!player.vastTracker) {
            // No pre-roll, start video
            player.trigger('adscanceled');
          }
        });
      },
	  
	  getContent2: function (murl) {

        // query vast url given in settings
        vast.client.get(murl, function(response) {
          if (response) {
            // we got a response, deal with it
            for (var adIdx = 0; adIdx < response.ads.length; adIdx++) {
              var ad = response.ads[adIdx];
              player.vast.companion = undefined;
              for (var creaIdx = 0; creaIdx < ad.creatives.length; creaIdx++) {
                var creative = ad.creatives[creaIdx], foundCreative = false, foundCompanion = false;
                if (creative.type === "linear" && !foundCreative) {

                  if (creative.mediaFiles.length) {

                    player.vast.sources = player.vast.createSourceObjects(creative.mediaFiles);

                    if (!player.vast.sources.length) {
                      player.trigger('adscanceled');
                      return;
                    }

                    player.vastTracker = new vast.tracker(ad, creative);

                    foundCreative = true;
                  }

                } else if (creative.type === "companion" && !foundCompanion && settings.iscompanion === "1") {
					//alert("found");
				  //alert(settings.palyerid);
                  player.vast.companion = creative;
				  
				  for (var cpIdx = 0, cpLen = creative.variations.length; cpIdx < cpLen; cpIdx++)
                        {
							
                            var companionAd = creative.variations[cpIdx];
                            var docElement = document.createElement("div");
                            var aElement = document.createElement('a');
                            var companionAsset = new Image();
                            aElement.setAttribute('target', '_blank');

                            if (companionAd.type != "image/jpeg") continue;

                            companionAsset.src = creative.variations[cpIdx].staticResource;
                            //companionAsset.width = creative.variations[cpIdx].width;
                           // companionAsset.height = creative.variations[cpIdx].height;

                            var iwidth = creative.variations[cpIdx].width;
                            var iheight = creative.variations[cpIdx].height;
                            aElement.href = creative.variations[cpIdx].companionClickThroughURLTemplate;
                            aElement.appendChild(companionAsset);
							if(settings.compdiv != ''){
								document.getElementById(settings.compdiv).style.display = 'none';
								document.getElementById(settings.compdiv).appendChild(aElement);
							}
							else{
								
								/*if(iwidth > 2*iheight){
									document.getElementById("2com"+settings.palyerid).appendChild(aElement);
								}
								else{
									document.getElementById("1com"+settings.palyerid).appendChild(aElement);								
								}*/
								if(settings.topadw != 'none'){
									if(iwidth == settings.topadw && iheight == settings.topadh){
										aElement.id = "a2com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("2com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.lopadw != 'none'){
									if(iwidth == settings.lopadw && iheight == settings.lopadh){
										aElement.id = "a4com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("4com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.ropadw != 'none'){
									if(iwidth == settings.ropadw && iheight == settings.ropadh){
										aElement.id = "a1com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("1com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.bopadw != 'none'){
									if(iwidth == settings.bopadw && iheight == settings.bopadh){
										aElement.id = "a3com"+settings.palyerid;
										aElement.style.display = 'none';
										document.getElementById("3com"+settings.palyerid).appendChild(aElement);	
									}
								}
								
								if(settings.wopadw != 'none'){
									if(iwidth == settings.wopadw && iheight == settings.wopadh){
										aElement.id = "vapcompaniw"+settings.palyerid;
										aElement.style.display = 'none';
										if(document.getElementById("vapcompaniw"+iwidth+"-"+iheight) != null){
											document.getElementById("vapcompaniw"+iwidth+"-"+iheight).appendChild(aElement);	
										}
									}
								}
								if(settings.wopadw1 != 'none'){
									if(iwidth == settings.wopadw1 && iheight == settings.wopadh1){
										aElement.id = "avapcompaniw"+settings.palyerid;
										aElement.style.display = 'none';
										if(document.getElementById("vapcompaniw"+iwidth+"-"+iheight) != null){
											document.getElementById("vapcompaniw"+iwidth+"-"+iheight).appendChild(aElement);	
										}
									}
								}
								if(settings.wopadw2 != 'none'){
									if(iwidth == settings.wopadw2 && iheight == settings.wopadh2){
										aElement.id = "aavapcompaniw"+settings.palyerid;
										aElement.style.display = 'none';
										if(document.getElementById("vapcompaniw"+iwidth+"-"+iheight) != null){
											document.getElementById("vapcompaniw"+iwidth+"-"+iheight).appendChild(aElement);	
										}
									}
								}
								/*if(iwidth == 728){
									aElement.id = "a2com"+settings.palyerid;
									aElement.style.display = 'none';
									document.getElementById("2com"+settings.palyerid).appendChild(aElement);
								}
								else if(iwidth == 300 && iheight == 60){
									aElement.id = "a3com"+settings.palyerid;
									aElement.style.display = 'none';
									document.getElementById("3com"+settings.palyerid).appendChild(aElement);
								}
								else{
									aElement.id = "a1com"+settings.palyerid;
									aElement.style.display = 'none';
									document.getElementById("1com"+settings.palyerid).appendChild(aElement);								
								}*/
							}
							
                            //docElement.appendChild(aElement);
                            //document.body.appendChild(docElement);
                        }

                  foundCompanion = true;

                }
              }

              if (player.vastTracker) {
                // vast tracker and content is ready to go, trigger event
                player.vast.midroll();
				player.trigger('vast-ready');
				
                break;
              } else {
                // Inform ad server we can't find suitable media file for this ad
                vast.util.track(ad.errorURLTemplates, {ERRORCODE: 403});
              }
            }
          }

          if (!player.vastTracker) {
            // No pre-roll, start video
            player.trigger('adscanceled');
          }
        });
      },

      setupEvents: function() {

        var errorOccurred = false,
            canplayFn = function() {
              player.vastTracker.load();
            },
            timeupdateFn = function() {
              if (isNaN(player.vastTracker.assetDuration)) {
                player.vastTracker.assetDuration = player.duration();
              }
              player.vastTracker.setProgress(player.currentTime());
            },
            pauseFn = function() {
              player.vastTracker.setPaused(true);
              player.one('play', function(){
                player.vastTracker.setPaused(false);
              });
            },
            errorFn = function() {
              // Inform ad server we couldn't play the media file for this ad
              vast.util.track(player.vastTracker.ad.errorURLTemplates, {ERRORCODE: 405});
              errorOccurred = true;
              player.trigger('ended');
            };

        player.on('canplay', canplayFn);
        player.on('timeupdate', timeupdateFn);
        player.on('pause', pauseFn);
        player.on('error', errorFn);

        player.one('vast-preroll-removed', function() {
          player.off('canplay', canplayFn);
          player.off('timeupdate', timeupdateFn);
          player.off('pause', pauseFn);
          player.off('error', errorFn);
          if (!errorOccurred) {
            player.vastTracker.complete();
          }
        });
      },

      preroll: function() {
        player.ads.startLinearAdMode();
        player.vast.showControls = player.controls();
        if (player.vast.showControls) {
          player.controls(false);
        }

        // load linear ad sources and start playing them
        player.src(player.vast.sources);

        var clickthrough;
        if (player.vastTracker.clickThroughURLTemplate) {
          clickthrough = vast.util.resolveURLTemplates(
            [player.vastTracker.clickThroughURLTemplate],
            {
              CACHEBUSTER: Math.round(Math.random() * 1.0e+10),
              CONTENTPLAYHEAD: player.vastTracker.progressFormated()
            }
          )[0];
        }
        var blocker = window.document.createElement("a");
        blocker.className = "vast-blocker";
        blocker.href = clickthrough || "#";
        blocker.target = "_blank";
        blocker.onclick = function() {
          if (player.paused()) {
            player.play();
            return false;
          }
          var clicktrackers = player.vastTracker.clickTrackingURLTemplate;
          if (clicktrackers) {
            player.vastTracker.trackURLs([clicktrackers]);
          }
          player.trigger("adclick");
        };
        player.vast.blocker = blocker;
        player.el().insertBefore(blocker, player.controlBar.el());

        var skipButton = window.document.createElement("div");
        skipButton.className = "vast-skip-button";
        if (settings.skip < 0) {
          skipButton.style.display = "none";
        }
        player.vast.skipButton = skipButton;
        player.el().appendChild(skipButton);

        player.on("timeupdate", player.vast.timeupdate);

        skipButton.onclick = function(e) {
          if((' ' + player.vast.skipButton.className + ' ').indexOf(' enabled ') >= 0) {
            player.vastTracker.skip();
            player.vast.tearDown();
          }
          if(window.Event.prototype.stopPropagation !== undefined) {
            e.stopPropagation();
          } else {
            return false;
          }
        };

        player.vast.setupEvents();

        player.one('ended', player.vast.tearDown);

        player.trigger('vast-preroll-ready');
      },
	  
	  midroll: function() {
        player.ads.startLinearAdMode();
        player.vast.showControls = player.controls();
        if (player.vast.showControls) {
          player.controls(false);
        }

        // load linear ad sources and start playing them
        player.src(player.vast.sources);

        var clickthrough;
        if (player.vastTracker.clickThroughURLTemplate) {
          clickthrough = vast.util.resolveURLTemplates(
            [player.vastTracker.clickThroughURLTemplate],
            {
              CACHEBUSTER: Math.round(Math.random() * 1.0e+10),
              CONTENTPLAYHEAD: player.vastTracker.progressFormated()
            }
          )[0];
        }
        var blocker = window.document.createElement("a");
        blocker.className = "vast-blocker";
        blocker.href = clickthrough || "#";
        blocker.target = "_blank";
        blocker.onclick = function() {
          if (player.paused()) {
            player.play();
            return false;
          }
          var clicktrackers = player.vastTracker.clickTrackingURLTemplate;
          if (clicktrackers) {
            player.vastTracker.trackURLs([clicktrackers]);
          }
          player.trigger("adclick");
        };
        player.vast.blocker = blocker;
        player.el().insertBefore(blocker, player.controlBar.el());

        var skipButton = window.document.createElement("div");
        skipButton.className = "vast-skip-button";
        if (settings.skip < 0) {
          skipButton.style.display = "none";
        }
        player.vast.skipButton = skipButton;
        player.el().appendChild(skipButton);

        player.on("timeupdate", player.vast.timeupdate);

        skipButton.onclick = function(e) {
          if((' ' + player.vast.skipButton.className + ' ').indexOf(' enabled ') >= 0) {
            player.vastTracker.skip();
            player.vast.tearDown();
          }
          if(window.Event.prototype.stopPropagation !== undefined) {
            e.stopPropagation();
          } else {
            return false;
          }
        };

        player.vast.setupEvents();

        player.one('ended', player.vast.tearDown);

        player.trigger('vast-preroll-ready');
      },

      tearDown: function() {
        // remove preroll buttons
        player.vast.skipButton.parentNode.removeChild(player.vast.skipButton);
        player.vast.blocker.parentNode.removeChild(player.vast.blocker);

        // remove vast-specific events
        player.off('timeupdate', player.vast.timeupdate);
        player.off('ended', player.vast.tearDown);

        // end ad mode
        player.ads.endLinearAdMode();

        // show player controls for video
        if (player.vast.showControls) {
          player.controls(true);
        }

        player.trigger('vast-preroll-removed');
      },

      timeupdate: function(e) {
        player.loadingSpinner.el().style.display = "none";
        var timeLeft = Math.ceil(settings.skip - player.currentTime());
        if(timeLeft > 0) {
          player.vast.skipButton.innerHTML = "Skip in " + timeLeft + "...";
        } else {
          if((' ' + player.vast.skipButton.className + ' ').indexOf(' enabled ') === -1){
            player.vast.skipButton.className += " enabled";
            player.vast.skipButton.innerHTML = "Skip >>";
          }
        }
      }
    };

  },

  vastPlugin = function(options) {
    var player = this;
    var settings = extend({}, defaults, options || {});

    // check that we have the ads plugin
    if (player.ads === undefined) {
      window.console.error('vast video plugin requires videojs-contrib-ads, vast plugin not initialized');
      return null;
    }

    // set up vast plugin, then set up events here
    player.vast = new Vast(player, settings);

    player.on('vast-ready', function () {
      // vast is prepared with content, set up ads and trigger ready function
      player.trigger('adsready');
    });

    player.on('vast-preroll-ready', function () {
      // start playing preroll, note: this should happen this way no matter what, even if autoplay
      //  has been disabled since the preroll function shouldn't run until the user/autoplay has
      //  caused the main video to trigger this preroll function
      player.play();
    });

    player.on('vast-preroll-removed', function () {
      // preroll done or removed, start playing the actual video
      player.play();
    });

    player.on('contentupdate', function(){
      // videojs-ads triggers this when src changes
      player.vast.getContent(settings.url);
    });

    player.on('readyforpreroll', function() {
      // if we don't have a vast url, just bail out
      if (!settings.url) {
        player.trigger('adscanceled');
        return null;
      }
      // set up and start playing preroll
      player.vast.preroll();
    });
	player.on('firstplay', function(){
          //alert("junaidss");
		  if(settings.topadw != 'none'){
				if(document.getElementById("a2com"+settings.palyerid) != null){
					document.getElementById("a2com"+settings.palyerid).style.display = '';
					document.getElementById("2com"+settings.palyerid).style.width = 'auto';
					document.getElementById("2com"+settings.palyerid).style.height = 'auto';
					document.getElementById("2com"+settings.palyerid).style.background = 'none';
				}				
			}
			
			if(settings.lopadw != 'none'){
				if(document.getElementById("a4com"+settings.palyerid) != null){
					document.getElementById("a4com"+settings.palyerid).style.display = '';
					document.getElementById("4com"+settings.palyerid).style.width = 'auto';
					document.getElementById("4com"+settings.palyerid).style.height = 'auto';
					document.getElementById("4com"+settings.palyerid).style.background = 'none';
				}				
			}
			
			if(settings.ropadw != 'none'){
				if(document.getElementById("a1com"+settings.palyerid) != null){
					document.getElementById("a1com"+settings.palyerid).style.display = '';
					document.getElementById("1com"+settings.palyerid).style.width = 'auto';
					document.getElementById("1com"+settings.palyerid).style.height = 'auto';
					document.getElementById("1com"+settings.palyerid).style.background = 'none';
				}				
			}
			
			if(settings.bopadw != 'none'){
				if(document.getElementById("a3com"+settings.palyerid) != null){
					document.getElementById("a3com"+settings.palyerid).style.display = '';
					document.getElementById("1com"+settings.palyerid).style.width = 'auto';
					document.getElementById("1com"+settings.palyerid).style.height = 'auto';
					document.getElementById("1com"+settings.palyerid).style.background = 'none';
			    }				
			}
			
			if(settings.wopadw != 'none'){
				if(document.getElementById("vapcompaniw"+settings.palyerid) != null){
					document.getElementById("vapcompaniw"+settings.palyerid).style.display = '';
					document.getElementById("vapcompaniw"+settings.wopadw+"-"+settings.wopadh).style.width = 'auto';
					document.getElementById("vapcompaniw"+settings.wopadw+"-"+settings.wopadh).style.height = 'auto';
					document.getElementById("vapcompaniw"+settings.wopadw+"-"+settings.wopadh).style.background = 'none';
			    }
			}
			
			if(settings.wopadw1 != 'none'){
				if(document.getElementById("avapcompaniw"+settings.palyerid) != null){
					document.getElementById("avapcompaniw"+settings.palyerid).style.display = '';
					document.getElementById("vapcompaniw"+settings.wopadw1+"-"+settings.wopadh1).style.width = 'auto';
					document.getElementById("vapcompaniw"+settings.wopadw1+"-"+settings.wopadh1).style.height = 'auto';
					document.getElementById("vapcompaniw"+settings.wopadw1+"-"+settings.wopadh1).style.background = 'none';
			    }
			}
			
			if(settings.wopadw2 != 'none'){
				if(document.getElementById("aavapcompaniw"+settings.palyerid) != null){
					document.getElementById("aavapcompaniw"+settings.palyerid).style.display = '';
					document.getElementById("vapcompaniw"+settings.wopadw2+"-"+settings.wopadh2).style.width = 'auto';
					document.getElementById("vapcompaniw"+settings.wopadw2+"-"+settings.wopadh2).style.height = 'auto';
					document.getElementById("vapcompaniw"+settings.wopadw2+"-"+settings.wopadh2).style.background = 'none';
			    }
			}
		  
		  //document.getElementById(settings.compdiv).style.display = 'inline-block';
    });
    // make an ads request immediately so we're ready when the viewer hits "play"
	
	
	
    if (player.currentSrc()) {
      player.vast.getContent(settings.url);
    }

	if(settings.posturl != '') {
		var postrollPlayed = false;
		player.on('contentended', function() {
		  //alert("junaid");
		  if(!postrollPlayed){
			player.vast.getContent2(settings.posturl);  
			postrollPlayed = true;
			
		  }
		  //alert("jack");
		});
	}
    // return player to allow this plugin to be chained
    return player;
  };

  vjs.plugin('vast', vastPlugin);

}(window, videojs, DMVAST));