class Api::MatchesController < ApplicationController
  def create
    token = params.require(:access_token)
    category = Category.find(params.require(:category))

    user = current_user(token)
    questions = randomize_questions(category)

    @match = Match.create!(
      questions: questions,
      user_id: user.id,
      category_id: category.id)
  end

  def update
    @user = current_user(params.require(:access_token))
    @match = Match.find(params.require(:id))
    @match.score = params.require(:score)
    @match.time = params.require(:time)
    @match.streak = params.require(:streak)
    answer_ids = params.require(:answers)

    answer_ids.each do |a_id|
      q_id = Answer.find(a_id).question_id
      m_question = MatchQuestion.where(match_id: @match.id, question_id: q_id).first
      m_question.answer_id = a_id
      m_question.save!
    end
    update_user_attributes!
    @match.save!
    update_user_status!
    render nothing: true, status: :ok
  end

  def show
    token = params.require(:access_token)
    user = current_user(token)
    match = user.matches.find(params[:id])
    @questions = match.questions
  end

  def result
    #SELECTED_COLUMNS =
    @match = Match.find(params[:id])
    @m_questions = MatchQuestion.joins(:question)
                  .joins("INNER JOIN answers ON match_questions.answer_id = answers.id")
                  .select([:description, :score], "answers.value AS answer_value, answers.is_correct AS answer_is_correct")
                  .where(match_id: @match.id)
  end

  private
    def update_user_attributes!
    end

    def update_user_status!
      challenge = @user.friend_challenges.find_by(challengee_match_id: @match.id)
      unless challenge.nil?
        user = UserFriend.where(user_id: challenge.challengee_id, friend_id: challenge.challenger_id).first
        friend = UserFriend.where(user_id: challenge.challenger_id, friend_id: challenge.challengee_id).first

        user.normal!
        friend.not_viewed!
        f_match = Match.find(challenge.challenger_match_id)
        win = @match.score > f_match.score || (@match.score == f_match.score && @match.time < f_match.time)
        if win == true
          user.win += 1
          friend.lose += 1
        else
          user.lose += 1
          friend.win += 1
        end

        user.save!
        friend.save!
      end
    end
end
