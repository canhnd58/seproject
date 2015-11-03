class AddWinAndLoseColumnsToUserFriend < ActiveRecord::Migration
  def change
    add_column :user_friends, :win, :integer
    add_column :user_friends, :lose, :integer
  end
end
