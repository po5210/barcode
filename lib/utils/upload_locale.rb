def upload_locale
if RUBY_PLATFORM =~ /java/
  require 'rhino'
else
  require 'v8'
end

  domain = Domain.system_domain
  admin = User.find("admin")
  
  User.current_user = admin
  
  def traverse_terms terms, category, cxt
    terms.each do |name, value|
      if value.is_a? String
        if name.ends_with?('.short')
          Terminology.where({
            domain_id: Domain.system_domain.id,
            name: name[0..-7],
            locale: cxt['locale'],
            category: category
          }).first_or_create.update_attributes({
            display_short: value
          })
        else
          Terminology.where({
            domain_id: Domain.system_domain.id,
            name: name,
            locale: cxt['locale'],
            category: category
          }).first_or_create.update_attributes({
            display: value
          })
        end
  
      else
        traverse_terms value, name, cxt
      end
    end
  end
  
  if RUBY_PLATFORM =~ /java/
    Rhino::Context.open do |cxt|
  
      cxt['T'] = lambda do |terms|
        traverse_terms terms, 'global', cxt
      end
  
      Dir[Rails.root.to_path + '/**/locale/??-??.js'].each do |termfile|
        locale = termfile.split('/').last.split('.').first
  
        cxt['locale'] = locale
  
        cxt.load(termfile);
      end
  
    end
  else
    V8::Context.new do |cxt|
      
      cxt['T'] = lambda do |this, terms|
        traverse_terms terms, 'global', cxt
      end
  
      Dir[Rails.root.to_path + '/**/locale/??-??.js'].each do |termfile|
        locale = termfile.split('/').last.split('.').first
  
        cxt['locale'] = locale
  
        cxt.load(termfile);
      end
  
    end
  end
end