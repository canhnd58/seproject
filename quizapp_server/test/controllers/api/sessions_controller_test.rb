require 'test_helper'

class Api::SessionsControllerTest < ActionController::TestCase
  test "should return authentication error" do
    post :create, {"access_token" => "xxx", "provider" => "facebook"}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 301, data['status']
  end

  test "should return syntax error" do
    post :create
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 302, data['status']
  end

end
