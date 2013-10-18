Hatio::Application.routes.draw do

  resources :domains do
		resources :trades do
			collection do
				post :update_multiple
        get :export
        post :import
			end
		end

	end
	
end
