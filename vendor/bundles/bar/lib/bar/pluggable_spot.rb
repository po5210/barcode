Hatio::PluggableSpot::add_domain_pluggable do
  # HAS_MANY BEGIN BLOCK DON'T REMOVE
	has_many :bar_matouts
	has_many :bar_matmaps
	has_many :part_groups
	has_many :product_parts
	has_many :bar_locgrps
	has_many :products
	has_many :bar_locmaps
	has_many :suppliers
	has_many :locs
	has_many :trades
	has_many :baselocs
end