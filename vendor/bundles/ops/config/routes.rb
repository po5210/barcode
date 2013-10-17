Hatio::Application.routes.draw do

  resources :domains do
    resources :ops do
      collection do
        get :job_orders
        post :create_order
        post :start_order
        post :end_order
        get :job_operators
        post :save_job_operators
        post :create_scrap
        get :validate_lot
        post :delete_lot
        post :scan_lot
        post :do_manual_output
        post :delete_lot
        post :update_lot
        post :check_prod_input
        post :prod_input
        get :prod_inputs
        post :cancel_prod_input
        post :request_material
        post :wip_input
      end
    end
  end
  
end
