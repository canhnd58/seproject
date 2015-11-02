class CreateChallenges < ActiveRecord::Migration
  def change
    create_table :challenges do |t|
      t.integer :challenger_id
      t.integer :challengee_id
      t.integer :challenger_match_id
      t.integer :challengee_match_id

      t.timestamps null: false
    end
  end
end
