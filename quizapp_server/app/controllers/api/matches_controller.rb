class Api::MatchesController < ApplicationController
  QUESTION_LIMIT = 10

  def create
    token = params.require(:access_token)
    category = Category.find(params.require(:category))

    user = current_user(token)

    #randomize questions
    q_ids = category.question_ids.sort_by { rand }.slice(0, QUESTION_LIMIT)
    questions = Question.where(id: q_ids).sort_by{ rand }

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
    #@match.streak = params.require(:streak)
    answer_ids = params.require(:answers)

    answer_ids.each do |a_id|
      q_id = Answer.find(a_id).question_id
      m_question = MatchQuestion.where(match_id: @match.id, question_id: q_id).first
      m_question.answer_id = a_id
      m_question.save
    end
    update_attributes
    @match.save!
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
    def update_attributes
    end
end
