$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "yidveo/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "yidveo"
  s.version     = Yidveo::VERSION
  s.authors     = ["Jonathan Gautsch"]
  s.email       = ["jon@workmein.com"]
  s.homepage    = "https://preferral.com"
  s.summary     = "Interact with Vidyo web service"
  s.description = "Mountable rails engine for interfacing with Vidyo web services"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency "rails", "~> 4.1.8"
  s.add_dependency 'handlebars_assets'
  s.add_dependency 'savon'
  s.add_dependency 'awrence'

  s.add_development_dependency "pg"
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'capybara'
  s.add_development_dependency 'factory_girl_rails'
  s.add_development_dependency 'pry'

  s.test_files = Dir['spec/**/*']
end
