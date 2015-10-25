require 'rubygems'
require 'json'
require 'open-uri'

class Api::SessionsController < ApplicationController
  def create
    token = params[:access_token]
    url = 'https://graph.facebook.com/' +  'me?access_token=' + token
    string = open(url).read
    data = JSON.parse(string)
    #data = JSON.parse(token)
    if data["name"] == nil or data["id"] == nil
      @status = 301
      return
    end

    @user = User.find_by facebook_id: data["id"]
    if @user == nil
      @user = User.new(
        name: data["name"],
        facebook_id: data["id"],
        avatar: "1.jpg",
        rating: 0,
        highscore: 0,
        exp: 0,
        accuracy: 5.0,
        speed: 5.0,
        versatility: 5.0,
        diligence: 5.0,
        impressiveness: 5.0)
      @user.save
    end

    @status = 200
  end

  def destroy
  end
end
