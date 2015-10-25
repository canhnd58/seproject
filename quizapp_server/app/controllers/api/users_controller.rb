class Api::UsersController < ApplicationController
  def show
    begin
      @user = User.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      @status = 401
    else
      @status = 200
    end
  end
end
