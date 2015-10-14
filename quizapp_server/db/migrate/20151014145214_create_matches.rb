class CreateMatches < ActiveRecord::Migration
  def change
    create_table :matches do |t|
      t.references :user, index: true, foreign_key: true
      t.integer :score
      t.integer :max_score
      t.integer :time
      t.references :category, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
