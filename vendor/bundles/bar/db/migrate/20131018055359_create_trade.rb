class CreateTrade < ActiveRecord::Migration

	def self.up
		create_table :trade, :id => false do |t|
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
      t.string :reg_id, :limit => 16
      t.string :reg_dtm, :limit => 14
      t.string :mod_id, :limit => 16
      t.string :mod_dtm, :limit => 14
		end

		add_index :trade, [:tr_cd, :tr_fg], :name => :ix_trades_0, :unique => true
	end

	def self.down
		remove_index :trade, :name => :ix_trades_0
		drop_table :trade
	end
end