class Category < ActiveRecord::Base
  has_many :questions, dependent: :destroy

  validates :name, presence: true

  def as_json(options={})
    super(only: [:id, :name])
  end
end
