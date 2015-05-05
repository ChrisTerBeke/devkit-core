# nw.js + angularjs devkit
Built your own development kit as desktop app!

## Get started

### Installation
0. Fork this repo and clone your fork locally
1. If not installed yet, install NodeJS (http://nodejs.org/) on your local system. 
2. run `grunt`.
3. run `nw .` to see your devkit for the first time!
4. run `git remote add upstream https://github.com/printhom/devkit-core.git` if git didn't automatically fix your upstream remote branch.

### Develop
You can use app/app.js to configure your application. You can also install editor views and widgets via bower or just place them in a folder and use app/app.js to load them (see examples in this repo). To style your devkit, create theme modules (see app/components/themes). You can check `https://github.com/printhom` to see examples of views and widgets. Basically, they contain an angularjs html template, a controller and some styling.

### Build instructions

1. install node-webkit-builder ```npm install node-webkit-builder -g```
2. run ```nwbuild .``` in the directory of this repository

## Licence
See LICENCE.md