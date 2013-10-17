class FileGroup < ActiveRecord::Base
  
		stampable
		universal_unique_id
    
    attr_accessible :name
		
		has_many :attachments, :dependent => :destroy
end
