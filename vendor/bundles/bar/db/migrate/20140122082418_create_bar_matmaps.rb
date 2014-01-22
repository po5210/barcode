class CreateBarMatmaps < ActiveRecord::Migration

	def self.up
		create_table :bar_matmaps, :id => :meaningful do |t|
			t.references :domain
			t.string :name
			t.string :description
			t.references :supplier
			t.string :item_tp
			t.string :acct_fg
			t.string :odr_fg
			t.string :assgwh_cd
			t.string :assflc_cd
			t.string :qc_fg
			t.string :item_nmk
			t.string :item_tpk
			t.string :use_yn
			t.string :str_cd
			t.string :str_nm
			t.string :unit
			t.string :item_gb
			t.string :barcode_yn
			t.integer :box_l
			t.integer :part_gcd
			t.integer :box_w
			t.integer :box_h
			t.integer :box_qty
			t.integer :pallet_l
			t.integer :pallet_w
			t.integer :pallet_h
			t.integer :pallet_row
			t.integer :pallet_column
			t.integer :pallet_layer
			t.integer :pallet_bqty
			t.integer :pallet_qty
			t.references :bar_locgrp
			t.references :bar_locmap
			t.integer :ckdbox_l
			t.integer :ckdbox_w
			t.integer :ckdbox_h
			t.integer :ckdbox_qty
			t.string :label_print_fg
			t.string :trmain_cd
			t.string :model_no
			t.string :customer_cd
			t.string :assy_hccd_nm
			t.string :emp_cd
			t.string :cust_tr_cd
			t.string :cust_item_cd
			t.string :cust_item_nm
			t.string :reg_ip
			t.string :mod_ip
			t.userstamps
			t.timestamps
		end

		add_index :bar_matmaps, [:domain_id, :name], :unique => true, :name => :index_bar_matmaps_0
		add_index :bar_matmaps, [:domain_id, :updated_at], :name => :index_bar_matmaps_1
	end

	def self.down
		remove_index :bar_matmaps, :name => :index_bar_matmaps_0
		remove_index :bar_matmaps, :name => :index_bar_matmaps_1
		drop_table :bar_matmaps
	end
end