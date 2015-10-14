class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :facebook_id
      t.string :avatar
      t.float :rating
      t.integer :highscore
      t.integer :exp
      t.float :accuracy
      t.float :speed
      t.float :versatility
      t.float :diligence
      t.float :impressiveness

      t.timestamps null: false
    end
  end
end
