/**
* @file jQuery plugin that creates the basic interactivity for an ARIA dialog widget
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.5.1
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
            var dataHasTransitions = $dialog.data('jquery-dialog-transitions-enabled');
            var hasTransitions = (dataHasTransitions === undefined) ? options.transitionsEnabled : dataHasTransitions;
            var $body = $('body');
            var $header = $dialog.find('.dialog__header');
            var $dialogBody = $dialog.find('.dialog__body');
            var $heading = $header.find('> h2');
            var $dialogWindow = $dialog.find('.dialog__window'); // role=document is for older NVDA
            var $closeButton = $header.find('.dialog__close, .dialog__back');
            var $dialogForm = $dialogBody.find('.dialog__form');
            var $dialogFormChoice = $('<input type="hidden" name="choice" />');
            var $autoFocusable = $dialogWindow.find('[autofocus]');
            var $focusable;
            var openTimeout;
            var closeTimeout;

            var onKeyDown = function(e) {
                if (e.keyCode === 27) {
                    close(e);
                }
            };

            // submit button 'click' triggers before form 'submit' event
            // use this opportunity to patch-in hidden value
            var onFormSubmitClick = function(e) {
                var value = this.value || this.innerText;
                $dialogFormChoice.attr('value', value);
            };

            // dialog forms never submit, and always return serialzied data to caller
            var onFormSubmit = function(e) {
                e.preventDefault();
                close(e, $(this).serializeArray());
            };

            /**
            * @method open
            * @return void
            */
            var open = function() {
                $dialog.prop('hidden', false);

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

                // listen for key down events
                $dialog.on('keydown', onKeyDown);

                // let observers know that the dialog is open for business
                $dialog.trigger('dialogOpen');
            };

            /**
            * @method close
            * @return void
            */
            var close = function(e, data) {
                $dialogForm.off('click', '[type=submit]', onFormSubmitClick);
                $dialogForm.off('click', '[type=button]', close);
                $dialogForm.off('submit', onFormSubmit);
                $closeButton.off('click', close);
                $dialog.off('keydown', onKeyDown);
                $dialogFormChoice.remove();
                $.untrapKeyboard();
                $.untrapScreenreader();
                $body.removeClass('has-dialog');

                if (hasTransitions === true) {
                    window.clearTimeout(openTimeout);
                    $dialog.addClass('dialog--transition-out');
                    $dialogWindow.one('transitionend', function(e) {
                        $dialog.removeClass('dialog--transition-out');
                        $dialog.prop('hidden', true);
                        $dialog.trigger('dialogClose', [data]);
                    });
                } else {
                    $dialog.prop('hidden', true);
                    $dialog.trigger('dialogClose', [data]);
                }
            };

            $dialogForm.append($dialogFormChoice);

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

            $dialogForm.on('click', '[type=submit]', onFormSubmitClick);

            $dialogForm.on('click', '[type=button]', close);

            $dialogForm.on('submit', onFormSubmit);

            $closeButton.on('click', close);

            if (hasTransitions === true) {
                // clean up any untriggered closeTimeout
                window.clearTimeout(closeTimeout);

                // prime the CSS transition (this class should set display to block)
                $dialog.addClass('dialog--transition-in');

                // wait a little time before triggering CSS transition
                openTimeout = setTimeout(function() {
                    open();
                    $dialog.removeClass('dialog--transition-in');
                }, 16);
            } else {
                open();
            }
        });
    };
}(jQuery));

$.fn.dialog.defaults = {
    transitionsEnabled: false,
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
