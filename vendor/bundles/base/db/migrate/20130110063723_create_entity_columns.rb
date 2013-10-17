class CreateEntityColumns < ActiveRecord::Migration
  
  def	self.up
    create_table :entity_columns, :id => :uuid do |t|
      t.references :entity, :null => false
      t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.boolean :pk, :default => false
			t.string :column_type, :null => false, :limit => 20
			t.string :ref_type, :limit => 20
			t.string :ref_name, :limit => 64
			t.boolean :editable, :default => false
			t.integer :list_rank, :default => 0
			t.integer :search_rank, :default => 0
			t.integer :sort_rank, :default => 0
			t.boolean :reverse_sort, :default => 0
			t.integer :display_rank, :default => 0
    end

    add_index :entity_columns, [:entity_id], :name => :ix_entity_column_0
  end

  def self.down
    add_index :entity_columns, [:entity_id], :name => :ix_entity_column_0
		
    drop_table :entity_columns
  end
end