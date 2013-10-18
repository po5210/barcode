class Baseloc < ActiveRecord::Base

	meaningful_id [:domain_id, :baseloc_cd]
	belongs_to :domain
	attr_accessible :baseloc_cd,:baseloc_nm,:baseloc_fg,:div_cd,:inloc_cd,:outloc_cd,:baseloc_nmk,:use_yn

end
