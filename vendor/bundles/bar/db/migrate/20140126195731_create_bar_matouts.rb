class CreateBarMatouts < ActiveRecord::Migration

	def self.up
		create_table :bar_matouts, :id => :meaningful do |t|
			t.references :domain
			t.string :name
			t.string :description
			t.string :who_dt
			t.integer :who_sq
			t.string :who_fg
			t.integer :lot_qty
			t.integer :lot_rqty
			t.string :item_cd
			t.references :bar_locgrp
			t.references :bar_locmap
			t.string :outbaseloc_cd
			t.string :outloc_cd
			t.string :created_ip
			t.string :updated_ip
			t.string :whi_dt
			t.integer :whi_sq
			t.string :lot_no
			t.string :ser_no
			t.string :internal_issue_no
			t.string :26
			t.string :27
			t.string :28
			t.string :29
			t.userstamps
			t.timestamps
		end

		add_index :bar_matouts, [:domain_id, :name], :unique => true, :name => :index_bar_matouts_0
		add_index :bar_matouts, [:domain_id, :updated_at], :name => :index_bar_matouts_1
	end

	def self.down
		remove_index :bar_matouts, :name => :index_bar_matouts_0
		remove_index :bar_matouts, :name => :index_bar_matouts_1
		drop_table :bar_matouts
	end
end