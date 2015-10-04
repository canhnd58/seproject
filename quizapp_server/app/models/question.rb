class Question < ActiveRecord::Base
  belongs_to :category
  has_many :answers, dependent: :destroy

  validates :description, :kind, :score, presence: true
  validates :score, numericality: {greater_than: 0}
end
