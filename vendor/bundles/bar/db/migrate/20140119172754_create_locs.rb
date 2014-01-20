class CreateLocs < ActiveRecord::Migration

	def self.up
		create_table :locs, :id => false do |t|
			t.string :loc_cd
			t.string :loc_nm
			t.string :loc_nmk
			t.string :loc_dc
			t.string :use_yn
			t.string :reg_id
			t.string :reg_dtm
			t.string :mod_id
			t.string :mod_dtm
			t.string :prod_line_fg
			t.string :erp_bloc
			t.string :erp_loc
			t.string :tmp_bloc
			t.string :tmp_loc
			t.string :reg_ip
			t.string :mod_ip
		end

	end

	def self.down
		drop_table :locs
	end
end