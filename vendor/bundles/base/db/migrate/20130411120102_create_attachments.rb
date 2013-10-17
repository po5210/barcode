class CreateAttachments < ActiveRecord::Migration
  def	self.up
    create_table :attachments, :id => :uuid  do |t|
      t.references :domain, :null => false
      t.string :name, :null => false, :limit => 64
      t.string :description, :limit => 255
      t.string :mimetype
      t.integer :file_size
      t.references :file_group
      t.string :path
      t.userstamps
      t.timestamps
    end
    
		add_index :attachments, [:domain_id, :file_group_id, :name], :unique => true, :name => :ix_attch_0
  end

  def self.down
    remove_index :attachments, :name => :ix_attch_0
		
    drop_table :attachments
  end
end
