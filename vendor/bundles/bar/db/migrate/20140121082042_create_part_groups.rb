class CreatePartGroups < ActiveRecord::Migration

	def self.up
		create_table :part_groups, :id => :meaningful do |t|
			t.references :domain
			t.string :name
			t.string :description
			t.string :part_desc
			t.userstamps
			t.timestamps
		end

		add_index :part_groups, [:domain_id, :name], :unique => true, :name => :index_part_groups_0
		add_index :part_groups, [:domain_id, :updated_at], :name => :index_part_groups_1
	end

	def self.down
		remove_index :part_groups, :name => :index_part_groups_0
		remove_index :part_groups, :name => :index_part_groups_1
		drop_table :part_groups
	end
end