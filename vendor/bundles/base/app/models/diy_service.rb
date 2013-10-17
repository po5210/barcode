class DiyService < ActiveRecord::Base
  
    stampable
    universal_unique_id
    belongs_to :domain
    attr_accessible :name,:description,:script_type,:active_flag,:service_logic,:atomic_flag

		has_many :service_in_params, :as => :resource, :dependent => :destroy, :order => "rank asc"
		has_many :service_out_params, :as => :resource, :dependent => :destroy, :order => "rank asc"
		
    public
    
    def to_param
      self.name
    end

    def execute_service(params)
      if(self.script_type == "SQL")
        execute_sql_service(self.service_logic, params)
      elsif(self.script_type == "DSL")
        execute_dsl_service(self.service_logic, params)
      elsif(self.script_type == "DSL-SQL")
        execute_dsl_sql_service(self.service_logic, params)
      elsif(self.script_type == "JSON")
        execute_json_service(self.service_logic, params)
      end
    end

    private
    
    #
    # query와 params로 실제 쿼리를 생성하여 리턴한다. 
    # 
    def create_real_query(query, params)
      sql_params = []

      # 1. 서비스 로직의 :param 문자를 ?로 변경하고 배열에 추가.
      replace_params = query.scan(/:\w+/) if query.scan(/:\+/)

      # 2. 배열의 문자와 매칭되는 파라미터의 값을 ? 에 매핑
      replace_params.each do |replace_param|
        # query.gsub!(/#{replace_param}/, '?')
        query.sub!(/#{replace_param}/, '?')
      end if replace_params

      replace_params.each do |replace_param|
        sql_params << replace_param.gsub(/:/, "")
      end if replace_params

      # 3. query parameter matching
      sql_arr = [query]
      sql_params.collect { |p| sql_arr << params[p.to_sym] } if(sql_params)
      
      # 4. create real query
      return DiyService.send(:sanitize_sql, sql_arr)
    end

    def execute_sql_service(svc_logic, params)
      # # 1. 서비스 로직의 :{param} 문자를 ?로 변경하고 배열에 추가.
      # replace_params = svc_logic.scan(/:\w+/) if svc_logic.scan(/:\+/)
      # 
      # # 2. 배열의 문자와 매칭되는 파라미터의 값을 ? 에 매핑
      # replace_params.each { |replace_param| svc_logic.sub!(/#{replace_param}/, '?') } if replace_params
      # 
      # # 3. {param_name} 형식의 문자를 sql_params에 추가 
      # sql_params = replace_params.map { |replace_param| replace_param.gsub(/:/, "") } if replace_params
      # 
      # # 4. query와 parameter를 하나의 array에 추가 
      # sql_arr = [svc_logic]
      # sql_arr.concat(sql_params.map { |p| params[p.to_sym] }) if (sql_params)
      # 
      # # begin
      # query_result = DiyService.find_by_sql(sql_arr)
      # # rescue StandardError => e
      # #   raise RotoruaException::BadServiceLogic.new(e.to_s) 
      # # end
      # # 5. 결과를 리턴 타입을 키, 결과 값을 값으로 하는 해쉬를 생성
      # result_list = query_result.map { |result| result.attributes }
      
      real_query = create_real_query(svc_logic, params)
      result_list = DiySelection.connection.select_all(real_query)
      return result_list
    end

    def execute_dsl_sql_service(svc_logic, params)
      query = self.instance_eval svc_logic
      execute_sql_service(query, params)
    end

    def execute_dsl_service(svc_logic, params)
      svc_logic = "DiyService.transaction do \n #{svc_logic} \n end" if(self.atomic_flag)  
      result_list = self.instance_eval svc_logic
      return result_list
    end
    
    def execute_json_service(svc_logic, params)
      ActiveSupport::JSON.decode("#{svc_logic.strip}")
    end
    
    # setup helper
    class SetupHelper
      attr_accessor :service_logic, :in_param_list, :out_param_list

      def initialize
        @service_logic = ""
        @in_param_list = []
        @out_param_list = []
      end

      def in_params(column_name, options={})
        @in_param_list << options.merge({:name => column_name.to_s, :rank => (@in_param_list.length * 10)})
      end
      
      def out_params(column_name, options={})
        @out_param_list << options.merge({:name => column_name.to_s, :rank => (@out_param_list.length * 10)})
      end
    end
    
    def self.setup(domain, name, options={}, &block)
      setup_helper = SetupHelper.new
      setup_helper.instance_eval &block if block_given?
      
      service = domain.diy_services.find_by_name(name.to_s)
      service ||= domain.diy_services.create(options.merge({:name => name.to_s, :service_logic => setup_helper.service_logic}))
      service.save
      
      setup_helper.in_param_list.each { |params| service.service_in_params.create params }
      setup_helper.out_param_list.each { |params| service.service_out_params.create params }
      service
    end
end