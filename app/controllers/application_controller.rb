class ApplicationController < ActionController::Base
  protect_from_forgery
  
  layout proc{ |c| c.xhr? ? false : 'application' }
  
  before_filter :authenticate_user!, :set_current_user, :load_domain, :set_user_timezone

  rescue_from Exception, :with => :response_by_error
  
  private
  
  def response_by_error e
    err_msg, err_cls, traces, trace_str = e.message, e.class.name, e.backtrace, ""
    logger.error err_msg
    
    # hatio exception이면 처리된 예외이므로 TOP 6line만 print
    if(err_cls.start_with?("Hatio::Exception"))
      trace_str = traces[0 .. 5].join("\n")
    else
      trace_str = traces.join("\n")
    end
    logger.error trace_str
    
    respond_with(e) do |format|
      format.json { 
        render :json => {
          :errors => [err_msg],
          :throwable => {
            :type => err_cls,
            :message => err_msg,
            :stacktrace => trace_str
          },
          :params => params.to_s,
        }, :status => Hatio::Exception::get_status_code(e)
      }
      
    end
  end
  
  protected
  
  def set_current_user
    if user_signed_in?
      User.current_user = current_user 
      I18n.locale = cookies[:language] || (User.current_user.locale ? User.current_user.locale : 'en-US')
    end
  end
  
  def load_domain
    if user_signed_in?
      domainId = session[:current_domain_id]
      domainId = current_user.default_domain_id unless domainId
      domainId = Domain.system_domain.id unless domainId
      session[:current_domain_id] = domainId if !xhr?
      @domain = Domain.find(domainId)
    end
  end
   
  def set_user_timezone
    if user_signed_in?
      if(current_user.timezone)
        Time.zone = current_user.timezone
      else
        Time.zone = cookies[:timezone]
      end
    end
  end
  
  def current_domain
    session[:current_domain_id] ? Domain.find(session[:current_domain_id]) : nil
  end
  
  def current_domain=(domain)
    session[:current_domain_id] = domain.id
  end
    
  def xhr?
    request.xhr? || params[:xhr]
  end  
  
end
