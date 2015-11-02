class Api::MatchesController < ApplicationController
  QUESTION_LIMIT = 10

  def create
    token = params.require(:access_token)
    category = Category.find(params.require(:category))

    @user = current_user(token)

    #randomize questions
    q_ids = category.question_ids.sort_by { rand }.slice(0, QUESTION_LIMIT)
    @questions = Question.where(id: q_ids).sort_by{ rand }

    @match = Match.new
  end

  def update
  end

  def show
  end

  def result
  end

  private
    def update_attributes
    end
end
