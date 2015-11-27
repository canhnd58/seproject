class CreateRanks < ActiveRecord::Migration
  def change
    create_table :ranks do |t|
      t.string :avatar

      t.timestamps null: false
    end
  end
end
