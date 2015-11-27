# encoding: utf-8

class RankAvatarUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave
  WIDTH = 300
  HEIGHT = 300

  process eager: true
  process resize_to_fill: [WIDTH, HEIGHT]
  process convert: 'png'

  def public_id
    'rank' + model.id
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
