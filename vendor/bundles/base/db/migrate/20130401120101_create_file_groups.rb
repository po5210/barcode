class CreateFileGroups < ActiveRecord::Migration
  def	self.up
    create_table :file_groups, :id => :uuid do |t|
      t.references :domain, :null => false
      t.string :name, :null => false, :limit => 64
      t.string :description, :limit => 255
      t.userstamps
      t.timestamps
    end
    
		add_index :file_groups, [:domain_id, :name], :unique => true, :name => :ix_filegroup_0
  end

  def self.down
    remove_index :file_groups, :name => :ix_filegroup_0
		
    drop_table :file_groups
  end
end
