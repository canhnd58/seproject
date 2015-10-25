class Api::MatchesController < ApplicationController
  def new
    begin
      token = params.require(:access_token)
      category = Category.find(params.require(:category))
      user = User.find_by(access_token: token)
      if user == nil
        @status = 301
        return
      end
      @status = 200
      @questions = category.questions.all
    rescue ActionController::ParameterMissing
      @status = 302
    rescue ActiveRecord::RecordNotFound
      @status = 401
    end
  end

  def save
  end
end
