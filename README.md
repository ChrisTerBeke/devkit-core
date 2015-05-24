# Development Kit

This is a project to create a development kit in [nw.js](https://github.com/nwjs/nw.js) (previously named node-webkit).

It is meant for organizations who want to have their own development kit. It is extremely modular, and making it suitable for your needs is easy.

![](https://camo.githubusercontent.com/e994f03c94c5be67ca3113124afcd7133bfa84c7/687474703a2f2f646f776e6c6f6164732e666f726d6964652e636f6d2f63646e2f696d616765732f6465766b69742e706e67)

![](https://camo.githubusercontent.com/47b215e25a9fa0187bb2fa2a25ad0d96a3ed9399/687474703a2f2f646576656c6f706572732e6174686f6d2e6e6c2f696d672f6465766b69742e706e67)

## Docs
_The docs will be improved over time_

### Example app
An example app will be provided in the feature. For now, refer to [Athom](https://github.com/athombv/devkit) and [Printr](https://github.com/PRINTR3D/devkit-app) for examples.

### Project
One project can be loaded at the same time. A project is a directory on the filesystem. The sidebar will show the folder's contents, and update the contents live.

### Components
You can customize the devkit by loading components.

A component should be placed in `./app/components/(type)/(id)/` and loaded in `./app/app.js`.

The files `component.css`, `component.js` and `component.html` are loaded when they exist. Additionally, you can auto-load `js` and `css` files by putting them in `dependencies`.

The following type of modules are allowed:

#### Editors `editor`
An editor is a single view that can edit files. By default, we ship [CodeMirror](https://codemirror.net/) as the default editor. You can override this behavior in your own app.

#### Widgets `widget`
Every open file can have multiple widgets loaded. A widget is a view-only block, that can display (for example) a preview.

By default we ship a markdown and svg widget.

#### Headers `header`
In the header bar, you can add custom elements. Examples are a "Run" button, user authentication, a title...

#### Themes `theme`
A theme can do anything to customize the devkit to your needs.

####  Popups `popup`
Popups can be registered as well, and can be shown from anywhere.

## Contributing
Send a pull request to contribute! ❤