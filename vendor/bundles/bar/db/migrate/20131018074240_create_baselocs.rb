class CreateBaselocs < ActiveRecord::Migration

	def self.up
		create_table :baselocs, :id => :meaningful do |t|
			t.references :domain, :null => false
			t.string :baseloc_cd, :null => false, :limit => 4
			t.string :baseloc_nm, :limit => 30
			t.string :baseloc_fg, :limit => 1
			t.string :div_cd, :limit => 4
			t.string :inloc_cd, :limit => 4 
			t.string :outloc_cd, :limit => 4
			t.string :baseloc_nmk, :limit => 30 
			t.string :use_yn, :limit => 1
		end

		add_index :baselocs, [:domain_id, :baseloc_cd], :name => :ix_base_loc_0, :unique => true
	end

	def self.down
		remove_index :baselocs, :name => :ix_base_loc_0
		drop_table :baselocs
	end
end