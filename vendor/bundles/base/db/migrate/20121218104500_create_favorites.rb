class CreateFavorites < ActiveRecord::Migration
	def	self.up
		create_table :favorites, :id => :meaningful do |t|
      t.references :domain
			t.string :name
      t.string :description      
      t.string :url
      t.string :user_id
			t.userstamps
			t.timestamps
		end
		
		add_index :favorites, [:domain_id, :name], :unique => true, :name => :ix_fav_0
		add_index :favorites, [:domain_id, :user_id], :name => :ix_fav_1
	end
	
	def self.down
	  remove_index :favorites, :name => :ix_fav_0
	  remove_index :favorites, :name => :ix_fav_1
		
		drop_table :favorites
	end
end