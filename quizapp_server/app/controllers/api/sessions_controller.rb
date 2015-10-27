require 'rubygems'
require 'json'
require 'open-uri'

class Api::SessionsController < ApplicationController
  def create
    begin
      provider = params.require(:provider)
      token = params.require(:access_token)

      if provider == 'facebook'
        url = 'https://graph.facebook.com/' +  'me?access_token=' + token
        string = open(url).read
        data = JSON.parse(string)
        if data["name"] == nil or data["id"] == nil
          @status = 301
          return
        end

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
        @status = 302
      end

      @status = 200
    rescue ActionController::ParameterMissing
      @status = 302
    rescue OpenURI::HTTPError
      #Don't know why wrong access_token raises Error Bad Request
      @status = 301
    end
  end

  def destroy
    begin
      token = params.require(:access_token)
      user = current_user(token)
      user.access_token = ''
      user.save
      @status = 200
    rescue ActionController::ParameterMissing
      @status = 302
    rescue ApiException::InvalidToken
      @status = 301
    end
  end
end
