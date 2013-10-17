class DomainsController < InheritedResources::Base
  
  respond_to :html, :xml, :json
  before_filter :authenticate_user!
  
  def index
    @domains = Domain.all
    
    respond_to do |format|
      format.html
      format.xml  { render :xml => @domains }
      format.json { render :json => { :success => true, :total => @domains.size, :items => @domains } }
    end
  end
  
  def new
    @edit_domain = Domain.new
  end

  def show
    @show_domain = Domain.find(params[:id])
    
    respond_to do |format|
      format.html
      format.xml  { render :xml => @show_domain }
      format.json { render :json => @show_domain }
    end
  end

  def edit
    @edit_domain = Domain.find(params[:id])
  end
  
  def update
    update_domain = Domain.find(params[:id])
    result = false
    
    if(params[:domain])
      result = update_domain.update_attributes(params[:domain])
    else
      update_domain.name = params[:name]
      update_domain.description = params[:description]
      update_domain.timezone = params[:timezone]
      update_domain.system_flag = params[:system_flag]
      result = update_domain.save!
    end    

    respond_to do |format|
      if result
        format.html { redirect_to domains_path, notice: 'Domain was successfully updated.' }
        format.json { render :json => {:success => true, :msg => 'Domain was successfully updated!', :item => update_domain} }
      else
        format.html { render action: "edit" }
        format.json { render json: update_domain.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def create    
    create_domain = nil
    if(params[:domain])
      create_domain = Domain.new(params[:domain])
    else
      create_domain = Domain.new      
      create_domain.name = params[:name]
      create_domain.description = params[:description]
      create_domain.timezone = params[:timezone]
      create_domain.system_flag = params[:system_flag]      
    end
      
    respond_to do |format|
      if create_domain.save
        format.html { redirect_to domains_path, notice: 'Domain was successfully created.' }
        format.json { render :json => {:success => true, :msg => 'Domain was successfully created!', :item => create_domain} }
      else
        format.html { render action: "new" }
        format.json { render json: create_domain.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def destroy
    raise Hatio::Exception::InvalidRequest, 'Can not delete domain'
    
    respond_to do |format|
      format.html { redirect_to domains_path, notice: 'Domain was successfully destroyed!' }
      format.json { render :json => {:success => true, :msg => 'Domain was successfully destroyed!'} }
    end
  end
  
end
