class QuestionsController < ApplicationController
  def index
    begin
      @category = Category.find(params[:category_id])
    rescue
      render :json => { :error => "category #{params[:category_id]} does not exist" }
    else
      @questions = @category.questions.all
      render :json => @questions
    end
  end
end
