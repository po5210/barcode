class Baseloc < ActiveRecord::Base

	meaningful_id [:name]
	belongs_to :domain
	attr_accessible :name,:description,:baseloc_fg,:div_cd,:inloc_cd,:outloc_cd,:baseloc_nmk,:use_yn

end
