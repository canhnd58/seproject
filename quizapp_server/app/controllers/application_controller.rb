class ApplicationController < ActionController::Base
  def current_user(token)
    user = User.find_by(access_token: token)
    raise ApiException::InvalidToken if user == nil
    user
  end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
end
