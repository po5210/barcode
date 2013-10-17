module OpsActualHelper
  
  #
  # Lot 실적 처리 
  #
  def scan_label
    check_required_params(params, ['prod_order_id', 'label_no'])
    prod_order = ProdOrder.find(params[:prod_order_id])
    Lot.raise_if_exist(params[:label_no])
    # 1. Lot 생성 
    lot = Lot.new_lot(params[:label_no], prod_order)
    # 2. 실적 처리
    Lot.transaction do
      lot.actual_qty = params[:actual_qty] unless params[:actual_qty].blank?
      lot.status = "TERMINATED"
      lot.save!
      # 자재 매핑
      self.subtract_bom_inv(lot) if(lot.operation.rm_input_flag)
    end
  end
  
  #
  # store에 존재하는 rm lot과 mapping
  #
  def subtract_bom_inv(lot)
    boms = lot.product.child_half_products
    return if(boms.size == 0)
    
    # TODO bom에 포함되어 있는 자품목과 input_operation으로 재고가 있는 공정을 한번에 조회 
    boms.each do |bom|
      next if(bom['child_product_id'].blank? || bom['child_product_id'] == lot.product_id || bom['qty'].to_i == 0)
      bom_qty = bom['qty'].to_i
      
      # 재고를 빼야 하는 수량 계산 : 자품목의 수량 * actual_qty
      track_out_qty = bom_qty * lot.actual_qty
      next if track_out_qty <= 0
      
      while(track_out_qty > 0) do
        input_lot = @domain.lots.where("input_op = ? and product_id = ? and track_qty > 0", lot.operation.name, bom['child_product_id']).order("input_time asc").first
        if(input_lot)
          track_out_qty = self.mapping_lot(input_lot, lot, track_out_qty)
        else
          track_out_qty = 0
        end
      end
    end
  end
  
  #
  # LOT - LOT Mapping
  #
  def mapping_lot(input_lot, parent_lot, cur_track_qty)
    return 0 if cur_track_qty <= 0    
    mapping_qty = (cur_track_qty >= input_lot.track_qty) ? input_lot.track_qty : cur_track_qty
    input_lot.track_qty -= mapping_qty
    input_lot.save!
    
    # Lot & Lot mapping
    LotsRms.create!(:lot_id => parent_lot.id, :rm_lot_id => input_lot.id, :use_qty => mapping_qty)
    return (cur_track_qty - mapping_qty)
  end
  
  # 
  # Lot 실적 처리 전에 validation 
  # BOM 중에 Raw Material이 아닌 품목의 Inventory만 체크해서 하나라도 존재하지 않으면 에러 ...
  #
  def check_valid_lot
    check_required_params(params, ['prod_order_id'])
    prod_order = ProdOrder.find(params[:prod_order_id])
    raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.invalid_order') unless prod_order
    Lot.validate_label(params[:label_no], prod_order)
    Lot.raise_if_exist(params[:label_no])
    act_qty = params[:label_no].split('|')[5]
    act_qty = act_qty.to_i
    raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.invalid_qty') if(act_qty < 1)
    # material inventory를 체크한다. 
    self.check_material_inv(prod_order, act_qty)
  end
  
  # 
  # Actual Scan 시점에 BOM Validation
  # BOM 중에 Raw Material이 아닌 품목의 Inventory만 체크해서 하나라도 존재하지 않으면 에러 ...
  #
  def check_material_inv(prod_order, act_qty)
    # 해당 품목의 BOM 정보를 얻는다.
    op = prod_order.operation
    boms = prod_order.product.child_half_products
    return if(boms.size == 0)
    
    # 자재 투입 공정인 경우는 현재 공정의 생산 품목의 BOM에 해당하는 자재(반제품)이 투입된 것이 있는지 체크한다. For tracking
    if(op.rm_input_flag)
      boms.each do |bom|
        next if(bom['child_product_id'].blank? || bom['child_product_id'] == prod_order.product_id || bom['qty'].to_i == 0)
        track_qty = bom['qty'].to_i * act_qty
        next if track_qty <= 0        
        inv_lot = @domain.lots.where("input_op = ? and product_id = ? and track_qty >= ?", op.name, bom['child_product_id'], track_qty).first
        raise Hatio::Exception::ValidationWarning, (I18n.translate 'error.insufficient_inv_qty') + " : #{bom['child_product_id']}" unless(inv_lot)
      end
    # WIP을 차감하는 공정인 경우는 해당 store에 현재 자재(반제품) 수량이 있는지 체크한다. For inventory
    elsif(op.track_rm_store)
      boms.each do |bom|
        next if(bom['child_product_id'].blank? || bom['child_product_id'] == prod_order.product_id || bom['qty'].to_i == 0)
        inv_out_qty = bom['qty'].to_i * act_qty
        next if inv_out_qty <= 0        
        inv = @domain.inventories.where("store_id = ? and product_id = ?", self.track_rm_store_id, bom['child_product_id']).first
        raise Hatio::Exception::ValidationWarning, (I18n.translate 'error.insufficient_inv_qty') + " : Inventory Not Found #{bom['child_product']}" unless(inv)
        raise Hatio::Exception::ValidationWarning, (I18n.translate 'error.insufficient_inv_qty') + " : #{bom['child_product']}" if(!inv.qty || inv.qty < inv_out_qty)
      end
    end
  end
  
  #
  # 매뉴얼 수량 처리, 수량 Based 실적 업데이트
  #
  def add_manual_actual
    check_required_params(params, ['prod_order_id', 'actual_qty', 'description'])
    prod_order = ProdOrder.find(params[:prod_order_id])
    actual_qty = params[:actual_qty].to_i
    QtyActual.transaction do
      QtyActual.add_actual(prod_order, actual_qty, 0, nil, 0, params[:description])
    end
  end
  
  #
  # 자재 투입 전 validation
  #
  def validate_prod_input
    check_required_params(params, ['prod_order_id', 'label_no'])
    prod_order = ProdOrder.find(params[:prod_order_id])
    raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.invalid_order') unless prod_order
    
    # 1. Check Label Validation
    label_no = params[:label_no]
    label_arr = label_no.split('|')
    raw_product = @domain.products.find_by_name(label_arr[2])
    raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.product_not_exist') + '(Product : ' + label_arr[2] + ')' unless(raw_product)
    
    # 2. Check BOM
    self.check_valid_bom(prod_order, raw_product)
  end
  
  #
  # 현재 공정에서 생산 진행 중인 오더를 찾아서 product를 찾고 BOM validation 체크 
  #
  def check_valid_bom(prod_order, raw_product)
    # 쿼리로 validation check
    count = @domain.product_parts.where("parent_product_id = ? and child_product_id = ?", prod_order.product_id, raw_product.id).count
    raise Hatio::Exception::ValidationWarning, (I18n.translate 'error.bom_mismatch_rm') if(count == 0)
  end
  
  #
  # 자재 투입 처리 
  #
  def do_prod_input
    check_required_params(params, ['prod_order_id', 'label_no'])
    prod_order = ProdOrder.find(params[:prod_order_id])
    Lot.raise_if_not_exist(params[:label_no])
    lot = Lot.find_by_name(params[:label_no])
    raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.lot_already_input') if(lot.input_time)

    # 공정에 자재 투입
    Lot.transaction do
      lot.track_qty = lot.actual_qty
      lot.input_time = Time.now
      lot.input_op = prod_order.operation.name
      lot.save!
    end
  end
  
  #
  # 자재 투입 현황 
  #
  def list_prod_input
    check_required_param(params, 'input_op-eq')
    page = (params[:page] || 1).to_i
    limit = (params[:limit] || 30).to_i
    offset = (page - 1) * limit
    op_name = params['input_op-eq']

    total_count = @domain.lots.where("input_op = ? and track_qty > 0", op_name).count
    input_lots = @domain.lots.joins(:product).where("input_op = ? and track_qty > 0", op_name).order("input_time desc").limit(limit).offset(offset)
    results = input_lots.collect do |input_lot|
      {
        :id => input_lot.id,
        :input_op => input_lot.input_op,
        :lot_no => input_lot.lot_no,
        :serial_no => input_lot.serial_no,
        :product => {:id => input_lot.product_id, :name => input_lot.product.name, :desc => input_lot.product.description},
        :actual_qty => input_lot.actual_qty,
        :track_qty => input_lot.track_qty,
        :inv_qty => input_lot.inv_qty,
        :input_time => input_lot.input_time
      }
    end

    {"items" => results, "total" => total_count}
  end
  
end