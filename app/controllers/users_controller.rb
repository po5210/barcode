class UsersController < ApplicationController
  
  before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token
  respond_to :html, :xml, :json, :xls
  
  def add_user
    params[:user][:default_domain] = @domain if(params[:user][:default_domain].blank?)
    params[:user][:lang] = GlobalConfig.default_lang if(params[:user][:lang].blank?)
    params[:user][:timezone] = GlobalConfig.default_timezone if(params[:user][:timezone].blank?)
    @user = User.create!(params[:user], :without_protection => true)
    
    respond_to do |format|
      format.xml  { render :xml => @user }
      format.json { render :json => @user }
    end
  end
  
  def index
    conditions, include_arr, order_str, limit, offset = search_filter User
    @total_count = User.where(conditions).count
    @users = User.where(conditions).order(order_str).limit(limit).offset(offset)
  end

  def show
    @user = User.find(params[:id])
  end

  # GET /users/edit/1
  def edit
    @user = User.find(params[:id])
  end
  
  # PUT /users/1
  def update
    @user = User.find(params[:id])
    pw = params[:user].delete(:password)
    pw_cfm = params[:user].delete(:password_confirmation)
    @user.dept = params[:user][:dept] if(!params[:user][:dept].blank?)

    # Password 변경 ...
    unless(pw.blank?)
      if(pw == pw_cfm)
        @user.password = pw
        @user.password_confirmation = pw
      else
        raise "Password and password confirmation value must match!"
      end
    end
    
    @user.save
    
    respond_to do |format|
      if @user.update_attributes(params[:user], :without_protection => true)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :json => @user }
        format.xml  { render :xml => @user }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
        format.xml  { render :xml => @user }
      end
    end
  end
  
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    
    respond_to do |format|
      format.html { redirect_to users_path, notice: 'User was successfully destroyed!' }
      format.xml  { render :xml => @user }
      format.json { render :json => @user }
    end
  end
  
  def update_multiple_users
    delete_list, update_list = self.refine_multiple_data(params[:multiple_data])
    debug_print delete_list
    # 1. delete
    User.destroy(delete_list) unless delete_list.empty?
    # 2. update
    update_list.each do |data|
      user = User.find_by_id(data.delete(idField))
      found_resource.update_attributes(data, :without_protection => true) if user
    end if update_list
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
  #
  # 클라이언트로 부터 넘어온 multiple_data를 삭제 데이터, 수정 데이터, 생성 데이터로 분리하여 리턴 
  #
  def refine_multiple_data(multiple_data)
    delete_list, update_list, data_list = [], [], JSON.parse(multiple_data)
    data_list.each do |data|
      cud_flag = data.delete('_cud_flag_')
      delete_list << data['id'] if(cud_flag == "d")
      update_list << data if(cud_flag == "u")
    end    
    return delete_list, update_list
  end
  
  def import_users
    spreadsheet = open_spreadsheet(params[:file])
    # header parsing - header는 반드시 1 라인에 있어야 함 (Id, Name, Password, E-mail, Dept., Admin, Operator)
    header = spreadsheet.row(1)
    import_data_list = []
    
    (2..spreadsheet.last_row).each do |i|
      row = spreadsheet.row(i)
      raise Hatio::Exception::MisConfigured, (I18n.translate 'error.empty_not_allowed') + ' - Id' if(!row[0] || row[0].empty?)
      raise Hatio::Exception::MisConfigured, (I18n.translate 'error.empty_not_allowed') + ' - Name' if(!row[1] || row[1].empty?)
      row_id = row[0].strip.downcase
      
      # 존재 하는지 체크 
      next if(User.find_by_login(row_id))
      prv_data = import_data_list.find { |data| data['id'] == row_id }
      next if(prv_data)
      
      row_name = row[1].strip
      row_pw = (!row[2] || row[2].empty?) ? row_id : row[2].strip.downcase
      row_email = (!row[3] || row[3].empty?) ? "#{row_id}@hvccglobal.com" : row[3].strip.downcase
      row_dept = (!row[4] || row[4].empty?) ? '' : row[4].strip
      row_admin = (!row[5] || row[5].empty?) ? false : (row[5].strip.downcase)
      row_op = (!row[6] || row[6].empty?) ? false : (row[6].strip.downcase)
      row_admin_flag = (row_admin == 'true' || row_admin == 't' || row_admin == '1' || row_admin == 'y' || row_admin == 'on') ? true : false
      row_op_flag = (row_op == 'true' || row_op == 't' || row_op == '1' || row_op == 'y' || row_op == 'on') ? true : false
      row_data = {'id' => row_id, 'name' => row_name, 'email' => row_email, 'dept' => row_dept, 'pw' => row_pw, 'admin_flag' => row_admin_flag, 'operator_flag' => row_op_flag}
      import_data_list.push(row_data)
    end
    
    User.transaction do
      import_data_list.each do |data|
        User.create({:login => data['id'], :name => data['name'], :email => data['email'], :dept => data['dept'], :password => data['pw'], :password_confirmation => data['pw'], :admin_flag => data['admin_flag'], :timezone => GlobalConfig.default_timezone, :lang => 'en-US', :default_domain_id => @domain.id, :operator_flag => data['operator_flag']}, :without_protection => true)
      end unless(import_data_list.empty?)
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
  def open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Excelx.new(file.path, nil, :ignore)
      else raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.unknown_file_type')
    end
  end
  
end
