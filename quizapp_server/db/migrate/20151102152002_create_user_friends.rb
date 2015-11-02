class CreateUserFriends < ActiveRecord::Migration
  def change
    create_table :user_friends do |t|
      t.integer :friend_id
      t.integer :status

      t.timestamps null: false
    end
  end
end
