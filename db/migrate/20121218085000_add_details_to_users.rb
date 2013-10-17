class AddDetailsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :string, :limit => 64
    add_column :users, :lang, :string, :limit => 10
    add_column :users, :timezone, :string, :limit => 64
    add_column :users, :default_domain_id, :string, :limit => 64
    add_column :users, :admin_flag, :boolean
    add_column :users, :operator_flag, :boolean
    add_column :users, :dept, :string, :limit => 64
    add_column :users, :alarm_flag, :boolean, :default => false
  end
end
