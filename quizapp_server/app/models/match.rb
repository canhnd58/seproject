class Match < ActiveRecord::Base
  belongs_to :user
  belongs_to :category
  has_many :match_questions
  has_many :questions, through: :match_questions
end
