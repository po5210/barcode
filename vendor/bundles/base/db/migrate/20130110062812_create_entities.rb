class CreateEntities < ActiveRecord::Migration

	def  self.up
		create_table :entities, :id => :uuid do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 64
			t.string :description
			t.string :bundle, :null => false, :limit => 64
			t.userstamps
			t.timestamps
		end

		add_index :entities, [:domain_id, :name], :unique => true, :name => :ix_entity_0
	end

	def  self.down
		remove_index :entities, :name => :ix_entity_0
		
		drop_table :entities
	end
end