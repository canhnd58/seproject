class Api::UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @rank = Rank.find @user.rank
  end

  def update
    @user = current_user(params.require :access_token)
    @user.name = params[:name] || @user.name
    @user.avatar = params[:avatar] || @user.avatar
    @user.save!
    render nothing: true, status: :ok
  end
end
