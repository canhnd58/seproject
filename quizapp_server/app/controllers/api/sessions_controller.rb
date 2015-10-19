class Api::SessionsController < ApplicationController
  def create
    token = params[:access_token]
    render json: {'status': '200', 'data': token}
  end

  def destroy
  end
end
