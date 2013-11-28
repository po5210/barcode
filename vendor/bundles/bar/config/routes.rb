Hatio::Application.routes.draw do

  resources :domains do
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

	end
	
end
