class CreateBarLocmaps < ActiveRecord::Migration

	def self.up
		create_table :bar_locmaps, :id => :meaningful do |t|
			t.references :domain
			t.references :bar_locgrp
			t.string :name
			t.string :description
			t.string :loc_nmk
			t.string :loc_dc
			t.string :use_yn
			t.string :prod_line_fg
			t.string :erp_bloc
			t.string :erp_loc
			t.string :tmp_bloc
			t.string :tmp_loc
			t.string :reg_ip
			t.string :mod_ip
			t.userstamps
			t.timestamps
		end

		add_index :bar_locmaps, [:domain_id, :name], :unique => true, :name => :index_bar_locmaps_0
		add_index :bar_locmaps, [:domain_id, :updated_at], :name => :index_bar_locmaps_1
	end

	def self.down
		remove_index :bar_locmaps, :name => :index_bar_locmaps_0
		remove_index :bar_locmaps, :name => :index_bar_locmaps_1
		drop_table :bar_locmaps
	end
end