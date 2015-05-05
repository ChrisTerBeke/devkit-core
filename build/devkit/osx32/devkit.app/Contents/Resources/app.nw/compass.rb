# General
relative_assets = true
project_path = File.dirname(__FILE__) + '/'
add_import_path './bower_components/'

# Sass Paths
http_path = '/'
assets_path = http_path + 'public/assets/'
http_javascripts_path = assets_path + 'javascripts/'
http_stylesheets_path = assets_path + 'stylesheets/'
http_images_path = assets_path + 'images/'
http_fonts_path = assets_path + 'fonts/'

# Sass Directories
javascripts_dir = assets_path + 'javascripts/'
css_dir = assets_path + 'stylesheets/'
sass_dir = http_path + 'sass/'
images_dir = assets_path + 'images/'
fonts_dir = assets_path + 'fonts/'

require 'autoprefixer-rails'

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    io << AutoprefixerRails.process(css)
  end
end

require 'sass-css-importer'

add_import_path Sass::CssImporter::Importer.new("./bower_components/")

sourcemap = true

# Enable Debugging (Line Comments)
if environment == :development
	p "Compass Development Environment"
	output_style = :expanded
	line_comments = true
	sass_options = { :debug_info => true }
else
	p "Compass Production Environment"
	output_style = :compressed
	line_comments = false
end