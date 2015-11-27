class Api::User::FriendsController < ApplicationController
  def index
    token = params.require(:access_token)
    user = current_user(token)
    @friends = user.user_friends.joins(:friend).all
  end

  def update
    token = params.require(:access_token)
    friendslist = params.require(:friends)
    user = current_user(token)
    friendslist.each do |f|
      userbyfb = User.find_by facebook_id: f

      if userbyfb.nil?
        next
      end

      @friend = user.user_friends.find_by friend_id: userbyfb.id
      if @friend.nil?
        @friend = UserFriend.new(
          friend_id: userbyfb.id,
          user_id: user.id
          )
        @friend.save!
      end
    end
    render nothing: true, status: :ok
  end

  def show

  end
end
