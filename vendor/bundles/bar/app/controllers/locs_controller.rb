class LocsController < DomainResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  public
  
  #
  # GET /domains/:domain_id/locs.json
  #
  def index
    args = params["_q"]
    arg_baseloc_cd = args["baseloc_cd"]
    arg_baseloc_nm = args["baseloc_nm"]
    arg_baseloc_fg = args["baseloc_fg"]
    arg_div_cd = args["div_cd"]
    arg_inloc_cd = args["inloc_cd"]
    arg_use_yn = args["use_yn"]
    
    plsql = get_plsql
    index_cursor, list, @collection = nil, nil, []
    
    begin
      plsql.barcode.sp_baseloc_index(
        :arg_baseloc_cd => arg_baseloc_cd, 
        :arg_baseloc_nm => arg_baseloc_nm, 
        :arg_baseloc_fg => arg_baseloc_fg, 
        :arg_div_cd => arg_div_cd,
        :arg_inloc_cd => arg_inloc_cd, 
        :arg_use_yn => arg_use_yn, 
        :index_cursor => index_cursor) do |c|
        list = c[:index_cursor].fetch_all
        c[:index_cursor].close
      end
      
      @total_count = list.size
      @collection = list.collect do |rec|
        {
          :id => rec[0],
          :baseloc_cd => rec[0],
          :baseloc_nm => rec[1],
          :baseloc_fg => rec[2],
          :div_cd => rec[3],
          :inloc_cd => rec[4],
          :outloc_cd => rec[5],
          :baseloc_nmk => rec[6],
          :use_yn => rec[7],
          :reg_id => rec[8],
          :reg_dtm => rec[9],
          :mod_id => rec[10],
          :mod_dtm => rec[11]
        }
      end
      
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
        
    respond_to do |format|
      format.xml  { render :xml => {:items => @collection, :total => @total_count, :success => true} }
      format.json { render :json => {:items => @collection, :total => @total_count, :success => true} }
      format.xls
    end
  end
  
  #
  # GET /domains/:domain_id/locs/:id/show.json
  #  
  def show
    tr_cd = params[:id]
    conn = ActiveRecord::Base.connection()
    sql = "SELECT 
      BASELOC_CD ID, BASELOC_CD, BASELOC_NM, BASELOC_FG, DIV_CD, INLOC_CD, 
      OUTLOC_CD, BASELOC_NMK, USE_YN, REG_ID, REG_DTM, MOD_ID, MOD_DTM
    FROM
      BASELOC 
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
  # POST /domains/:domain_id/locs/create.json
  #  
  def create
    conn = ActiveRecord::Base.connection()
    check_sql = "SELECT COUNT(*) CNT FROM BASELOC WHERE BASELOC_CD = #{conn.quote(params[:baseloc_cd])}"
    check_result = conn.select_all(check_sql)
    count = check_result[0]["cnt"]
    
    if(count.to_i == 0)
      insert_sql = "INSERT INTO BASELOC (
        BASELOC_CD, BASELOC_NM, BASELOC_FG, DIV_CD, INLOC_CD, 
        OUTLOC_CD, BASELOC_NMK, USE_YN, REG_ID, REG_DTM, MOD_ID, MOD_DTM
      ) VALUES (
        #{conn.quote(params[:baseloc_cd])}, #{conn.quote(params[:baseloc_nm])}, 
        #{conn.quote(params[:baseloc_fg])}, #{conn.quote(params[:div_cd])}, 
        #{conn.quote(params[:inloc_cd])}, #{conn.quote(params[:outloc_cd])}, 
        #{conn.quote(params[:baseloc_nmk])}, #{conn.quote(params[:use_yn])}, 
        #{conn.quote(User.current_user.id)}, TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'), 
        #{conn.quote(User.current_user.id)}, TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
      )"
      
      begin
        conn.execute(insert_sql)
      rescue Exception => e
        raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
      end
    else
      raise Hatio::Exception::InvalidRequest, "BASELOC_CD (#{params[:baseloc_cd]}) already exist"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end
  end
  
  #
  # GET /domains/:domain_id/locs/:id/update.json
  #  
  def update
    conn = ActiveRecord::Base.connection()
    sql = "UPDATE 
        BASELOC 
      SET
        BASELOC_NM = #{conn.quote(params[:baseloc_nm])}, 
        BASELOC_FG = #{conn.quote(params[:baseloc_fg])}, 
        DIV_CD = #{conn.quote(params[:div_cd])}, 
        INLOC_CD = #{conn.quote(params[:inloc_cd])}, 
        OUTLOC_CD = #{conn.quote(params[:outloc_cd])}, 
        BASELOC_NMK = #{conn.quote(params[:baseloc_nmk])}, 
        USE_YN = #{conn.quote(params[:use_yn])}, 
        MOD_ID = #{conn.quote(current_user.id)},  
        MOD_DTM = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
      WHERE
        BASELOC_CD = #{conn.quote(params[:baseloc_cd])}"
        
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
  # DELETE /domains/:domain_id/locs/:id/destroy.json
  #
  def destroy
    loc_cd = params[:id]
    conn = ActiveRecord::Base.connection()
    
    begin
      conn.execute("DELETE FROM LOC WHERE LOC_CD = #{conn.quote(loc_cd)}")
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end    
  end
    
end
