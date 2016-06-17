/**
* @file jQuery plugin that creates the basic interactivity for an ARIA dialog widget
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.1.2
* @requires jquery
* @requires jquery-next-id
* @requires jquery-focusable
* @requires jquery-keyboard-trap
* @requires jquery-screenreader-trap
*/
(function($) {
    /**
    * jQuery plugin that creates the basic interactivity for an ARIA dialog button
    *
    * @method "jQuery.fn.dialogButton"
    * @return {jQuery} chainable jQuery class
    */
    $.fn.dialogButton = function dialogButton(options) {
        return this.each(function onEach() {
            var $dialogButton = $(this);
            var dialogId = $dialogButton.attr('aria-controls');
            var dialogOptions = options || $dialogButton.data('dialog');
            var $dialog = $('#' + dialogId);

            $dialog.on('dialogClose', function(e) {
                $dialogButton.focus();
            });

            $dialogButton.on('click', function(e) {
                $dialog.dialog(dialogOptions);
            });
        });
    };

    /**
    * jQuery plugin that creates the basic interactivity for an ARIA dialog widget
    *
    * @method "jQuery.fn.dialog"
    * @return {jQuery} chainable jQuery class
    */
    $.fn.dialog = function dialog(options) {
        return this.each(function onEach() {
            var $dialog = $(this);
            var opts = $.extend({}, $.fn.dialog.defaults, options);
            var $body = $('body');
            var $header = $dialog.find('header');
            var $heading = $header.find('> h2');
            var $doc = $dialog.find('> [role=document]'); // role=document is for older NVDA
            var $closeButton = $header.find('> button');
            var $autoFocusable = $doc.find('[autofocus]');
            var $focusable;
            var openTimeout;
            var closeTimeout;

            /**
            * @method close
            * @return void
            */
            function close() {
                window.clearTimeout(openTimeout);
                $closeButton.off('click', close);
                $(document).off('escapeKeyDown', close);
                $.untrapKeyboard();
                $.untrapScreenreader();
                $body.removeClass('has-dialog');
                $dialog.attr('aria-hidden', 'true');
                closeTimeout = setTimeout(function() {
                    $dialog.css('display', 'none');
                    $dialog.trigger('dialogClose');
                }, opts.transitionDurationMs);
            }

            // assign a unique id to the dialog widget
            $dialog.nextId('dialog');

            // heading needs an id to create programmatic label for dialog
            $heading.nextId($dialog.prop('id') + '-title');

            // setup the programmatic label
            $dialog.attr('aria-labelledby', $heading.prop('id'));

            // ensure dialog has role dialog
            $dialog.attr('role', 'dialog');

            // ensure header has role banner
            $header.attr('role', 'banner');

            // clean up any untriggered closeTimeout
            window.clearTimeout(closeTimeout);

            // set display block so that CSS transitions will work
            $dialog.css('display', 'block');

            // wait a little time before triggering CSS transition
            openTimeout = setTimeout(function() {
                $dialog.attr('aria-hidden', 'false');
                // find all focusable elements inside dialog
                $focusable = ($autoFocusable.length > 0) ? $autoFocusable : $dialog.focusable();

                // dialog must always focus on an interactive element
                // if none found, set focus to doc
                if ($focusable.length === 0) {
                    $doc.attr('tabindex', '-1').focus();
                } else {
                    $focusable.first().focus();
                }

                // prevent screen reader virtual cursor from leaving the dialog
                $.trapScreenreader($dialog);

                // prevent keyboard user from leaving the dialog
                $.trapKeyboard($dialog, {deactivateOnFocusExit: false});

                // add hook to body for CSS
                $body.addClass('has-dialog');

                // dialog must be closed on esc key
                $(document).commonKeyDown().on('escapeKeyDown', close);

                $closeButton.on('click', close);

                $dialog.trigger('dialogOpen');
            }, 10);
        });
    };
}(jQuery));

$.fn.dialog.defaults = {
    transitionDurationMs: 175
};

/**
* The jQuery plugin namespace.
* @external "jQuery.fn"
* @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
*/

/**
* dialogOpen event
*
* @event dialogOpen
* @type {object}
* @property {object} event - event object
*/

/**
* dialogClose event
*
* @event dialogClose
* @type {object}
* @property {object} event - event object
*/
