module Hatio
  module Util
    # Simple util class
    module HatioUtil
      
      # for debug
      def debug_print(obj)
        puts "*" * 30
        puts obj
        puts "*" * 30
      end
      
      #
      # UUID 생성 
      #
      def generateUUID
        Digest::SHA1.hexdigest(Time.now.to_s.split(//).sort_by {rand}.join).to_s
        # UUIDTools::UUID.timestamp_create().to_s
      end
      
      # time string을 db time으로 변경 
      def parse_time_to_db(strtime)
        convert_time_to_db Time.zone.parse(strtime)
      end

      # time string을 db time으로 변경 
      def convert_time_to_db(time)
        if ActiveRecord::Base.default_timezone == :utc
          time.to_time.utc
        else
          time.to_time.localtime
        end
      end
      
      # save data
      def save_data(entity, data, user)
        data[:creator_id] = user.id
        data[:updater_id] = user.id
        return entity.create(data, :without_protection => true)
      end
      
      # parameter empty check
      def empty_param?(params, name)
        name = name.to_s
        return (params[name].nil? || params[name].empty?)
      end
      
      # 필수 파라미터 체크 
      def check_required_param(params, name)
        raise Hatio::Exception::InvalidRequest, "Parameter #{name} is required!" if(!params.key?(name.to_s) || params[name.to_s].blank?)
      end
         
      # 필수 파라미터 리스트 체크 
      def check_required_params(params, name_arr)
        name_arr.each { |name| check_required_param(params, name) }
      end
      
      #단일 날짜를 between 으로 변경
      def convert_date_bet_cond(date)
        "between ? and ?"
      end
      
      #
      def convert_date_eq_cond(date)
        "Date'#{date}'"
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def parse_date(date_str)
        
        # if(/\//.match(date_str))
        #   return Date.strptime(date_str, '%m/%d/%Y')
        # elsif(/-/.match(date_str))
        #   return Date.strptime(date_str, '%Y-%m-%d')
        # else
        #     raise 'invalid date #{work_date}'        
        # end
                
        begin
          return Date.strptime(date_str, GlobalConfig.default_date_format)
        rescue ::Exception => e
          begin
            return Date.strptime(date_str, GlobalConfig.date_format)
          rescue ::Exception => e2
            return Date.parse(date_str)
          end
        end
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def to_std_date_str(date_str)
        return parse_date(date_str).to_s
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def parse_time(time_str)
        begin
          return Time.strptime(time_str, GlobalConfig.default_datetime_format)
        rescue ::Exception => e
          begin
            return Time.strptime(time_str, GlobalConfig.datetime_format)
          rescue ::Exception => e2
            return Time.parse(time_str)
          end
        end
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def to_std_time_str(time_str)
        return parse_time(time_str).to_s
      end
      
      #
      # integer value를 자리수를 size만큼 0를 붙여서 리턴한다.
      #
      def int_to_str(value, size)
        val_str = value.to_s
        val_size = val_str.size
        if(val_size >= size)
          return val_str
        else
          1.upto(size - val_size) { |idx| val_str = ("0" + val_str) }
          return val_str
        end
      end
      
    end
  end
end