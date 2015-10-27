class MatchQuestion < ActiveRecord::Base
  belongs_to :match
  belongs_to :question
end
