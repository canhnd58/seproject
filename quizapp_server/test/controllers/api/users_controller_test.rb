require 'test_helper'

class Api::UsersControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end

  test "should return not found error" do
    get :show, {id: 100}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 401, data['status']
  end
end
