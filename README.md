# jquery-dialog

jQuery plugin that creates the basic interactivity for an ARIA dialog widget.

Expected dialog markup adheres to [bones](https://github.com/ianmcburnie/bones#user-content-dialog) convention:

```html
<div aria-labelledby="dialog-0-title" class="dialog" id="dialog-0" hidden role="dialog">
    <div role="document">
        <header>
            <button aria-label="Close Dialog" type="button"></button>
            <h2 id="dialog-0-title">Dialog Title</h2>
        </header>
        <div>
            <p>The dialog content goes here.</p>
            <a href="http://www.ebay.com">www.ebay.com</a>
        </div>
    </div>
</div>
```

Note the use of the 'hidden' attribute to ensure the dialog begins in a hidden state.

To activate the dialog using a button, ensure that the data attribute refers to the id of the dialog:

```html
<button class="dialog-button" data-jquery-dialog="dialog-0" type="button">Open Dialog</button>
```

Then call the dialogButton plugin on the button:

```js
$('.dialog-button').dialogButton()
```

Or, to activate the dialog at page load time, call the dialog plugin directly:

```js
$('.dialog').dialog();
```

## Events

Dialog triggers two events when opened and closed:

* `dialogOpen`
* `dialogClose`
