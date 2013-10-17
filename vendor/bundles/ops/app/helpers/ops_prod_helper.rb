module OpsProdHelper
  
  #
  # Prod. Status의 리스트 조회 - 날짜(work_date), 시프트(shift), 공정(operation_id) 정보 필수 
  #
  def list_orders
    check_required_params(params, ['work_date', 'shift', 'operation_id'])
    work_date = parse_date(params[:work_date])

    conditions = ["prod_orders.order_date = ?"]
    conditions.push(work_date)

    conditions[0] << " and prod_orders.shift = ?"
    conditions.push(params[:shift])

    conditions[0] << " and prod_orders.operation_id = ?"
    conditions.push(params[:operation_id])

    unless(params[:machine_id].blank?)
      conditions[0] << " and prod_orders.machine_id = ?"
      conditions.push(params[:machine_id])
    end

    select = 
    "prod_orders.id, 
     prod_orders.order_date,
     prod_orders.shift,
     machines.name machine,
     machines.id machine_id,
     machines.description machine_desc,
     operations.id operation_id,
     operations.name operation,
     operations.description operation_desc,
     products.id product_id,
     products.name product,
     products.description product_desc,
     prod_orders.status,
     prod_orders.order_seq,
     prod_orders.actual_start_time,
     prod_orders.actual_end_time,
     prod_orders.order_qty,
     prod_orders.actual_qty,
     prod_orders.defect_qty,
     prod_orders.rework_qty,
     prod_orders.pallet_qty"

    joinStr = 
    "prod_orders INNER JOIN machines ON machines.id = prod_orders.machine_id 
     INNER JOIN operations ON operations.id = prod_orders.operation_id 
     INNER JOIN products ON products.id = prod_orders.product_id
     LEFT OUTER JOIN prod_params ON prod_params.operation_id = operations.id and prod_params.machine_id = machines.id and prod_params.product_id = products.id"

    sql = @domain.prod_orders.select(select).joins(joinStr).where(conditions).order("operations.name, prod_orders.order_seq, machines.name").to_sql
    ProdOrder.connection.select_all(sql)
  end
  
  #
  # 오더 추가
  #
  def add_orders
    check_required_param(params, 'new_orders')
    new_orders = ActiveSupport::JSON.decode(params[:new_orders])
    ProdOrder.transaction do
      new_orders.each do |new_order|
        product = @domain.products.find(new_order['product_id'])
        prod_param = @domain.prod_params.where("operation_id = ? and machine_id = ? and product_id = ?", new_order['operation_id'], new_order['machine_id'], new_order['product_id']).first
        new_order[:order_date] = parse_date(new_order['order_date'])
        new_order[:product_id] = new_order['product_id']
        new_order[:order_seq] = 99
        new_order[:uph] = prod_param.target_uph if(prod_param)
        new_order[:cycletime] = prod_param.cycletime if(prod_param)
        new_order[:pallet_qty] = product.default_qty
        @domain.prod_orders.create!(new_order)
      end
    end
  end
  
  #
  # 작업 시작 
  #
  def do_start_order
    check_required_params(params, ['prod_order_id', 'operators'])
    operators = params.delete(:operators)
    prod_order_id = params[:prod_order_id]
    order = ProdOrder.find(prod_order_id)  

    firstJob = true
    prv_order = @domain.prod_orders.where("order_date = ? and shift = ? and operation_id = ? and machine_id = ? and status = ?", order.order_date, order.shift, order.operation_id, order.machine_id, 'R').first

    ProdOrder.transaction do
      unless(prv_order)
        cnt = @domain.prod_orders.where("order_date = ? and shift = ? and operation_id = ? and machine_id = ? and status = ?", order.order_date, order.shift, order.operation_id, order.machine_id, 'T').count
        firstJob = false if(cnt > 0)
      else
        firstJob = false
        prv_order.change_status_to_term 
      end
      
      start_time = firstJob ? @domain.shift.shift_start_time(@domain.shift.current_work_date, @domain.shift.current_shift) : Time.now
      operator_list = ActiveSupport::JSON.decode(operators)
      
      operator_list.each do |operator_id|
        @domain.worker_times.create!({
          :prod_order_id => prod_order_id,
          :user_id => operator_id,
          :start_time => start_time
        })
      end
      
      order.change_status_to_run
    end
  end
  
  #
  # 작업 종료 
  #
  def do_end_order
    check_required_param(params, 'prod_order_id')
    prod_order = ProdOrder.find(params[:prod_order_id])
    ProdOrder.transaction do
      prod_order.change_status_to_term
    end
  end
  
  #
  # 작업의 작업자 리스트 조회  
  #
  def list_lob_operators
    check_required_param(params, 'prod_order_id')
    wts = WorkerTime.includes(:user).where("prod_order_id = ?", params[:prod_order_id]).order('start_time')
    wts.collect do |wt|
      {:user => {:id => wt.user_id, :name => wt.user.name}, :start_time => wt.start_time, :end_time => wt.end_time, :id => wt.id}
    end
  end
  
  #
  # 작업의 작업자 정보 업데이트
  #
  def update_job_operators
    check_required_param(params, 'prod_order_id')

    new_times = params[:new_worker_times] unless(params[:new_worker_times].blank?)
    modified_times = params[:modified_worker_times] unless(params[:modified_worker_times].blank?)
    removed_times = params[:removed_worker_times] unless(params[:removed_worker_times].blank?)

    WorkerTime.transaction do
      if(removed_times)
        removed_worker_times = ActiveSupport::JSON.decode(removed_times)
      
        removed_worker_times.each do |removed_worker_time|
          worker_time = WorkerTime.find(removed_worker_time['id'])
          worker_time.destroy
        end
      end
      
      if(modified_times)
        modified_worker_times = ActiveSupport::JSON.decode(modified_times)
      
        modified_worker_times.each do |modified_worker_time|
          worker_time = WorkerTime.find(modified_worker_time['id'])
          if(worker_time)
            worker_time.user_id = modified_worker_time['user_id']
            worker_time.start_time = parse_time(modified_worker_time['start_time'])
            worker_time.end_time = (modified_worker_time['end_time']) ? parse_time(modified_worker_time['end_time']) : nil
          end
          worker_time.save!
        end
      end
      
      if(new_times)
        new_worker_times = ActiveSupport::JSON.decode(new_times)
      
        new_worker_times.each do |new_worker_time|
          worker_time = WorkerTime.create!({
            :prod_order_id => params['prod_order_id'],
            :user_id => new_worker_time['user_id'],
            :start_time => parse_time(new_worker_time['start_time']),
            :end_time => (new_worker_time['end_time']) ? parse_time(new_worker_time['end_time']) : nil
          })
        end
      end
    end
  end
  
  #
  # 스크랩 추가 
  #
  def add_scrap
    check_required_params(params, ['prod_order_id', 'work_date', 'operation_id', 'shift', 'defect_info'])
    operation = @domain.operations.find(params[:operation_id])
    workcenter = @domain.workcenters.find(operation.workcenter_id)

    dept_type = workcenter.dept_type
    work_date = parse_date(params[:work_date])
    shift = params[:shift]
    operation_id = params[:operation_id]
    defect_list = ActiveSupport::JSON.decode(params[:defect_info])
    sum_defect_qty = 0
    
    ProdOrder.transaction do
      defect_list.each do |defect_info|
        data = {
          :prod_order_id => params[:prod_order_id],
          :dept_type => dept_type,
          :work_date => work_date,
          :shift => shift,
          :operation_id => operation_id,
          :machine_id => defect_info['machine_id'],
          :product_id => defect_info['product_id'],
          :defect_code_id => defect_info['defect_code_id'],
          :defect_qty => defect_info['defect_qty']
        }
        sum_defect_qty += defect_info['defect_qty']
        @domain.defects.create!(data)
      end
      
      prod_order = @domain.prod_orders.find(params[:prod_order_id])
      prod_order.rework_qty += params[:rework_qty].to_i
      prod_order.save!
    end
  end
  
end