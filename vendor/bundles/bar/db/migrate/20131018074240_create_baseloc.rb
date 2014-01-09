class CreateBaseloc < ActiveRecord::Migration

	def self.up
		create_table :baseloc, :id => :false do |t|
			t.string :baseloc_cd, :null => false, :limit => 4
			t.string :baseloc_nm, :limit => 30
			t.string :baseloc_fg, :limit => 1
			t.string :div_cd, :limit => 4
			t.string :inloc_cd, :limit => 4 
			t.string :outloc_cd, :limit => 4
			t.string :baseloc_nmk, :limit => 30 
			t.string :use_yn, :limit => 1
      t.string :reg_id, :limit => 16
      t.string :reg_dtm, :limit => 14
      t.string :mod_id, :limit => 16
      t.string :mod_dtm, :limit => 14			
		end

		add_index :baseloc, [:baseloc_cd], :name => :ix_base_loc_0, :unique => true
	end

	def self.down
		remove_index :baseloc, :name => :ix_base_loc_0
		drop_table :baseloc
	end
end