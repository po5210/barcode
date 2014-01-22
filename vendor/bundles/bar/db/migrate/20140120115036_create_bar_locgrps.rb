class CreateBarLocgrps < ActiveRecord::Migration

	def self.up
		create_table :bar_locgrps, :id => :meaningful do |t|
			t.references :domain
			t.string :name
			t.string :description
			t.string :baseloc_fg
			t.string :div_cd
			t.string :inloc_cd
			t.string :outloc_cd
			t.string :baseloc_nmk
			t.string :use_yn
			t.userstamps
			t.timestamps
		end

		add_index :bar_locgrps, [:domain_id, :name], :unique => true, :name => :index_bar_locgrps_0
		add_index :bar_locgrps, [:domain_id, :updated_at], :name => :index_bar_locgrps_1
	end

	def self.down
		remove_index :bar_locgrps, :name => :index_bar_locgrps_0
		remove_index :bar_locgrps, :name => :index_bar_locgrps_1
		drop_table :bar_locgrps
	end
end