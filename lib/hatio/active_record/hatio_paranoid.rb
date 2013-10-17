module Hatio
  module Paranoid
    
    def self.included(base) #:nodoc:
      super
      base.extend(ClassMethods)
      base.class_eval do
        include InstanceMethods
      end
    end

    module ClassMethods
      def acts_as_hatio_paranoid
        class_eval do
          before_create :before_create_for_history
        end
      end
    end

    module InstanceMethods #:nodoc:
      private
        
        def before_create_for_history
          # history 관리 모델이면 적용 
          if(self.respond_to?(:versioned_table_name) && self.respond_to?(:meaningful_composite_key))
            conditions = {}
            self.meaningful_composite_key.each { |key| conditions[key.to_sym] = self["#{key}"] }
            deleted_objs = self.class.only_deleted.where(conditions)
            if(deleted_objs)
              deleted_obj = deleted_objs.first
              if(deleted_obj)
                deleted_obj.destroy! 
                self.class.versioned_class.delete_all ["domain_id = ? and #{self.class.versioned_foreign_key} = ?", deleted_obj.domain_id, deleted_obj.id]
              end
            end
          end
        end
        
    end
  end
end
