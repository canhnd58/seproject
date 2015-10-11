class QuestionsController < ApplicationController
  def index
    begin
      @category = Category.find(params[:category])
    rescue
      render json: {error: "category #{params[:category]} does not exist"}
    else
      @questions = @category.questions.all
      render json: @questions
    end
  end
end
