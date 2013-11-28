class CreateLocs < ActiveRecord::Migration

	def self.up
		create_table :locs, :id => :meaningful do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 4
			t.string :description, :limit => 30
			t.references :baseloc, :limit => 4, :null => false
			t.string :loc_nmk, :limit => 30
			t.string :prod_line_fg, :limit => 1
			t.string :erp_bloc, :limit => 4
			t.string :erp_loc, :limit => 4
			t.string :tmp_bloc, :limit => 4
			t.string :tmp_loc, :limit => 4
			t.string :use_yn, :limit => 1
			t.userstamps
			t.timestamps
		end

		add_index :locs, [:domain_id, :name], :unique => true, :name => :index_locs_0
	end

	def self.down
		remove_index :locs, :name => :index_locs_0
		drop_table :locs
	end
end