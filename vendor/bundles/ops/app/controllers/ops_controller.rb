class OpsController < DomainResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  include OpsActualHelper
  include OpsProdHelper
  
  public

  #
  # Job List
  # GET /domains/:domain_id/ops/job_orders
  # Source Ops.controller.prod.ProdMain
  #  
  def job_orders
    result = self.list_orders
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Add Plan
  # POST /domains/:domain_id/ops/create_order
  # Source Ops.controller.prod.AddPlan
  #
  def create_order
    self.add_orders
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Start Order
  # POST /domains/:domain_id/ops/start_order
  # Source Ops.controller.prod.JobStart
  #
  def start_order
    self.do_start_order
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # End Order
  # POST /domains/:domain_id/ops/end_order
  # Source Ops.controller.prod.ProdMain
  #
  def end_order
    self.do_end_order
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Job Operator List
  # GET /domains/:domain_id/ops/job_operators
  # Source Ops.view.prod.ModifyOperator
  #
  def job_operators
    result = self.list_lob_operators
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Save Job Operators
  # POST /domains/:domain_id/ops/save_job_operators
  # Source Ops.controller.prod.ModifyOperator
  #
  def save_job_operators
    self.update_job_operators
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Add Scrap
  # POST /domains/:domain_id/ops/create_scrap
  # Source Ops.controller.prod.AddScrap
  #
  def create_scrap
    self.add_scrap
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end

  #
  # Update Lot
  # POST /domains/:domain_id/ops/update_lot
  # Source Ops.controller.prod.ModifyLot
  #  
  def update_lot
    check_required_params(params, ['lot_id', 'modify_qty'])
    lot = Lot.find(params[:lot_id])
    lot.actual_qty = lot.actual_qty + params[:modify_qty].to_i
    lot.description = params[:description]
    lot.save!
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Delete Lot
  # POST /domains/:domain_id/ops/delete_lot
  # Source Ops.controller.prod.ProdList
  #
  def delete_lot
    check_required_params(params, ['lot_id'])
    Lot.destroy(params[:lot_id])
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Lot scan 전 validation 
  # GET /domains/:domain_id/ops/validate_lot
  # Source Ops.controller.scan.AutoOutput
  #
  def validate_lot
    self.check_valid_lot
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Scan Lot
  # POST /domains/:domain_id/ops/scan_lot
  # Source Ops.controller.scan.AutoOutput
  #
  def scan_lot
    self.scan_label
    prod_order = @domain.prod_orders.find(params[:prod_order_id])
    result = {"success" => true, "message" => "Success", "actual_qty" => prod_order.actual_qty}    
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # Manual Output
  # POST /domains/:domain_id/ops/do_manual_output
  # Source Ops.controller.scan.ManualOutput
  #
  def do_manual_output
    self.add_manual_actual
    prod_order = @domain.prod_orders.find(params[:prod_order_id])
    result = {"success" => true, "message" => "Success", "actual_qty" => prod_order.actual_qty}    
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # 생산 투입 전 validation check
  # POST /domains/:domain_id/ops/check_prod_input
  # Source Ops.controller.scan.ProdInput
  #
  def check_prod_input
    self.validate_prod_input
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # 생산 투입 처리 
  # POST /domains/:domain_id/ops/do_prod_input
  # Source Ops.controller.scan.ProdInput
  #
  def prod_input
    self.do_prod_input
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # 생산 투입 현황 
  # GET /domains/:domain_id/ops/prod_inputs
  # Source Ops.controller.scan.ProdInputMain
  #
  def prod_inputs
    results = self.list_prod_input
    results[:success] = true
    
    respond_to do |format|
      format.xml { render :xml => results } 
      format.json { render :json => results }
    end
  end
  
  #
  # 생산 투입 취소 
  # GET /domains/:domain_id/ops/prod_inputs
  # Source Ops.controller.scan.ProdInputMain
  #
  def cancel_prod_input
    check_required_params(params, ['lot_id', 'mode'])
    lot = Lot.find(params[:lot_id])
    lot.track_qty = 0
    lot.input_time = nil
    lot.input_op = nil
    lot.save!
    result = {"success" => true, "message" => "Success"}
    
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # 자재 요청  
  # GET /domains/:domain_id/ops/request_material
  # Source Ops.controller.prod.RequestMaterial
  #
  def request_material
    check_required_params(params, ['prod_order_id', 'request_time', 'request_date', 'remote_ip', 'request_qty', 'requestor_id'])
    prod_order = ProdOrder.find(params[:prod_order_id])
    
    #sql = "select max(req_seq) from bar_item_req where req_date = '#{params[:request_date]}' and routing = '#{prod_order.operation.name}' and item_id = '#{prod_order.product.name}'"
    #seq = DiyService.connection.select_all(sql)
    #req_seq = seq[0]['max(req_seq)'].blank? ? 1 : (seq[0]['max(req_seq)'].to_i + 1)
    #insert_sql = "insert into bar_item_req (req_date, routing, item_id, req_seq, machine_id, lot_size, req_qty, req_id, reg_dtm, reg_ip) values ('#{params[:request_date]}', '#{prod_order.operation.name}', '#{prod_order.product.name}', '#{req_seq}', 'prod_order.machine_id', '#{prod_order.product.default_qty}', '#{params[:request_qty]}', '#{params[:requestor_id]}', '#{params[:request_time]}', '#{params[:remote_ip]}')"
    #DiyService.connection.insert(insert_sql)

    result = {"success" => true, "message" => "Success"}
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
  #
  # WIP Input
  # GET /domains/:domain_id/ops/wip_input
  # Source Ops.controller.scan.WipInput
  #
  def wip_input
    check_required_params(params, ['prod_order_id', 'label_no'])
    Lot.raise_if_exist(params[:label_no])
    prod_order = ProdOrder.find(params[:prod_order_id])
    raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.prod_order_not_exist') unless prod_order

    Lot.validate_label(params[:label_no], prod_order)
    label_arr = params[:label_no].split('|')
    op = prod_order.operation
    
    lot = @domain.lots.new
    lot.name = params[:label_no]
    lot.operation_id = op.id
    lot.machine_id = prod_order.machine_id
    lot.product_id = prod_order.product_id
    lot.lot_no = label_arr[3]
    lot.serial_no = label_arr[4]
    lot.actual_qty = label_arr[5].to_i
    lot.action = 'WIP'
    lot.lot_type = 'WIP'
    lot.work_date = @domain.shift.current_work_date
    lot.shift = @domain.shift.current_shift
    lot.save!
    
    if(op.inv_flag)
      inv = Inventory.find_inv(@domain, lot.operation_id, lot.product_id)
      inv.lot_type = 'WIP'
      inv.lot_id = lot.id
      inv.description = "WIP : #{lot.actual_qty}"
      inv.machine_id = lot.machine_id
      inv.inv_in(lot.actual_qty)
    end
        
    result = {"success" => true, "message" => "Success"}
    respond_to do |format|
      format.xml { render :xml => result } 
      format.json { render :json => result }
    end
  end
  
end
