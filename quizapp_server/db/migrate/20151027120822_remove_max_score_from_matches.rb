class RemoveMaxScoreFromMatches < ActiveRecord::Migration
  def change
    remove_column :matches, :max_score, :integer
  end
end
