require 'test_helper'

class Api::CategoriesControllerTest < ActionController::TestCase
  test "should return categories list" do
    get :index
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 200, data['status']
    assert_equal 2, data['data'].length
  end
end
