class AddLastPlayedToUsers < ActiveRecord::Migration
  def change
    add_column :users, :last_played, :datetime
  end
end
