class Match < ActiveRecord::Base
  QUESTION_LIMIT = 10
  QUESTION_TIME = 30000

  belongs_to :user
  belongs_to :category
  has_many :match_questions
  has_many :questions, -> { order 'match_questions.id' }, through: :match_questions

  def finished?
    return updated_at != created_at
  end
end
