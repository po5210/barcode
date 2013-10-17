class ShiftsController < ApplicationController
  
  before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token
  respond_to :html, :xml, :json, :xls
  
  # GET /shifts/1
  def show
    @shift = Shift.find_by_domain_id(params[:id])
    unless @shift
      data = {:domain_id => @domain.id, :total_shift => 2, :shift1_start => '08:00', :shift1_end => '21:00', :shift2_start => '21:00', :shift2_end => '08:00' }
      @shift = Shift.new(data)
      @shift.save
    end
  end

  # PUT /shifts/1
  def update
    @shift = Shift.find(params[:id])
    @shift.update_attributes(params[:shift], :without_protection => true)
  end
  
  # DELETE /shifts/1
  def destroy
    @shift = Shift.find(params[:id])
    @shift.destroy
  end
  
  # POST /shifts
  def create
    @shift = Shift.new(params[:shift])
    @shift.save
  end
  
end
