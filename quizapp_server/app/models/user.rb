class User < ActiveRecord::Base
  has_many :matches, dependent: :destroy
  has_many :self_challenges, class_name: 'Challenge', foreign_key: 'challenger_id'
  has_many :friend_challenges, class_name: 'Challenge', foreign_key: 'challengee_id'
  has_many :user_friends
  has_many :friends, source: :user, through: :user_friends
end
