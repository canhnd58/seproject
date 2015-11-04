class User < ActiveRecord::Base
  has_many :matches, dependent: :destroy
  has_many :challenges
  has_many :user_friends
  has_many :friends, source: :user, through: :user_friends
end
