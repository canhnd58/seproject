class Api::User::FriendsController < ApplicationController
  def index

  end

  def update
    token = params.require(:access_token)
    friendslist = params.require(:friends)
    user = current_user(token)
    friendslist.each do |f|
      @friend = user.user_friend.find_by friend_id: f
      if @friend = nil
        @friend = user.new(
          friend_id: f
          status: 0
          win: 0
          lose: 0
          )
        @friend.save
  end

  def show

  end
end
