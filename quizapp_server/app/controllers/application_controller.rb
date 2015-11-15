class ApplicationController < ActionController::Base
  include ApiHelper

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  rescue_from ActionController::ParameterMissing, with: :bad_request
  rescue_from ApiException::InvalidToken, with: :access_denied
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from OpenURI::HTTPError, with: :access_denied
  rescue_from ApiException::InvalidAction, with: :forbidden

  def access_denied(exception)
    render nothing:true, status: :unauthorized
  end

  def forbidden(exception)
    render nothing: true, status: :forbidden
  end

  def not_found(exception)
    render nothing: true, status: :not_found
  end

  def bad_request(exception)
    render nothing: true, status: :bad_request
  end
end
