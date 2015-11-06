class UserFriend < ActiveRecord::Base
  belongs_to :user
  belongs_to :friend, class_name: 'User', foreign_key: 'friend_id'

  enum status: [ :normal, :challenging, :challenged, :not_viewed ]
  validates :status, inclusion: { in: statuses.keys }
end
