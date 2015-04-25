# nw.js + angularjs devkit

Built your own development kit as desktop app!

### Installation
1. Fork this repo and clone your fork locally
2. duplicate app_example to app
3. duplicate sass_example to sass
4. run `npm install`
5. run `bower install`
6. run `grunt`
7. run `nw .` to see your devkit for the first time!
8. run `git remote add upstream https://github.com/printhom/devkit-core.git` if git didn't automatically fix your upstream remote branch

### Develop
You can use app/app.js to configure your application. You can also install editor views and widgets via bower or just place them in a folder and use app/app.js to load them (see examples in app_example). To style your devkit, use the sass folder. You can check `https://github.com/printhom` to see examples of views and widgets. Basically, they contain an angularjs html template, a controller and some styling.

### Build instructions

1. install node-webkit-builder ```npm install node-webkit-builder -g```
2. run ```nwbuild .``` in the directory of this repository