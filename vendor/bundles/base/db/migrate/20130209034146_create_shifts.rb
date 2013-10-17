class CreateShifts < ActiveRecord::Migration

	def self.up
		create_table :shifts, :id => :meaningful do |t|
			t.references :domain, :null => false
			t.integer :total_shift
			t.string :shift1_start, :limit => 8
			t.string :shift2_start, :limit => 8
			t.string :shift3_start, :limit => 8
			t.string :shift1_end, :limit => 8
			t.string :shift2_end, :limit => 8
			t.string :shift3_end, :limit => 8
			t.userstamps
			t.timestamps
		end
	end

	def self.down
		drop_table :shifts
	end
end