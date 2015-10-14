class Question < ActiveRecord::Base
  belongs_to :category
  has_many :answers, dependent: :destroy
  accepts_nested_attributes_for :answers, allow_destroy: true

  validates :description, :kind, :score, presence: true
  validates :score, :category_id, numericality: {greater_than: 0}

  def as_json(options={})
    super(only: [:description, :image_url, :kind, :score],
          include: {
            answers: {only: [:value, :is_correct]}
          }
    )
  end
end
