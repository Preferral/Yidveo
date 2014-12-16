Yidveo::Engine.routes.draw do

  root to: "session#show"
  resource :proxy_request, only: [:show], controller: 'proxy_request'
end
