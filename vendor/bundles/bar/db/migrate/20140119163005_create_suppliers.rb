class CreateSuppliers < ActiveRecord::Migration

	def self.up
		create_table :suppliers, :id => :meaningful do |t|
			t.references :domain
			t.string :name
			t.string :description
			t.integer :erp_ifc_flag
			t.datetime :deleted_at
			t.string :version
			t.string :supply_fg
			t.string :reg_nb
			t.string :ppl_nb
			t.string :ceo_nm
			t.string :business
			t.string :jongmok
			t.string :zip
			t.string :div_addr1
			t.string :addr2
			t.string :ddd
			t.string :tel
			t.string :fax
			t.string :use_yn
			t.userstamps
			t.timestamps
		end

		add_index :suppliers, [:domain_id, :name], :unique => true, :name => :index_suppliers_0
		add_index :suppliers, [:domain_id, :updated_at], :name => :index_suppliers_1
	end

	def self.down
		remove_index :suppliers, :name => :index_suppliers_0
		remove_index :suppliers, :name => :index_suppliers_1
		drop_table :suppliers
	end
end