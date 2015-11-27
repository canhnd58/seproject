class User < ActiveRecord::Base
  has_many :matches, dependent: :destroy
  has_many :self_challenges, class_name: 'Challenge', foreign_key: 'challenger_id'
  has_many :friend_challenges, class_name: 'Challenge', foreign_key: 'challengee_id'
  has_many :user_friends
  has_many :friends, through: :user_friends
  has_many :inverse_user_friends, class_name: 'UserFriend', foreign_key: 'friend_id'
  has_many :inverse_friends, through: :inverse_user_friends, source: :user

  validates :name, presence: true, length: { maximum: 50 }
  validates :facebook_id, presence: true, uniqueness: true

  def update_after_matching!(match)
    self.highscore = match.score if match.score > highscore

    #accuracy
    max_score = match.questions.sum(:score)
    current_accuracy = match.score.to_f / max_score * ATTRIBUTE_MAX
    self.accuracy = inch(accuracy, current_accuracy)

    #speed
    max_time = QUESTION_LIMIT * QUESTION_TIME
    bonus_time = 500 * QUESTION_LIMIT
    current_speed = (max_time - match.time).to_f / (max_time - bonus_time) * ATTRIBUTE_MAX
    self.speed = inch(speed, current_speed)

    #impressiveness
    needed_streak = QUESTION_LIMIT.abs2 / 2.0
    current_impr = (match.streak.to_f / needed_streak) * ATTRIBUTE_MAX
    if current_impr > impressiveness
      self.impressiveness = inch(impressiveness, current_impr, true)
    else
      self.impressiveness = inch(impressiveness, current_impr)
    end

    #versatility
    total_cat = Category.count
    needed_cat = 0.7 * total_cat
    cat_ids = matches.order(updated_at: :desc).limit(total_cat).pluck(:category_id).uniq
    current_versa = (cat_ids.length / needed_cat) * ATTRIBUTE_MAX
    self.versatility = inch(versatility, current_versa)

    #diligence
    self.last_played = updated_at if last_played.nil?
    current_time = Time.now
    needed_interval = 86400
    dif = current_time - last_played - needed_interval
    if dif <= 0
      self.diligence = inch(diligence, ATTRIBUTE_MAX, true)
    else
      current_diligence = -(dif / needed_interval) * ATTRIBUTE_MAX
      self.diligence = inch(diligence, current_diligence, true)
    end
    self.last_played = current_time
    self.save!
  end

  private
    def inch(last, current, fast=false)
      step = 0.2
      if fast
        last += (current - last) * step
      else
        delta = Math.sqrt((current - last).abs) * step
        last += current > last ? delta : -delta
      end
      last = ATTRIBUTE_MAX if last > ATTRIBUTE_MAX
      last = 0 if last < 0
      last
    end
end
