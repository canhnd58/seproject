require 'test_helper'

class Api::MatchesControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end
  setup do
    @request.headers['Accept'] = Mime::JSON
  end

  test "should return authentication error" do
    get :new, {category: 2, access_token: 'xxx'}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 301, data['status']
  end

  test "should return syntax error" do
    get :new, {cat: 2, access_token: 'xxx'}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 302, data['status']
  end

  test "should return not found error" do
    # NOTE: this test has not been completed yet
    get :new, {category: 3, access_token: 'xxx'}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 401, data['status']
  end

  test "should return questions" do
    # NOTE: this test has not been completed yet
    get :new, {category: 2, access_token: 'xxx'}
    assert_response :success

    data = JSON.parse @response.body
    assert_equal 200, data['status']
    assert_equal 2, data['data'].length
  end
end
