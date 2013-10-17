class Menu < ActiveRecord::Base
    
  stampable
  universal_unique_id
  belongs_to :domain
  belongs_to :entity
  belongs_to :parent, :class_name => "Menu", :foreign_key => "parent_id"
  attr_accessible :name,:description,:parent_id,:entity_id,:template,:menu_type,:category,:rank,:icon_path,:hidden_flag
  attr_accessor :auth

  # TODO 일단 하드 코딩 --> 추후 권한 데이터를 넘겨줌 
  def auth
    ""
  end
  
  # setup helper
  class SetupHelper
    attr_accessor :submenus
     
    def initialize
      @submenus = []
    end
    
    def submenu(name, options={}, &block)
      options[:name] = name.to_s
      options[:menu_type] ||= 'SCREEN' unless block_given?
      options[:entity] ||= options[:name]
      @submenus << options
    end
  end
  
  def self.setup(domain, name, options={}, &block)
    menu = domain.menus.find_by_name(name.to_s)
    menu ||= domain.menus.create :name => name.to_s, :rank => options[:rank] || 100, :menu_type => 'MENU', :category => options[:category]
    
    setup_helper = SetupHelper.new
    setup_helper.instance_eval &block if block_given?
    
    setup_helper.submenus.each_with_index do |submenu, i|
      entity = domain.entities.find_by_name(submenu[:entity].to_s.camelize)
      domain.menus.create({:name => submenu[:name], 
                          :entity => entity,
                          :template => submenu[:template],
                          :parent => menu,
                          :menu_type => submenu[:menu_type],
                          :category => submenu[:category],
                          :rank => submenu[:rank] || i * 10,
                          :menu_type => submenu[:menu_type]}, :without_protection => true)
    end

    menu
  end
end
