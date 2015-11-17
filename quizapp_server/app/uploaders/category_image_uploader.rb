# encoding: utf-8

class CategoryImageUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave
  WIDTH = 400
  HEIGHT = 400

  process eager: true
  process resize_to_fill: [WIDTH, HEIGHT]
  process convert: 'png'

  def public_id
    model.name.downcase
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
