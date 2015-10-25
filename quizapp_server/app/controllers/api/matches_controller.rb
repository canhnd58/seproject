class Api::MatchesController < ApplicationController
  def new
    begin
      category = Category.find(params[:category])
    rescue ActiveRecord::RecordNotFound
      @status = 401
    else
      @status = 200
      @questions = category.questions.all
    end
  end

  def save
  end
end
