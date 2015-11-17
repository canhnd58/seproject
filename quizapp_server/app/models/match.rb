class Match < ActiveRecord::Base
  belongs_to :user
  belongs_to :category
  has_many :match_questions
  has_many :questions, -> { order 'match_questions.id' }, through: :match_questions

  def finished?
    return updated_at != created_at
  end
end
