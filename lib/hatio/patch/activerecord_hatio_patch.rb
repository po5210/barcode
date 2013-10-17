module ActiveRecord::AttributeAssignment
  
  # Allows you to set all the attributes for a particular mass-assignment
  # security role by passing in a hash of attributes with keys matching
  # the attribute names (which again matches the column names) and the role
  # name using the :as option.
  #
  # To bypass mass-assignment security you can use the :without_protection => true
  # option.
  #
  #   class User < ActiveRecord::Base
  #     attr_accessible :name
  #     attr_accessible :name, :is_admin, :as => :admin
  #   end
  #
  #   user = User.new
  #   user.assign_attributes({ :name => 'Josh', :is_admin => true })
  #   user.name       # => "Josh"
  #   user.is_admin?  # => false
  #
  #   user = User.new
  #   user.assign_attributes({ :name => 'Josh', :is_admin => true }, :as => :admin)
  #   user.name       # => "Josh"
  #   user.is_admin?  # => true
  #
  #   user = User.new
  #   user.assign_attributes({ :name => 'Josh', :is_admin => true }, :without_protection => true)
  #   user.name       # => "Josh"
  #   user.is_admin?  # => true
  def assign_attributes(new_attributes, options = {})    
    return if new_attributes.blank?

    attributes = new_attributes.stringify_keys
    multi_parameter_attributes = []
    nested_parameter_attributes = []
    unknown_attributes = []
    @mass_assignment_options = options

    unless options[:without_protection]
      attributes = sanitize_for_mass_assignment(attributes, mass_assignment_role)
    end

    attributes.each do |k, v|
      if k.include?("(")
        multi_parameter_attributes << [ k, v ]
      elsif respond_to?("#{k}=")
        if v.is_a?(Hash)
          nested_parameter_attributes << [ k, v ]
        else
          # domain_id, creator_id, updater_id, created_at, updated_at은 여기서 제거한다.
          if(k == 'creator' || k == 'updater' || k == 'creator_id' || k == 'updater_id' || k == 'created_at' || k == 'updated_at')
            unknown_attributes << k
          else
            send("#{k}=", v)
          end
        end
      else
        if(options[:without_protection] || k.ends_with?('_name'))
          unknown_attributes << k
        else
          debug_print "unknown attribute: #{k}"
          raise(UnknownAttributeError, "unknown attribute: #{k}")
        end
      end
    end
    
    # 없는 필드면 무시하고 삭제한다.
    unknown_attributes.each { |key| attributes.delete(key) } if(options[:without_protection] && !unknown_attributes.empty?)

    # assign any deferred nested attributes after the base attributes have been set
    nested_parameter_attributes.each do |k,v|
      send("#{k}=", v)
    end

    @mass_assignment_options = nil
    assign_multiparameter_attributes(multi_parameter_attributes)
  end
end

module ActiveRecord::ConnectionAdapters
  class JdbcAdapter < AbstractAdapter
    def explain(*args)
      # Do nothing :'(
    end
  end
end