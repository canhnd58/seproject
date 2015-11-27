class Rank < ActiveRecord::Base
  EXP_BASE = 100
  EXP_UP_RATE = 1.3

  mount_uploader :avatar, RankAvatarUploader

  def self.required_exp(rank)
    exp = EXP_BASE * (EXP_UP_RATE ** (rank - 1)) - EXP_BASE
    exp.ceil - 1
  end

  def self.required_attribute(rank)
    att = User::ATTRIBUTE_MAX - Math::E ** (-(rank-1) / 6.0) * User::ATTRIBUTE_MAX
    att.round(1)
  end
end
