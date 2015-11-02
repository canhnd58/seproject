class Challenge < ActiveRecord::Base
  belongs_to :challenger, class_name: 'User', foreign_key: 'challenger_id'
  belongs_to :challengee, class_name: 'User', foreign_key: 'challengee_id'
  belongs_to :challenger_match, class_name: 'Match', foreign_key: 'challenger_match_id'
  belongs_to :challengee_match, class_name: 'Match', foreign_key: 'challengee_match_id'
end
