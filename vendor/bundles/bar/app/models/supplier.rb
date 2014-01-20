class Supplier < ActiveRecord::Base

	stampable
	meaningful_id [:domain_id, :name]
	belongs_to :domain
	attr_accessible :name,:description,:erp_ifc_flag,:supply_fg,:reg_nb,:ppl_nb,:ceo_nm,:business,:jongmok,:zip,:div_addr1,:addr2,:ddd,:tel,:fax,:use_yn

end
