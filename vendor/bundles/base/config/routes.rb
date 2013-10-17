Hatio::Application.routes.draw do

	resources :shifts
	
  resources :domains do
    resources :terminologies do
			collection do
				post :update_multiple
        get :locale_resource
			end
    end
  
		resources :attachments do
			collection do
				post :update_multiple
				get :show_by_name
			end
      member do
        get :download
      end
		end

		resources :file_groups do
			collection do
				post :update_multiple
				get :show_by_name
			end
		end

    resources :diy_reports do
      collection do
        post :update_multiple
        get :show_by_name
      end
      member do 
        post :generate_views
      end
    end
    
    resources :diy_selections do
      collection do
        post :update_multiple
        get :show_by_name
      end
      member do
        post :update_multiple_parameters
        post :shoot
        get :query
      end
    end

    resources :diy_services do
      collection do
        post :update_multiple
        get :show_by_name
      end
      member do 
        post :update_multiple_parameters
        post :shoot
        get :query
      end
    end

    resources :favorites do
      collection do
        post :update_multiple
        get :show_by_name
      end
    end

    resources :common_codes do
      collection do
        post :update_multiple
        get :show_by_name
      end
      member do
        post :update_multiple_codes
      end
    end

    resources :entities do
      collection do
        post :update_multiple
        post :generate_table
        get :show_by_name
      end
      member do 
        get :entity_columns
        post :create_entity_columns
        post :update_multiple_entity_columns
        post :generate_api
        post :generate_model
        post :generate_views
      end
    end

    resources :menus do
      collection do
        post :update_multiple
        post :update_multiple_submenus
        get :show_by_name
      end
    end

    resources :roles do
      collection do
        post :update_multiple
        get :show_by_name
      end
      member do
        get :role_users
        get :permitted_resources
        post :update_permissions
        post :update_users
      end
    end
	end
	
end
