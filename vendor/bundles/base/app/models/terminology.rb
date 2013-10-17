class Terminology < ActiveRecord::Base

  universal_unique_id

	stampable

	belongs_to :domain
  
  before_save :expire_resource_json_cache
  before_destroy :expire_resource_json_cache

	attr_accessible :domain_id, :name, :description, :locale, :category, :display, :display_short
  
  def self.to_resource domain, locale
    @@resource_json ||= {}
    @@resource_json[domain.id + ':' + locale] ||= begin
      terms = domain.terminologies.select([:category, :name, :display, :display_short]).where(locale: locale).order(:category, :name)
      terms.group_by(&:category).reduce({}) do |resource, (category, terms)|
        resource[category] = terms.reduce({}) do |cat, term|
          cat[term.name] = term.display unless term.display.blank?
          cat[term.name + '.short'] = term.display_short unless term.display_short.blank?
          cat
        end
        resource
      end.to_json
    end
  end
  
private
  
  def expire_resource_json_cache
    @@resource_json[self.domain.id + ':' + self.locale] = nil if defined? @@resource_json
  end
end
