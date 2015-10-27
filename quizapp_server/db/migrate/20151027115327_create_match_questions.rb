class CreateMatchQuestions < ActiveRecord::Migration
  def change
    create_table :match_questions do |t|
      t.references :match, index: true, foreign_key: true
      t.references :question, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
