# jquery-dialog

jQuery plugin that creates the basic interactivity for an ARIA dialog widget.

Expected dialog markup adheres to [bones](https://github.com/ianmcburnie/bones#user-content-dialog) convention:

```html
<button type="button" class="dialog-button" aria-controls="dialog-0">Open Dialog</button>
<div role="dialog" class="dialog" id="dialog-0" aria-labelledby="dialog-0-title" aria-hidden="true">
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

To activate the dialog using a button, call:

```js
$('.dialog-button').dialogButton()
```

To activate the dialog at page load time, call

```js
$('.dialog').dialog();
```

Dialog triggers two events when opened and closed:

* `dialogOpen`
* `dialogClose`
