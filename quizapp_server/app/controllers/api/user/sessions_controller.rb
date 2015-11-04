require 'rubygems'
require 'json'
require 'open-uri'

class Api::User::SessionsController < ApplicationController
  def create
    provider = params.require(:provider)
    token = params.require(:access_token)

    if provider == 'facebook'
      url = 'https://graph.facebook.com/' +  'me?access_token=' + token
      string = open(url).read
      data = JSON.parse(string)

      @user = User.find_by facebook_id: data["id"]
      if @user == nil
        @user = User.new(
          name: data["name"],
          facebook_id: data["id"],
          access_token: token,
          avatar: "1.jpg",
          rating: 0,
          highscore: 0,
          exp: 0,
          accuracy: 5.0,
          speed: 5.0,
          versatility: 5.0,
          diligence: 5.0,
          impressiveness: 5.0)
      else
        @user.access_token = token
      end
      @user.save
    else
      render nothing: true, status: :bad_request
    end

    render json: {id: @user.id}
  end

  def destroy
    token = params.require(:access_token)
    user = current_user(token)
    user.access_token = ''
    user.save!
    render nothing: true, status: :ok
  end
end
