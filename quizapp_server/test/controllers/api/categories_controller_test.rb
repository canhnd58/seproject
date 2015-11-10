require 'test_helper'

class Api::CategoriesControllerTest < ActionController::TestCase
  test "should return categories list" do
    get :index
    assert_response :ok

    data = JSON.parse @response.body
    assert_equal 2, data['categories'].length
  end
end
