class TerminologiesController < DomainResourcesController

  skip_before_filter :verify_authenticity_token
  
  def locale_resource
    @terminologies = Terminology.to_resource(@domain, params['locale'])

    respond_to do |format|
      format.json { render json: @terminologies, status: :ok }
    end
  end
end
