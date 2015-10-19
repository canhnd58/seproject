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
      render json: {'status': '301', 'data': {}}
      return
    end

    user = User.find_by facebook_id: data["id"]
    if user == nil
      new_user = User.new
      new_user.name = data["name"]
      new_user.facebook_id = data["id"]
      new_user.avatar = "123"
      new_user.save
    end

    render json: {'status': '200', 'data': {'message': 'success'}}
  end

  def destroy
  end
end
