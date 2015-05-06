[![Stories in Ready](https://badge.waffle.io/printhom/devkit-core.png?label=ready&title=Ready)](https://waffle.io/printhom/devkit-core)
# What is this?
This projec's goal is to create a development kit fully based on nw.js (previously node-webkit) and angular.js.

This project is currently actively maintained by [Athom](https://github.com/athombv/) and [PRINTR](https://github.com/PRINTR3D).

If you're in the need of a development kit for your own project or company as well, please feel free to contribute!

## Get started

### Installation
Requirements: [node.js](https://nodejs.org/), [bower](http://bower.io/), [grunt](http://gruntjs.com/), [nw.js](https://github.com/nwjs/nw.js/)

1. Fork this repo and clone your fork locally
2. run `npm install`
3. run `bower install`
4. run `grunt`
5. Make an alias to the nw.js executable as `nw`
6. run `nw .` in the cloned folder

*(optional)*

7. run `git remote add upstream https://github.com/printhom/devkit-core.git` if git didn't automatically fix your upstream remote branch.

### Develop
The editor consists of a framework, with components:

* editors (e.g. a code editor, a JSON editor..)
* widgets (e.g. a markdown viewer..)
* headers (e.g. a title bar, a 'Run' button..)
* themes

This core ships some components, that can be found in `./core/components/`. You can extend these for your own application by putting them in `./app/components/` and referencing to them in `./app/app.js`.

Run `grunt watch` before running `nw.js .` while development, or your changes won't be applied.

### Build instructions

1. install node-webkit-builder ```npm install node-webkit-builder -g```
2. run ```nwbuild .``` in the directory of this repository

## Contribute
Contributions are more than welcome! Send a pull request from your own fork to do so.

## Licence
MIT, see LICENCE.md