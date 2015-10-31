class Category < ActiveRecord::Base
  has_many :questions, dependent: :destroy
  has_many :matches
  mount_uploader :image, CategoryImageUploader

  validates :name, presence: true

  #def as_json(options={})
  #  super(only: [:id, :name])
  #end
end
