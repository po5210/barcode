class EntityColumn < ActiveRecord::Base
  
    belongs_to :entity
    universal_unique_id
    attr_accessible :name,:description,:pk,:column_type,:ref_type,:ref_name,:editable,:list_rank,:search_rank,:sort_rank,:display_rank,:reverse_sort

    def pk_column?
      (self.pk.nil? || self.pk == false || self.pk == 0 || (self.pk =~ /^(t|true|on|y|yes)$/i).nil?) ? false : true
    end
end
