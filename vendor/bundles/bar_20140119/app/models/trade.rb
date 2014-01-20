class Trade < ActiveRecord::Base

	stampable
	meaningful_id [:name]
	belongs_to :domain
	attr_accessible :name,:description,:attr_nm,:tr_fg,:reg_nb,:ppl_nb,:ceo_nm,:business,:jongmok,:zip,:div_addr1,:addr2,:ddd,:tel,:fax,:tr_nmk,:attr_nmk,:ceo_nmk,:use_yn

end
