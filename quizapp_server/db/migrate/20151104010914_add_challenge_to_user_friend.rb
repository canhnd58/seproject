class AddChallengeToUserFriend < ActiveRecord::Migration
  def change
    add_reference :user_friends, :challenge, index: true, foreign_key: true
  end
end
