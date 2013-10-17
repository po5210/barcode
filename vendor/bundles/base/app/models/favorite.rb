class Favorite < ActiveRecord::Base
  
  stampable
  meaningful_id [:domain_id, :name]
  belongs_to :domain
  belongs_to :user
  
  attr_accessible :name,:description,:url,:user_id,:user_name
  
  def user_name
    self.user ? self.user.name : ''
  end
  
  def user_name=(username)
  end
      
end
