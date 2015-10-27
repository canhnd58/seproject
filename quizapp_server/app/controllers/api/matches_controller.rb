class Api::MatchesController < ApplicationController
  QUESTION_LIMIT = 10

  def new
    begin
      token = params.require(:access_token)
      category = Category.find(params.require(:category))

      @user = current_user(token)

      #randomize questions
      q_ids = category.question_ids.sort_by { rand }.slice(0, QUESTION_LIMIT)
      @questions = Question.where(id: q_ids).sort_by{ rand }

      @match = Match.new

      @status = 200
    rescue ActionController::ParameterMissing
      @status = 302
    rescue ApiException::InvalidToken
      @status = 301
    rescue ActiveRecord::RecordNotFound
      @status = 401
    end
  end

  def save
  end

  private
    def update_attributes
    end
end
