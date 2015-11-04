class AddAnswerToMatchQuestions < ActiveRecord::Migration
  def change
    add_reference :match_questions, :answer, index: true, foreign_key: true
  end
end
