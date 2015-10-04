class Question < ActiveRecord::Base
  belongs_to :category
  has_many :answers, dependent: :destroy

  validates :description, :kind, :score, presence: true
  validates :score, numericality: {greater_than: 0}

  def as_json(options={})
    super(:only => [ :description, :image_url, :kind, :score ],
          :include => {
            :answers => {:only => [ :value, :is_correct ]}
          }
    )
  end
end
