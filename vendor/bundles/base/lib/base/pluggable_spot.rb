Hatio::PluggableSpot::add_domain_pluggable do
  # HAS_MANY BEGIN BLOCK DON'T REMOVE
  has_many :diy_reports
  has_many :diy_selections
  has_many :diy_services
  has_many :menus
  has_many :entities
  has_many :common_codes
  has_many :roles
  has_many :attachments
  has_many :file_groups
  has_many :terminologies
	has_one :shift
end