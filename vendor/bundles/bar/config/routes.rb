Hatio::Application.routes.draw do

  resources :domains do
		resources :bar_matouts do
			collection do
				post :update_multiple
			end
		end

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
      member do
        get :print_master
        get :print_detail
        get :update_to_printed
      end
    end
    
    resources :instocks do
      collection do
        get :instock_info
        get :instock_detail_info
        post :update_multiple
        get :print_master
        get :print_details
      end
    end    

	end
	
end
