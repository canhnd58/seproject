class User < ActiveRecord::Base
  has_many :matches, dependent: :destroy
  has_many :self_challenges, class_name: 'Challenge', foreign_key: 'challenger_id'
  has_many :friend_challenges, class_name: 'Challenge', foreign_key: 'challengee_id'
  has_many :user_friends
  has_many :friends, through: :user_friends
  has_many :inverse_user_friends, class_name: 'UserFriend', foreign_key: 'friend_id'
  has_many :inverse_friends, through: :inverse_user_friends, source: :user
end
