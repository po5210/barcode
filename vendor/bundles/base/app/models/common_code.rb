class CommonCode < ActiveRecord::Base
  
    stampable
    universal_unique_id
    belongs_to :domain
    belongs_to :parent, :class_name => "CommonCode", :foreign_key => "parent_id"
    attr_accessible :name, :description

    before_create do
      if(self.parent)
        cnt = CommonCode.where("parent_id = ? and name = ?", self.parent_id, self.name).count
        raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.duplicated_code') if (cnt > 0)
      end
    end
    
    def codes
      return (self.parent_id && !self.parent_id.empty?) ? nil : CommonCode.where("parent_id = ?", self.id).order("name asc")
    end

    # setup helper
    class SetupHelper
      attr_accessor :codes

      def initialize
        @codes = []
      end

      def code(codes={})
        @codes << codes
      end
    end

    def self.setup(domain, name, params={}, &block)
      common_code = domain.common_codes.find_by_name(name) || domain.common_codes.create(params.merge(:name => name.to_s))

      setup_helper = SetupHelper.new
      setup_helper.instance_eval &block if block_given?

      setup_helper.codes.each do |code|
        code.each do |key, value|
          #value, description = value if value.is_a? Array
          domain.common_codes.create({:name => key.to_s, :description => value.to_s, :parent_id => common_code.id}, :without_protection => true)
        end
      end

      common_code.save
      common_code
    end
    
end
