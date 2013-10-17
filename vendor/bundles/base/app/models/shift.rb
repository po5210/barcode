class Shift < ActiveRecord::Base

	stampable
	meaningful_id [:domain_id]
	belongs_to :domain
	attr_accessible :domain_id,:total_shift,:shift1_start,:shift2_start,:shift3_start,:shift1_end,:shift2_end,:shift3_end
  attr_accessor :shift_codes
  
  def shift_desc(sft)
    self.shift_codes = self.domain.common_codes.find_by_name('SHIFT').codes unless(self.shift_codes)
    sft_code = self.shift_codes.find { |code| code.name == sft.to_s }
    sft_code.description
  end
  
  def parse_time(str)
    if ActiveRecord::Base.default_timezone == :utc
      domain_timezone = self.domain.timezone.blank? ? ActiveSupport::TimeZone[current_user.timezone] : ActiveSupport::TimeZone[self.domain.timezone.to_s]
      domain_timezone.parse(str)
    else
      Time.parse(str)
    end
  end
  
  def shift_start_time(date, shift)
    shift = shift.to_i if(shift.class.name == 'String')
    return nil if(shift > self.total_shift)
    # WorkDate Shift1 시작시간은 시스템 날짜하고 같다고 가정한다.
    shift_start = self.send "shift#{shift}_start"
    return parse_time "#{date} #{shift_start}"
  end

  def shift_end_time(date, shift)
    shift = shift.to_i if(shift.class.name == 'String')
    return nil if(shift > self.total_shift)
    shift_end = self.send "shift#{shift}_end"
    # 마지막 Shift의 종료시간이 하루를 넘어간다고 가정한다. 
    date = date + 1 if(shift == self.total_shift)
    return parse_time "#{date} #{shift_end}"
  end

  def work_date(time)
    date = time.to_date
    shift_first_start = self.shift_start_time(date, 1)
    shift_last_end = self.shift_end_time(date, self.total_shift)
    if time < shift_first_start
      return date - 1
    elsif time >= shift_last_end
      return date + 1
    else
      return date
    end
  end

  def wd_shift(time)
    date = work_date(time)
    return nil if date.nil?
    shift = (1..self.total_shift).detect do |i_shift|
      sst = self.shift_start_time(date, i_shift)
      set = self.shift_end_time(date, i_shift)
      (time >= sst && time <= set)
    end
    [date, shift]
  end

  def shift(time)
    wd_shift(time)[1]
  end

  def current_work_date
    @current_work_date ||= work_date(Time.now)
  end

  def current_shift
    @current_shift ||= shift(Time.now)
  end
  
  #
  # 현 시간부터 다음 Shift 시작시간까지 남은 시간 (millisecond) 리턴
  #
  def shift_change_delay
    wd_shift = wd_shift(Time.now)
    work_date = wd_shift[0]
    shift = wd_shift[1]
    next_work_date, next_shift = work_date, shift + 1
    if(next_shift > self.total_shift)
      next_work_date = next_work_date + 1
      next_shift = 1 
    end
    next_shift_start_time = self.shift_start_time(next_work_date, next_shift)
    delay = (1000 * (next_shift_start_time - Time.now).to_i)
    delay
  end
  
end
