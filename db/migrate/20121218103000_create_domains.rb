class CreateDomains < ActiveRecord::Migration
  def self.up
    create_table :domains, :id => :meaningful do |t|
      t.string :name, :null => false, :limit => 100
      t.string :description, :limit => 255    
      t.string :timezone, :limit => 255
      t.boolean :system_flag      
      t.userstamps
      t.timestamps
    end
  end

  def self.down
    drop_table :domains
  end
end
