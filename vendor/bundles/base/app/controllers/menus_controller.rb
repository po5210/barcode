class MenusController < DomainResourcesController
  
  skip_before_filter :verify_authenticity_token  
  
  def index
    mode = params[:mode].blank? ? 'MENU' : params[:mode]
    # 권한 적용시 아래 주석 해제 
    if(mode != 'AUTH')
      conditions, include_arr, order_str, limit, offset = search_filter resource_class
      @total_count = collection.where(conditions).count
      @collection = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
    else
      role_id_arr = current_user.roles.collect { |role| role.id }
      # 역할이 없는 경우는 ?
      sql = auth_query(role_id_arr)
      @collection = Menu.connection.select_all(sql)
      @total_count = @collection.size
      
      respond_to do |format|
        format.html { render :layout => true, :status => @error_status_code ? @error_status_code : "200" }
        format.xml { render :xml => {:items => @collection, :total => @total_count, :success => true} } 
        format.json { render :json => {:items => @collection, :total => @total_count, :success => true} }
      end
    end
  end
  
  # POST domains/:domain_id/menus/update_multiple_submenus.json
  def update_multiple_submenus
    delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data])
    # 1. delete
    self.destroy_multiple_data(Menu, delete_list)
    # 2. update
    self.update_multiple_data(Menu, update_list, 'id', [], {})
    # 3. create
    self.create_multiple_data(Menu, create_list, true, 'id', [], {})
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
  #
  # Negative rule
  # TODO : 한 사용자가 역할이 여러개 일 경우 최대 공약수로 적용 필요, 현재 최소공배수로 처리 ... 
  # 일단 오라클 쿼리로 구현, TODO Standard화 필요 
  #
  # def auth_query(role_id_list)
  #   sql = <<-EOS
  #   select 
  #     menu.id, menu.name, menu.description, menu.parent_id, menu.entity_id, menu.template, menu.menu_type, menu.category, menu.rank, not_pmss.auth, menu.creator_id, menu.created_at, menu.updater_id, menu.updated_at
  #   from
  #     -- menu that has permissions, if show checked we regard to no permission
  #     (select 
  #       * 
  #     from 
  #       menus 
  #     where 
  #       id not in (select distinct(resource_id) from permissions where resource_type = 'Menu' and role_id in ('#{role_id_list.join("','")}') and action_name = 'show')
  #     ) menu,
  # 
  #     -- menu that has no permissions
  #     (select
  #       m.id, m.name, concat(concat(p.c || ',', p.u) || ',', p.d) auth
  #     from
  #       menus m,
  #       (select 
  #         resource_id menu_id, 
  #         max(decode(action_name, 'create', 'C', '')) c,
  #         max(decode(action_name, 'update', 'U', '')) u,
  #         max(decode(action_name, 'delete', 'D', '')) d
  #       from 
  #         permissions
  #       where
  #         resource_type = 'Menu' and role_id in ('#{role_id_list.join("','")}') and action_name != 'show'
  #         group by resource_id) p
  #     where 
  #       m.id = p.menu_id) not_pmss
  #   where
  #     menu.id = not_pmss.id(+)
  #   order by menu.rank asc
  #   EOS
  #   return sql
  # end
  
  #
  # Positive rule
  # 일단 오라클 쿼리로 구현, TODO Standard화 필요 
  #
  def auth_query(role_id_list)
    if(role_id_list && !role_id_list.empty?)
    sql = <<-EOS
      select
        m.id, m.name, m.description, m.category, m.parent_id, m.template, m.menu_type, m.rank, concat(p.r || ',', concat(concat(p.c || ',', p.u) || ',', p.d)) auth
      from
        menus m,
        (select 
          resource_id menu_id, 
          max(decode(action_name, 'show',   'R', '')) r,
          max(decode(action_name, 'create', 'C', '')) c,
          max(decode(action_name, 'update', 'U', '')) u,
          max(decode(action_name, 'delete', 'D', '')) d
        from 
          permissions
        where
          resource_type = 'Menu' and role_id in ('#{role_id_list.join("','")}')
        group by resource_id) p
      where 
        m.id = p.menu_id and m.hidden_flag != 1 and p.r = 'R' order by m.rank asc
      EOS
      return sql
    else
      # 역할이 없다면 일단 모든 메뉴를 내려준다.
      # sql = "select id, name, description, category, parent_id, template, menu_type, rank, '' auth from menus where parent_id is null and hidden_flag != 1 order by rank asc"
      sql = "select id, name, description, category, parent_id, template, menu_type, rank, '' auth from menus where hidden_flag != 1 order by rank asc"
      return sql
    end
  end
  
end
