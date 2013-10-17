class HomeController < ApplicationController
  
  skip_before_filter :verify_authenticity_token
  
  def index
    if current_user.operator_flag
      redirect_to :action => 'ops'
    else
      redirect_to :action => 'std'
    end
  end
  
  def std
    if current_user.operator_flag
      redirect_to :action => 'ops'
    else
      render :layout => false
    end
  end
  
  def ops
    render :layout => false
  end
  
  def cfinstall
    render :layout => false
  end
  
  def cfdownload
    send_file(File.join(Rails.root, 'lib', 'assets', 'msi', 'cfinstall', 'GoogleChromeframeStandaloneEnterprise.msi'),
          :filename => 'GoogleChromeframeStandaloneEnterprise.msi',
          :type => 'application/x-msi',
          :disposition => 'attachment',
          :url_based_filename => true)
  end
    
  def spc_chart
    render :layout => false
  end
end