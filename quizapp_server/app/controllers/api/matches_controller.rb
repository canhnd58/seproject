class Api::MatchesController < ApplicationController
  def new
    begin
      status = '200'
      data = {}
      category = Category.find(params[:category])
    rescue ActiveRecord::RecordNotFound
      status = '401'
    else
      data = category.questions.all
    ensure
      render json: {'status': status, 'data': data}
    end
  end

  def save
  end
end
