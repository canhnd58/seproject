require 'test_helper'

class Api::UsersControllerTest < ActionController::TestCase
  test "get user information with non-exist id" do
    get :show, {id: 100}
    assert_response :not_found
  end

  test "get user information with exist id" do
    get :show, {id: 1}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 'hgminh', data['name']
  end

  test "update user information with invalid access token" do
    patch :update, {id: 1, access_token: 'abc', name: 'hgminh95'}
    assert_response :unauthorized
  end

  test "update user information with valid access token" do
    patch :update, {id: 1, access_token: 'mmm', name: 'hgminh95'}
    assert_response :ok

    assert_equal 'hgminh95', User.find(1).name
  end
end
