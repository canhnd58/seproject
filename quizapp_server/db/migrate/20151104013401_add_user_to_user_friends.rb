class AddUserToUserFriends < ActiveRecord::Migration
  def change
    add_reference :user_friends, :user, index: true, foreign_key: true
  end
end
