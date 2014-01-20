Hatio::PluggableSpot::add_domain_pluggable do
  # HAS_MANY BEGIN BLOCK DON'T REMOVE
	has_many :suppliers
	has_many :locs
	has_many :trades
	has_many :baselocs
end