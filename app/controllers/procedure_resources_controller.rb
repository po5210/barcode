class ProcedureResourcesController < ApplicationController
  
  respond_to :html, :xml, :json, :xls
  before_filter :authenticate_user!
  
  private
  
  def get_plsql
    plsql.connection = ActiveRecord::Base.connection.jdbc_connection
    plsql
  end
  
end