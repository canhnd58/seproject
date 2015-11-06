class ApplicationController < ActionController::Base
  include ApiHelper

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  rescue_from ActionController::ParameterMissing do
    render nothing: true, status: :bad_request
  end

  rescue_from ApiException::InvalidToken do
    render nothing: true, status: :unauthorized
  end

  rescue_from ActiveRecord::RecordNotFound do
    render nothing: true, status: :not_found
  end

  rescue_from OpenURI::HTTPError do
    render nothing: true, status: :unauthorized
  end

  def access_denied(exception)
    render status: :unauthorized
  end
end
