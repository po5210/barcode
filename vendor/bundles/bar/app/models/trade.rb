class Trade < ActiveRecord::Base

  meaningful_id [:domain_id, :tr_cd]
	stampable
	belongs_to :domain
	attr_accessible :tr_cd,:tr_nm,:attr_nm,:tr_fg,:reg_nb,:ppl_nb,:ceo_nm,:business,:jongmok,:zip,:div_addr1,:addr2,:ddd,:tel,:fax,:tr_nmk,:attr_nmk,:ceo_nmk,:use_yn

end
