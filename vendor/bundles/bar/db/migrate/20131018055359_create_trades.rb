class CreateTrades < ActiveRecord::Migration

	def self.up
		create_table :trades, :id => :meaningful do |t|
			t.references :domain
			t.string :tr_cd, :null => false, :limit => 5
			t.string :tr_nm, :limit => 60
			t.string :attr_nm, :limit => 60
			t.string :tr_fg, :limit => 1
			t.string :reg_nb, :limit => 30
			t.string :ppl_nb, :limit => 20
			t.string :ceo_nm, :limit => 30
			t.string :business, :limit => 45
			t.string :jongmok, :limit => 45
			t.string :zip, :limit => 7
			t.string :div_addr1, :limit => 90
			t.string :addr2, :limit => 30
			t.string :ddd, :limit => 4
			t.string :tel, :limit => 12
			t.string :fax, :limit => 12
			t.string :tr_nmk, :limit => 60
			t.string :attr_nmk, :limit => 60
			t.string :ceo_nmk, :limit => 30
			t.string :use_yn, :limit => 5, :default => '1'
			t.userstamps
			t.timestamps
		end

		add_index :trades, [:domain_id, :tr_cd], :name => :ix_trades_0, :unique => true
	end

	def self.down
		remove_index :trades, :name => :ix_trades_0
		drop_table :trades
	end
end