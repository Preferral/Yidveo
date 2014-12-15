$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "yidveo/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "yidveo"
  s.version     = Yidveo::VERSION
  s.authors     = ["TODO: Your name"]
  s.email       = ["TODO: Your email"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of Yidveo."
  s.description = "TODO: Description of Yidveo."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency "rails", "~> 4.1.8"

  s.add_development_dependency "pg"
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'capybara'
  s.add_development_dependency 'factory_girl_rails'

  s.test_files = Dir['spec/**/*']
end
