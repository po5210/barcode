debug_print "Loading [Ops] bundle data..."

domain = Domain.system_domain
admin = User.find_by_login('admin')

User.current_user = admin

puts "Menu creating..."
Menu.setup domain, :Terminal, {:rank => 20000, :category => 'TERMINAL'} do
  submenu :OpsProdStatus, {:rank => 1000, :template => 'Ops.view.prod.ProdMain', :category => 'TERMINAL'}
  submenu :OpsLineStop, {:rank => 1200, :template => 'Ops.view.stop.StopMain', :category => 'TERMINAL'}
  submenu :OpsNotice, {:rank => 1400, :template => 'Ops.view.noti.NoticeMain', :category => 'TERMINAL'}
  submenu :OpsDocs, {:rank => 1500, :template => 'Ops.view.docs.SheetMain', :category => 'TERMINAL'}
end
puts "Menu created!"

puts "Ops service creating..."

#
# OpsController : 공지 사항 주기적 체크
# 
DiyService.setup domain, :OpsNewNotice, {:script_type => 'DSL', :active_flag => true} do
  @service_logic = <<-EOS
  check_required_params(params, ['work_date', 'operation_id'])
  work_date = parse_date(params[:work_date])

  conditions = ["work_date between ? and ?"]
  conditions.push(work_date)
  conditions.push(work_date)

  conditions[0] << " and (notices.operation_id = ? or notices.operation_id is null) and notice_cfms.operation_id is null "
  conditions.push(params[:operation_id])

  notices = self.domain.notices.where(conditions).joins('LEFT OUTER JOIN notice_cfms ON notice_cfms.notice_id = notices.id').includes(:operation).order("created_at asc").first

  results = {}

  if(notices)
    op = notices.operation
    op_name = op ? op.name : ''
    results = {:id => notices.id, :work_date => notices.work_date, :operation => op_name, :msg => notices.msg, :created_at => notices.created_at, :operation_id => notices.operation_id}
  end

  results
  EOS
end

#
# OpsController : 공지 사항 확인 
# 
DiyService.setup domain, :OpsConfirmNotice, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  check_required_params(params, ['notice_id', 'operation_id'])
  cnt = NoticeCfm.where("notice_id = ? and operation_id = ? and check_flag = ?", params[:notice_id], params[:operation_id], true).count

  if(cnt == 0)
    data = {
      :notice_id => params[:notice_id],
      :operation_id => params[:operation_id],
      :check_flag => true,
      :check_time => Time.now
    }
    notice_cfms = NoticeCfm.new(data)
    notice_cfms.save
  end
  EOS
end

#
# Ops > view > prod > ProdMain : 현재 work date의 생산 오더 리스트를 조회 
#
DiyService.setup domain, :OpsGetOrders, {:script_type => 'DSL', :active_flag => true} do
  @service_logic = <<-EOS
  check_required_params(params, ['work_date', 'operation_id', 'shift'])
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
   prod_orders.pallet_qty,
   prod_orders.worker_count"

  joinStr = 
  "prod_orders INNER JOIN machines ON machines.id = prod_orders.machine_id 
   INNER JOIN operations ON operations.id = prod_orders.operation_id 
   INNER JOIN products ON products.id = prod_orders.product_id
   LEFT OUTER JOIN prod_params ON prod_params.operation_id = operations.id and prod_params.machine_id = machines.id and prod_params.product_id = products.id"

  sql = self.domain.prod_orders.select(select).joins(joinStr).where(conditions).order("operations.name, prod_orders.order_seq, machines.name").to_sql
  results = ProdOrder.connection.select_all(sql)
  results
  EOS
end

#
# Ops > view > prod > AddPlan : 계획 추가 
# 
DiyService.setup domain, :OpsAddPlan, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  check_required_param(params, 'addPlans')
  ProdOrder.add_orders(params)
  {"success" => true, "message" => "Success"}
  EOS
end

#
# Ops > view > prod > AddPlan : 계획 추가를 위한 품목 조회 
# 
DiyService.setup domain, :OpsGetProducts, {:script_type => 'DSL', :active_flag => true} do
  @service_logic = <<-EOS
  check_required_params(params, ['operation_id', 'machine_id'])
  prod_name = params['_q']['name-like'] if(params['_q'])

  page = (params[:page] || 1).to_i
  limit = (params[:limit] || 25).to_i
  offset = (page - 1) * limit

  conditions = ["prod_params.operation_id = ? and prod_params.machine_id = ?"]
  conditions.push(params[:operation_id])
  conditions.push(params[:machine_id])

  if(prod_name && !prod_name.blank?)
    conditions[0] << " and products.name like '%\#{prod_name}%'"
  end

  total_count = self.domain.prod_params.joins(:operation, :machine, :product).where(conditions).count
  sql = self.domain.prod_params.select("prod_params.product_id id, products.name, products.description").joins(:operation, :machine, :product).where(conditions).limit(limit).offset(offset).to_sql
  results = ProdParam.connection.select_all(sql)

  {"items" => results, "success" => true, "total" => total_count}
  EOS
end

#
# Ops > view > prod > AddScrap : 불량 등록 
# 
DiyService.setup domain, :OpsAddScrap, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  check_required_params(params, ['prod_order_id', 'work_date', 'operation_id', 'shift', 'defect_info'])

  operation = self.domain.operations.find(params[:operation_id])
  workcenter = self.domain.workcenters.find(operation.workcenter_id)

  dept_type = workcenter.dept_type
  work_date = parse_date(params[:work_date])
  shift = params[:shift]
  operation_id = params[:operation_id]
  defect_list = ActiveSupport::JSON.decode(params[:defect_info])

  sum_defect_qty = 0

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
    defect = self.domain.defects.new(data)
    defect.save!
  end

  prod_order = self.domain.prod_orders.find(params[:prod_order_id])
  prod_order.rework_qty += params[:rework_qty].to_i
  prod_order.save!

  {"success" => true, "message" => "success"}
  EOS
end

#
# Ops > view > prod > ProdMain : 작업 개시시에 작업자 리스트 조회
# 
DiyService.setup domain, :OpsGetStartOperators, {:script_type => 'DSL', :active_flag => true} do
  @service_logic = <<-EOS
  check_required_param(params, 'prod_order_id')
  prod_order_id = params[:prod_order_id]
  results = []

  current_order = self.domain.prod_orders.find(prod_order_id)
  prv_run_order = self.domain.prod_orders.where("id != ? and order_date = ? and shift = ? and operation_id = ? and machine_id = ? and status = 'R'", prod_order_id, current_order.order_date, current_order.shift, current_order.operation_id, current_order.machine_id).first
  
  if(prv_run_order)
      cond = ["prod_order_id = ? and end_time is null", prv_run_order.id]
      wts = WorkerTime.select('user_id').includes(:user).where(cond).group('user_id')
      wts.each { |wt| results.push({:user => {:id => wt.user_id, :name => wt.user.name}}) } if(wts.length > 0)
  end

  if(results.empty?)
      cond = ["prod_order_id = ?", prod_order_id]
      wts = WorkerTime.select('user_id').includes(:user).where(cond).group('user_id')
      wts.each { |wt| results.push({:user => {:id => wt.user_id, :name => wt.user.name}}) } if(wts.length > 0) 
  end

  if(results.empty?)
      sql = OperationsUsers.select("users.id user_id, users.name user_name").joins(:user).where("operation_id = ?", current_order.operation_id).to_sql
      ous = OperationsUsers.connection.select_all(sql)
      ous.each { |ou| results.push({:user => {:id => ou['user_id'], :name => ou['user_name']}}) }
  end

  results
  EOS
end

#
# Ops > view > prod > ModifyOperator : 작업자 변경시에 작업자 리스트 조회
# 
DiyService.setup domain, :OpsGetJobOperators, {:script_type => 'DSL', :active_flag => true} do
  @service_logic = <<-EOS
  check_required_param(params, 'prod_order_id')
  prod_order_id = params[:prod_order_id]
  results = []
  conditions = ["prod_order_id = ?"]
  conditions.push(params[:prod_order_id])
      
  wts = WorkerTime.includes(:user).where(conditions).order('start_time')
  wts.each do |wt|
    results.push({:user => {:id => wt.user_id, :name => wt.user.name}, :start_time => wt.start_time, :end_time => wt.end_time, :id => wt.id})
  end

  results
  EOS
end

#
# Ops > view > prod > ProdMain : 작업 개시 
# 
DiyService.setup domain, :OpsStartOrder, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  operators = params.delete(:operators)
  prod_order_id = params[:prod_order_id]
  order = self.domain.prod_orders.find(prod_order_id)  

  firstJob = true
  prv_order = self.domain.prod_orders.where("order_date = ? and shift = ? and operation_id = ? and machine_id = ? and status = ?", order.order_date, order.shift, order.operation_id, order.machine_id, 'R').first

  unless(prv_order)
    cnt = self.domain.prod_orders.where("order_date = ? and shift = ? and operation_id = ? and machine_id = ? and status = ?", order.order_date, order.shift, order.operation_id, order.machine_id, 'T').count
    firstJob = false if(cnt > 0)
  else
    firstJob = false
    prv_order.change_status_to_term 
  end
  
  start_time = firstJob ? self.domain.shift.shift_start_time(self.domain.shift.current_work_date, self.domain.shift.current_shift) : Time.now
  operator_list = ActiveSupport::JSON.decode(operators)
  
  operator_list.each do |operator_id|
    data = {
      :prod_order_id => prod_order_id,
      :user_id => operator_id,
      :start_time => start_time
    }
    worker_time = WorkerTime.new(data)
    worker_time.save!
  end

  order.change_status_to_run
  
  {"success" => true, "message" => "success"}
  EOS
end

#
# Ops > view > prod > ProdMain, ModifyOperator : 작업 종료 
# 
DiyService.setup domain, :OpsEndOrder, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
   check_required_param(params, 'prod_order_id')
   prod_order = ProdOrder.find(params[:prod_order_id])
   prod_order.change_status_to_term
  {"success" => true, "message" => "Success"}
  EOS
end

#
# Ops > view > prod > ProdMain, ModifyOperator : 작업 종료 
# 
DiyService.setup domain, :OpsSaveOperators, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  check_required_param(params, 'prod_order_id')

  new_times = params[:new_worker_times] unless(params[:new_worker_times].blank?)
  modified_times = params[:modified_worker_times] unless(params[:modified_worker_times].blank?)
  removed_times = params[:removed_worker_times] unless(params[:removed_worker_times].blank?)

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
      data ={
        :prod_order_id => params['prod_order_id'],
        :user_id => new_worker_time['user_id'],
        :start_time => parse_time(new_worker_time['start_time']),
        :end_time => (new_worker_time['end_time']) ? parse_time(new_worker_time['end_time']) : nil
      }
      worker_time = WorkerTime.new(data)
      worker_time.save!
    end
  end

  {"success" => true, "message" => "Success"}
  EOS
end

#
# Ops > view > prod > ProdList : 생산 Lot 리스트에서 작업 취소 
# 
DiyService.setup domain, :OpsCancelLot, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  check_required_params(params, ['lot_id'])
  lot = Lot.find(params[:lot_id])
  lot.cancel_lot
  {:success => true, :msg => 'Success' }
  EOS
end

#
# Ops > view > scan > AutoOutput : Lot scan
# 
DiyService.setup domain, :OpsDoScan, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  prod_order = self.domain.prod_orders.find(params[:prod_order_id])  
  prod_order.operation.scan(params, prod_order)
  prod_order = self.domain.prod_orders.find(prod_order.id)
  {"success" => true, "message" => "Success", "actual_qty" => prod_order.actual_qty}
  EOS
end

#
# Ops > view > scan > ManualOutput : Manual 실적 입력 
# 
DiyService.setup domain, :OpsDoManualInput, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  prod_order = self.domain.prod_orders.find(params[:prod_order_id])  
  prod_order.operation.scan_manual_type(prod_order, params)
  prod_order = self.domain.prod_orders.find(params[:prod_order_id])
  {"success" => true, "message" => "Success", "actual_qty" => prod_order.actual_qty}
  EOS
end

#
# Std > prod > controller > ProdOrder : Order 실적 수정 
# 
DiyService.setup domain, :OpsModifyActual, {:script_type => 'DSL', :active_flag => true, :atomic_flag => true} do
  @service_logic = <<-EOS
  prod_order = self.domain.prod_orders.find(params[:prod_order_id])  
  prod_order.modify_actual(params)
  {"success" => true, "message" => "Success"}
  EOS
end

puts "Ops service created!"

puts "Completed to load [Ops] bundle data!"