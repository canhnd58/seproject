class Question < ActiveRecord::Base
  belongs_to :category
  has_many :answers, dependent: :destroy
  has_many :match_questions
  has_many :matches, through: :match_questions
  mount_uploader :image, QuestionImageUploader

  accepts_nested_attributes_for :answers, :category, allow_destroy: true

  validates :description, :kind, :score, presence: true
  validates :score, numericality: {greater_than: 0}

  #def as_json(options={})
  #  super(only: [:description, :image_url, :kind, :score],
  #        include: {
  #          answers: {only: [:value, :is_correct]}
  #        }
  #  )
  #end
end
