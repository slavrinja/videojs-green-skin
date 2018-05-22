/**
 * Video.js Topbar Buttons
 * Created by Sergey Lavrenov
 * License information: https://github.com/slavrinja/videojs-topbar-buttons/blob/master/LICENSE
 * Plugin details: https://github.com/slavrinja/videojs-topbar-buttons
 */

(function(videojs) {
    'use strict';
    videojs.plugin('topBarButtons', function(opts) {
        opts = opts || {};
        var player = this;
        var _ss;

        //TODO remove jQuery
        $("body").prepend(
            '<div class="vjs-share-block hidden">\n' +
                '<h2>Share Video:</h2>\n' +
                '<div class="a2a_kit text-center">\n' +
                    '<a class="btn btn-social btn-facebook a2a_button_facebook "></a>\n' +
                    '<a class="btn btn-social btn-reddit a2a_button_reddit"></a>\n' +
                    '<a class="btn btn-social btn-telegram a2a_button_telegram"></a>\n' +
                    '<a class="btn btn-social btn-twitter a2a_button_twitter"></a>\n' +
                    '<a class="btn btn-social btn-viber a2a_button_viber"></a>\n' +
                    '<a class="btn btn-social btn-whatsapp a2a_button_whatsapp"></a>\n' +
                '</div>\n' +
                '<script>\n' +
                    'var a2a_config = a2a_config || {};\n' +
                    'a2a_config.locale = "ru";\n' +
                '</script>\n' +
                '<script async src="https://static.addtoany.com/menu/page.js"></script>\n' +
            '</div>');
        $("body").prepend(
            '<div class="vjs-feedback-block hidden">\n' +
                '<ul class="dropdown-menu dropdown-feedback">\n' +
                    '<li><a data-feedtype="start_slow" class="btn btn-warning btn-block" href="javascript:void(0);">Long pause before video start</a></li>\n' +
                    '<li><a data-feedtype="start_fail" class="btn btn-warning btn-block" href="javascript:void(0);">Video does not play at all</a></li>\n' +
                    '<li><a data-feedtype="play_slow" class="btn btn-warning btn-block" href="javascript:void(0);">Video plays slowly or with buffering</a></li>\n' +
                    '<li><a data-feedtype="subtitles_fail" class="btn btn-warning btn-block" href="javascript:void(0);">Problems with subtitles</a></li>\n' +
                    '<li><a data-feedtype="ads_fail" class="btn btn-warning btn-block" href="javascript:void(0);">Noisy or scam Ads</a></li></ul>');


        // add class for LIO-mode switching
        document.getElementById(player.id()).classList.add('.vjs-light-player');
        var _lio = true; // light is on

        /**
         * Returns HTML template for button with icon set from param
         * @param icon - name of FA-icon
         */
        function buttonTemplate(icon) {
            return '<div class="vjs-topbar-button__icon"><i class="fa ' + icon + '" aria-hidden="true"></i></div>';
        }

        /**
         * Toggling light behind player
         * Used for Toggle light button
         * @param e
         */
        function launchToggleLights(e) {
            e.preventDefault();
            if (_lio) {
                _lio = false;
                document.getElementsByTagName("body")[0].classList.add('vjs-light--off');
                document.getElementsByClassName('fa-lightbulb-o')[0].classList.add('vjs-topbar-button__icon--off');
            } else {
                _lio = true;
                document.getElementsByTagName("body")[0].classList.remove('vjs-light--off');
                document.getElementsByClassName('fa-lightbulb-o')[0].classList.remove('vjs-topbar-button__icon--off');
            }
        }

        /**
         * Redirects page to the URL
         * Used for Watch on site button
         * @param e
         */
        function launchWatchOnSite(e) {
            e.preventDefault();
            if (opts.watchOnSite.url !== undefined && opts.watchOnSite.url != '') {
                window.location.href = opts.watchOnSite.url;
            }
        }

        /**
         * Show share dialog
         * Share button handler
         * @param e
         */
        function launchShare(e) {
            e.preventDefault();
            var ModalDialog = videojs.getComponent('ModalDialog');

            var modal = new ModalDialog(player, {
                // We don't want this modal to go away when it closes.
                temporary: false
            });
            player.addChild(modal);
            modal.addClass('vjs-share-modal');

            // console.log();
            // var shareBlock = document.createElement('div');
            // shareBlock.className = 'vjs-share-block-modal';
            // shareBlock.innerHTML = document.getElementsByClassName('vjs-share-block')[0].innerHTML;
            // modal.content($('.vjs-share-block').html());

            //TODO remove jQuery
            setTimeout(function(){
                // Copy modal window body
                $('#player').find('.vjs-modal-dialog-content').html($('.vjs-share-block').html());
            }, 500);

            modal.open();
        }

        /**
         * Show feedback dialog
         * feedback button handler
         * @param e
         */
        function launchFeedback(e) {
            e.preventDefault();

            var ModalDialog = videojs.getComponent('ModalDialog');
            var modal = new ModalDialog(player, {
                // We don't want this modal to go away when it closes.
                temporary: false
            });
            player.addChild(modal);
            modal.addClass('vjs-feedback-modal');

            //todo remove jQuery
            setTimeout(function(){
                // Copy modal window body
                $('#player').find('.vjs-modal-dialog-content').html($('.vjs-feedback-block').html());
            }, 500);

            modal.open();

            // Send feedback at the base of feedtype clicked
            $('body').on('click', '.dropdown-feedback a', function() {
                var feedtype = $(this).data('feedtype');
                console.log('send ' + feedtype);

                modal.close();
            });
        }

        /**
         * Generate the DOM elements for the topbar buttons
         * @type {function}
         */
        function constructTopButtonsContent() {
            var _frag = document.createDocumentFragment();
            var _aside = document.createElement('aside');
            var _button;

            if (opts.feedback) {
                console.log('build feedback');
                _button = document.createElement('a');
                _button.className = 'vjs-topbar-button';
                _button.setAttribute('data-title', opts.feedback.title);
                _button.innerHTML = buttonTemplate(opts.feedback.icon);
                _button.addEventListener('click', launchFeedback, false);
                _aside.appendChild(_button);
            }

            if (opts.watchOnSite) {
                console.log('build watchOnSite');
                _button = document.createElement('a');
                _button.className = 'vjs-topbar-button';
                _button.setAttribute('data-title', opts.watchOnSite.title);
                _button.innerHTML = buttonTemplate(opts.watchOnSite.icon);
                _button.addEventListener('click', launchWatchOnSite, false);
                _aside.appendChild(_button);
            }

            if (opts.share) {
                console.log('build share');
                _button = document.createElement('a');
                _button.className = 'vjs-topbar-button';
                _button.setAttribute('data-title', opts.share.title);
                _button.innerHTML = buttonTemplate(opts.share.icon);
                _button.addEventListener('click', launchShare, false);
                _aside.appendChild(_button);
            }

            if (opts.toggleLights) {
                console.log('build toggleLights');
                _button = document.createElement('a');
                _button.className = 'vjs-topbar-button';
                _button.setAttribute('data-title', opts.toggleLights.title);
                _button.innerHTML = buttonTemplate(opts.toggleLights.icon);
                _button.addEventListener('click', launchToggleLights, false);
                _aside.appendChild(_button);
            }

            _aside.className = 'vjs-topbar';
            _ss = _aside;
            _frag.appendChild(_aside);

            player.el().appendChild(_frag);
        }

        // attach VideoJS event handlers
        player.on('mouseover', function() {
          // on hover, fade in the social share tools
          _ss.classList.add('is-visible');
        });
        player.on('mouseout', function() {
          // when not hovering, fade share tools back out
          _ss.classList.remove('is-visible');
        });

        /**
         * Start plugin
         */
        player.ready(function() {
            if (opts.toggleLights || opts.share || opts.watchOnSite || opts.feedback) {
                constructTopButtonsContent();
            }
        });
    });

}(window.videojs));

