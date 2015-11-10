require 'test_helper'

class Api::User::SessionsControllerTest < ActionController::TestCase
  test "create new session with invalid token" do
    post :create, {provider: 'facebook', access_token: 'abcdef'}
    assert_response :unauthorized
  end

  test "delete session with non-exist token" do
    delete :destroy, {access_token: 'abcdef'}
    assert_response :unauthorized
  end

  test "delete session with exist token" do
    delete :destroy, {access_token: 'mmm'}
    assert_response :ok
  end


end
