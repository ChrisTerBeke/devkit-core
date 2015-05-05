# nw.js + angularjs devkit

Built your own development kit as desktop app!

### Installation
0. Fork this repo and clone your fork locally
1. If not installed yet, install NodeJS (http://nodejs.org/) and Ruby (https://www.ruby-lang.org) on your local system. 
2. Install Bower using the following command in command line: `npm install -g bower`.
3. Allow Bower to install private repos by following a small YouTube tutorial: https://www.youtube.com/watch?v=ExU_ZcONHxs.
4. Install or update Ruby using the following command in command line: `gem update --system` and then install bundle, using the following command in command line: `gem install bundle`.
5. Install Ruby Gem packages by using the following command in command line: `bundle install`.
6. Install GruntJS using the following command in command line: `npm install -g grunt-cli` or follow their 'Getting Started' guide http://gruntjs.com/getting-started.
7. run `grunt`
8. run `nw .` to see your devkit for the first time!
9. run `git remote add upstream https://github.com/printhom/devkit-core.git` if git didn't automatically fix your upstream remote branch

### Develop
You can use app/app.js to configure your application. You can also install editor views and widgets via bower or just place them in a folder and use app/app.js to load them (see examples in app_example). To style your devkit, use the sass folder. You can check `https://github.com/printhom` to see examples of views and widgets. Basically, they contain an angularjs html template, a controller and some styling.

### Build instructions

1. install node-webkit-builder ```npm install node-webkit-builder -g```
2. run ```nwbuild .``` in the directory of this repository