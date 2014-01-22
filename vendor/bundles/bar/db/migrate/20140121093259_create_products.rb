class CreateProducts < ActiveRecord::Migration

	def self.up
		create_table :products, :id => :meaningful do |t|
			t.references :domain
			t.string :name
			t.string :description
			t.string :short_name
			t.string :prod_type
			t.string :prod_class
			t.string :unit
			t.integer :default_qty
			t.float :cycletime
			t.float :weight
			t.float :waste_cost
			t.string :flow_id
			t.string :customer_id
			t.string :cust_part_no
			t.integer :erp_ifc_flag
			t.integer :useless_flag
			t.datetime :deleted_at
			t.string :acct_fg
			t.string :odr_fg
			t.string :assgwh_cd
			t.string :assflc_cd
			t.string :qc_fg
			t.string :item_nmk
			t.string :item_tpk
			t.string :use_yn
			t.string :item_gb
			t.integer :part_gcd
			t.string :barcode_yn
			t.integer :box_l
			t.integer :box_w
			t.integer :box_h
			t.integer :box_qty
			t.integer :pallet_l
			t.integer :pallet_h
			t.integer :pallet_w
			t.integer :pallet_row
			t.integer :pallet_column
			t.integer :pallet_layer
			t.integer :pallet_bqty
			t.integer :pallet_qty
			t.integer :ckdbox_l
			t.integer :ckdbox_w
			t.integer :ckdbox_h
			t.integer :ckdbox_qty
			t.references :bar_locgrp
			t.references :bar_locmap
			t.string :label_print_fg
			t.string :trmain_cd
			t.string :model_no
			t.string :customer_cd
			t.string :assy_hccd_nm
			t.string :cust_tr_cd
			t.string :cust_item_cd
			t.string :cust_item_nm
			t.string :item_tp
			t.integer :version
			t.datetime :eff_start_date
			t.datetime :eff_end_date
			t.string :routing
			t.userstamps
			t.timestamps
		end

		add_index :products, [:domain_id, :name], :unique => true, :name => :index_products_0
		add_index :products, [:domain_id, :updated_at], :name => :index_products_1
	end

	def self.down
		remove_index :products, :name => :index_products_0
		remove_index :products, :name => :index_products_1
		drop_table :products
	end
end