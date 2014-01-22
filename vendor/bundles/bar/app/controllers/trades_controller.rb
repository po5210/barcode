class TradesController < ProcedureResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  public
  
  #
  # GET /domains/:domain_id/trades.json
  #
  def index
    args = params["_q"]
    arg_tr_cd = args["tr_cd"]
    arg_tr_nm = args["tr_nm"]
    arg_tr_fg = args["tr_fg"]
    arg_reg_nb = args["reg_nb"]
    arg_use_yn = args["use_yn"]
    arg_start = params[:start]
    arg_limit = params[:limit]
    
    conn = ActiveRecord::Base.connection()
    plsql = get_plsql
    index_cursor, list, @collection, result = nil, nil, [], nil
    
    begin
      plsql.sp_trade_index(
        :arg_tr_cd => arg_tr_cd, 
        :arg_tr_nm => arg_tr_nm, 
        :arg_tr_fg => arg_tr_fg, 
        :arg_reg_nb => arg_reg_nb, 
        :arg_use_yn => arg_use_yn, 
        :arg_start => arg_start,
        :arg_limit => arg_limit,
        :index_cursor => index_cursor) do |c|
        list = c[:index_cursor].fetch_all
        c[:index_cursor].close
      end
      
      total_size = conn.select_all("SELECT COUNT(*) CNT FROM TRADE")
      @total_count = total_size[0]["cnt"]
      @collection = list.collect do |rec|
        {
          :id => rec[0],
          :tr_cd => rec[0],
          :tr_nm => rec[1],
          :attr_nm => rec[2],
          :tr_fg => rec[3],
          :reg_nb => rec[4],
          :ppl_nb => rec[5],
          :ceo_nm => rec[6],
          :business => rec[7],
          :jongmok => rec[8],
          :zip => rec[9],
          :div_addr1 => rec[10],
          :addr2 => rec[11],
          :ddd => rec[12],
          :tel => rec[13],
          :fax => rec[14],
          :tr_nmk => rec[15],
          :attr_nmk => rec[16],
          :ceo_nmk => rec[17],
          :use_yn => rec[18],
          :reg_id => rec[19],
          :reg_dtm => rec[20],
          :mod_id => rec[21],
          :mod_dtm => rec[22]
        }
      end
      
      result = {:items => @collection, :total => @total_count, :success => true}
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
        
    respond_to do |format|
      format.xml  { render :xml => result }
      format.json { render :json => result }
      format.xls
    end
  end
  
  #
  # GET /domains/:domain_id/trades/:id/show.json
  #  
  def show
    tr_cd = params[:id]
    conn = ActiveRecord::Base.connection()
    sql = "SELECT 
      TR_CD ID, TR_CD, TR_NM, ATTR_NM, TR_FG, REG_NB, PPL_NB, CEO_NM, BUSINESS, 
      JONGMOK, ZIP, DIV_ADDR1, ADDR2, DDD, TEL, FAX, TR_NMK, ATTR_NMK, 
      CEO_NMK, USE_YN, REG_ID, REG_DTM, MOD_ID, MOD_DTM
    FROM
      TRADE 
    WHERE
      TR_CD = #{conn.quote(tr_cd)}"
    collection = conn.select_all(sql)
    member = collection.empty? ? nil : collection[0]
    
    respond_to do |format|
      format.xml  { render :xml => member }
      format.json { render :json => member }
    end    
  end
  
  #
  # POST /domains/:domain_id/trades/create.json
  #  
  def create
    conn, result_msg = ActiveRecord::Base.connection(), nil    
    begin
      plsql = get_plsql
      result_msg = plsql.SP_TRADE_CREATE(
       :tr_cd => params[:tr_cd], 
       :tr_nm => params[:tr_nm], 
       :attr_nm => params[:attr_nm], 
       :tr_fg => params[:tr_fg], 
       :reg_nb => params[:reg_nb], 
       :ppl_nb => params[:ppl_nb], 
       :ceo_nm => params[:ceo_nm], 
       :business => params[:business],
       :jongmok => params[:jongmok], 
       :zip => params[:zip], 
       :div_addr1 => params[:div_addr1], 
       :addr2 => params[:addr2], 
       :ddd => params[:ddd], 
       :tel => params[:tel], 
       :fax => params[:fax], 
       :tr_nmk => params[:tr_nmk], 
       :attr_nmk => params[:attr_nmk], 
       :ceo_nmk => params[:ceo_nmk], 
       :use_yn => params[:use_yn], 
       :reg_id => current_user.id,
       :result_msg => result_msg)[:result_msg]
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    raise Hatio::Exception::InvalidRequest, "ERROR : #{result_msg}" if(result_msg != "SUCCESS")
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end
  end
  
  #
  # GET /domains/:domain_id/trades/:id/update.json
  #  
  def update
    conn = ActiveRecord::Base.connection()    
    sql = "UPDATE 
        TRADE 
      SET
        tr_nm = #{conn.quote(params[:tr_nm])}, 
        attr_nm = #{conn.quote(params[:attr_nm])}, 
        tr_fg = #{conn.quote(params[:tr_fg])},  
        reg_nb = #{conn.quote(params[:reg_nb])}, 
        ppl_nb = #{conn.quote(params[:ppl_nb])}, 
        ceo_nm = #{conn.quote(params[:ceo_nm])},  
        business = #{conn.quote(params[:business])}, 
        jongmok = #{conn.quote(params[:jongmok])}, 
        zip = #{conn.quote(params[:zip])}, 
        div_addr1 = #{conn.quote(params[:div_addr1])}, 
        addr2 = #{conn.quote(params[:addr2])},  
        ddd = #{conn.quote(params[:ddd])}, 
        tel = #{conn.quote(params[:tel])},  
        fax = #{conn.quote(params[:fax])}, 
        tr_nmk = #{conn.quote(params[:tr_nmk])},  
        attr_nmk = #{conn.quote(params[:attr_nmk])},
        ceo_nmk = #{conn.quote(params[:ceo_nmk])}, 
        use_yn = #{conn.quote(params[:use_yn])}, 
        mod_id = #{conn.quote(current_user.id)},  
        mod_dtm = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
      WHERE
        TR_CD = #{conn.quote(params[:tr_cd])}"
        
    begin
      conn.execute(sql)
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end    
  end
  
  #
  # DELETE /domains/:domain_id/trades/:id/destroy.json
  #
  def destroy
    tr_cd = params[:id]
    conn = ActiveRecord::Base.connection()
    
    begin
      conn.execute("DELETE FROM TRADE WHERE TR_CD = #{conn.quote(tr_cd)}")
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end    
  end  
  
end
