class CreateLoc < ActiveRecord::Migration

	def self.up
		create_table :loc, :id => false do |t|
			t.string :loc_cd, :null => false, :limit => 4
			t.string :loc_nm, :limit => 30
			t.string :baseloc_cd, :limit => 4, :null => false
			t.string :loc_nmk, :limit => 30
			t.string :prod_line_fg, :limit => 1
			t.string :erp_bloc, :limit => 4
			t.string :erp_loc, :limit => 4
			t.string :tmp_bloc, :limit => 4
			t.string :tmp_loc, :limit => 4
			t.string :use_yn, :limit => 1
      t.string :reg_id, :limit => 16
      t.string :reg_dtm, :limit => 14
      t.string :mod_id, :limit => 16
      t.string :mod_dtm, :limit => 14
		end

		add_index :loc, [:loc_cd, :baseloc_cd], :unique => true, :name => :index_loc_0
	end

	def self.down
		remove_index :loc, :name => :index_loc_0
		drop_table :loc
	end
end