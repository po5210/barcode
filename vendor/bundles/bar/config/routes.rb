Hatio::Application.routes.draw do

  resources :domains do
		resources :bar_matmaps do
			collection do
				post :update_multiple
			end
		end

		resources :part_groups do
			collection do
				post :update_multiple
			end
		end

		resources :product_parts do
			collection do
				post :update_multiple
			end
		end

		resources :bar_locmaps do
			collection do
				post :update_multiple
			end
		end

		resources :bar_locgrps do
			collection do
				post :update_multiple
			end
		end

		resources :products do
			collection do
				post :update_multiple
			end
		end

		resources :bar_locmaps do
			collection do
				post :update_multiple
			end
		end

		resources :locs do
			collection do
				post :update_multiple
			end
		end

		resources :suppliers do
			collection do
				post :update_multiple
			end
		end

		resources :locs do
			collection do
				post :update_multiple
			end
		end

		resources :baselocs do
			collection do
				post :update_multiple
        get :export
        post :import
			end
		end
		  	
		resources :trades do
			collection do
				post :update_multiple
        get :export
        post :import
			end
		end
    
    resources :invoices do
      collection do
        post :update_multiple
        get :export
        post :import
      end
    end  

	end
	
end
