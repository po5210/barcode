class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :login, :email, :password, :password_confirmation, :remember_me, :name, :lang, :timezone, :default_damain_id, :admin_flag, :operator_flag, :dept, :alarm_flag
  # attr_accessible :title, :body
  
  has_and_belongs_to_many :roles, :join_table => "users_roles"
  belongs_to :default_domain, :class_name => 'Domain'
  
  # id는 login 데이터와 동일
  meaningful_id [:login]

  #
  # Save 전에 language, timezone 등을 업데이트한다.
  #
  before_save do
    self.default_domain_id = GlobalConfig.default_domain if(!self.default_domain_id || self.default_domain_id.empty?)
    self.lang = GlobalConfig.default_lang if(!self.lang || self.lang.empty?)
    self.timezone = GlobalConfig.default_timezone if(!self.timezone || self.timezone.empty?)
  end
  
  def self.current_user=(user)
    Thread.current[:current_user] = user
  end

  def self.current_user
    Thread.current[:current_user]
  end
  
  def admin?
    (self.admin_flag.nil? || self.admin_flag == false || self.admin_flag == 0) ? false : true    
  end
  
  def locale
    (!self.lang || self.lang.empty?) ? GlobalConfig.default_lang : self.lang
  end
  
end
