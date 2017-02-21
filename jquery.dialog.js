/**
* @file jQuery plugin that creates the basic interactivity for an ARIA dialog widget
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.4.0
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
            var dialogId = $dialogButton.data('jquery-dialog-button-for');
            var $dialog = $('#' + dialogId);

            $dialog.on('dialogClose', function(e) {
                $dialogButton.focus();
            });

            $dialogButton.on('click', function(e) {
                $dialog.dialog(options);
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
        options = $.extend(
            {},
            $.fn.dialog.defaults,
            options
        );
        return this.each(function onEach() {
            var $dialog = $(this);
            var dataTransitionOutDuration = $dialog.data('jquery-dialog-transition-out-duration');
            var dataType = $dialog.data('jquery-dialog-type');
            var transitionOutDuration = (dataTransitionOutDuration === undefined) ? options.transitionOutDuration : dataTransitionOutDuration;
            var type = (dataTransitionOutDuration === undefined) ? 'dialog' : dataType;
            var promptValue;
            var $body = $('body');
            var $header = $dialog.find('.dialog__header');
            var $dialogBody = $dialog.find('.dialog__body');
            var $heading = $header.find('> h2');
            var $dialogWindow = $dialog.find('.dialog__window'); // role=document is for older NVDA
            var $closeButton = $header.find('.dialog__close');
            var $dialogForm = $dialogBody.find('.dialog__form');
            var $dialogFormChoice = $('<input type="hidden" name="choice" />');
            var $autoFocusable = $dialogWindow.find('[autofocus]');
            var $focusable;
            var openTimeout;
            var closeTimeout;

            var onCloseButtonClick = function() {
                close();
            };

            var onFormButtonClick = function() {
                close();
            };

            var onKeyDown = function(e) {
                if (e.keyCode === 27) {
                    close();
                }
            };

            $dialogForm.append($dialogFormChoice);

            var onFormSubmitClick = function(e) {
                var value = this.value || this.innerText;
                $dialogFormChoice.attr('value', value);
            };

            var onFormSubmit = function(e) {
                e.preventDefault();
                close($(this).serializeArray());
            };

            /**
            * @method close
            * @return void
            */
            function close(data) {
                window.clearTimeout(openTimeout);
                $dialogForm.off('click', '[type=submit]', onFormSubmitClick);
                $dialogForm.off('click', '[type=button]', onFormButtonClick);
                $dialogForm.off('submit', onFormSubmit);
                $closeButton.off('click', onCloseButtonClick);
                $dialog.off('keydown', onKeyDown);
                $.untrapKeyboard();
                $.untrapScreenreader();
                $body.removeClass('has-dialog');
                $dialog.addClass('dialog--transition-out');
                $dialogFormChoice.remove();
                closeTimeout = setTimeout(function() {
                    $dialog.prop('hidden', true);
                    $dialog.removeClass('dialog--transition-out');
                    $dialog.trigger('dialogClose', [data]);
                }, transitionOutDuration);
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
            // found issue in voiceover where banner role will suppress announcement of dialog role
            // $header.attr('role', 'banner');

            // clean up any untriggered closeTimeout
            window.clearTimeout(closeTimeout);

            $dialog.addClass('dialog--transition-in');

            $dialogForm.on('click', '[type=submit]', onFormSubmitClick);
            $dialogForm.on('click', '[type=button]', onFormButtonClick);

            $dialogForm.on('submit', onFormSubmit);

            $closeButton.on('click', onCloseButtonClick);

            // wait a little time before triggering CSS transition
            openTimeout = setTimeout(function() {
                $dialog.prop('hidden', false);
                $dialog.removeClass('dialog--transition-in');

                // find all focusable elements inside dialog
                $focusable = ($autoFocusable.length > 0) ? $autoFocusable : $dialog.focusable();

                // dialog must always focus on an interactive element
                // if none found, set focus to doc
                if ($focusable.length === 0) {
                    $dialogWindow.attr('tabindex', '-1').focus();
                } else {
                    $focusable.first().focus();
                }

                // prevent screen reader virtual cursor from leaving the dialog
                $.trapScreenreader($dialog);

                // prevent keyboard user from leaving the dialog
                $.trapKeyboard($dialog, {deactivateOnFocusExit: false});

                // add hook to body for CSS
                $body.addClass('has-dialog');

                $dialog.on('keydown', onKeyDown);

                $dialog.trigger('dialogOpen');
            }, 16);
        });
    };
}(jQuery));

$.fn.dialog.defaults = {
    transitionOutDuration: 0
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
