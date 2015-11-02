Rails.application.routes.draw do

  namespace :api, defaults: {format: :json} do
    #users api
    get 'users/:id' => 'users#show'
    patch 'users/:id' => 'users#update'
    namespace :user do
      post 'session' => 'sessions#create'
      delete 'session' => 'sessions#destroy'
      post ':id/friends' => 'friends#update'
      get ':id/friends' => 'friends#index'
      get ':user_id/friend/:friend_id' => 'friends#show'
    end

    #matches api
    get 'categories' => 'categories#index'
    post 'matches' => 'matches#create'
    get 'matches/:id' => 'matches#show'
    get 'match/:id/result' => 'matches#result'
    patch 'match/:id' => 'matches#update'

    #challenges api
    post 'challenges' => 'challenges#create'
    get 'challenges' => 'challenges#index'
    get 'challenge/:id' => 'challenges#show'
  end

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
