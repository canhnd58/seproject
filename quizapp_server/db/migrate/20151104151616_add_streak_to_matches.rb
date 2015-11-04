class AddStreakToMatches < ActiveRecord::Migration
  def change
    add_column :matches, :streak, :integer
  end
end
