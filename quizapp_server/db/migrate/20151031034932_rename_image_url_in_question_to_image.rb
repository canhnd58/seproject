class RenameImageUrlInQuestionToImage < ActiveRecord::Migration
  def change
    rename_column :questions, :image_url, :image
  end
end
