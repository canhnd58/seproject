class Api::MatchesController < ApplicationController
  def create
    token = params.require :access_token
    category = Category.find(params.require :category)

    user = current_user(token)
    questions = randomize_questions(category)

    @match = Match.create!(
      questions: questions,
      user_id: user.id,
      category_id: category.id)
  end

  def update
    @user = current_user(params.require :access_token)
    @match = Match.find(params.require :id)
    raise ApiException::InvalidToken if @match.user_id != @user.id
    raise ApiException::InvalidAction if @match.finished?

    @match.score = params.require :score
    @match.time = params.require :time
    @match.streak = params.require :streak
    answer_ids = params.require :answers
    raise ActionController::ParameterMissing.new(:answers) if answer_ids.length != @match.questions.count

    answer_ids.each do |a_id|
      q_id = Answer.find(a_id).question_id
      m_question = MatchQuestion.find_by match_id: @match.id, question_id: q_id
      m_question.answer_id = a_id
      m_question.save!
    end
    update_user_attributes!
    @match.save!
    update_user_status!
    render nothing: true, status: :ok
  end

  def show
    token = params.require :access_token
    user = current_user(token)
    match = user.matches.find(params[:id])
    @questions = match.questions
  end

  def result
    #SELECTED_COLUMNS =
    @match = Match.find(params[:id])
    raise ApiException::InvalidAction unless @match.finished?
    @m_questions = MatchQuestion.joins(:question)
                  .joins("INNER JOIN answers ON match_questions.answer_id = answers.id")
                  .select([:description, :score], "match_questions.id, answers.value AS answer_value, answers.is_correct AS answer_is_correct")
                  .where(match_id: @match.id)
                  .order('match_questions.id')
  end

  private
    def update_user_status!
      #Update status if this is the challengee's match
      challenge = @user.friend_challenges.find_by challengee_match_id: @match.id
      unless challenge.nil?
        user = UserFriend.find_by user_id: challenge.challengee_id, friend_id: challenge.challenger_id
        friend = UserFriend.find_by user_id: challenge.challenger_id, friend_id: challenge.challengee_id

        user.normal!
        friend.not_viewed!
        f_match = Match.find(challenge.challenger_match_id)
        win = @match.score > f_match.score || (@match.score == f_match.score && @match.time < f_match.time)
        if win
          user.win += 1
          friend.lose += 1
        else
          user.lose += 1
          friend.win += 1
        end

        user.save!
        friend.save!
      end

      #Update status if this is the challenger's match
      challenge = @user.self_challenges.find_by challenger_match_id: @match.id
      unless challenge.nil?
        friend = UserFriend.find_by user_id: challenge.challengee_id, friend_id: challenge.challenger_id
        friend.challenged!
        friend.save!
      end
    end

    def update_user_attributes!
      @user.highscore = @match.score if @match.score > @user.highscore

      #accuracy
      max_score = @match.questions.sum(:score)
      current_accuracy = @match.score.to_f / max_score * ATTRIBUTE_MAX
      @user.accuracy = inch(@user.accuracy, current_accuracy)

      #speed
      max_time = QUESTION_LIMIT * QUESTION_TIME
      bonus_time = 500 * QUESTION_LIMIT
      current_speed = (max_time - @match.time).to_f / (max_time - bonus_time) * ATTRIBUTE_MAX
      @user.speed = inch(@user.speed, current_speed)

      #impressiveness
      needed_streak = QUESTION_LIMIT.abs2 / 2.0
      current_impr = (@match.streak.to_f / needed_streak) * ATTRIBUTE_MAX
      if current_impr > @user.impressiveness
        @user.impressiveness = inch(@user.impressiveness, current_impr, true)
      else
        @user.impressiveness = inch(@user.impressiveness, current_impr)
      end

      #versatility
      total_cat = Category.count
      needed_cat = 0.7 * total_cat
      cat_ids = @user.matches.order(updated_at: :desc).limit(total_cat).pluck(:category_id).uniq
      current_versa = (cat_ids.length / needed_cat) * ATTRIBUTE_MAX
      @user.versatility = inch(@user.versatility, current_versa)

      #diligence
      @user.last_played = @user.updated_at if @user.last_played.nil?
      current_time = Time.now
      needed_interval = 86400
      dif = current_time - @user.last_played - needed_interval
      if dif <= 0
        @user.diligence = inch(@user.diligence, ATTRIBUTE_MAX, true)
      else
        current_diligence = -(dif / needed_interval) * ATTRIBUTE_MAX
        @user.diligence = inch(@user.diligence, current_diligence, true)
      end
      @user.last_played = current_time

      @user.save!
    end

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
