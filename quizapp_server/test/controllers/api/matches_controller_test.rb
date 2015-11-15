require 'test_helper'

class Api::MatchesControllerTest < ActionController::TestCase
  test "create new match with invalid access token" do
    post :create, {category: 2, access_token: 'xxx'}
    assert_response :unauthorized
  end

  test "create new match with invalid parameters" do
    post :create, {cat: 2, access_token: 'xxx'}
    assert_response :bad_request
  end

  test "create new match with non-exist category" do
    post :create, {category: 3, access_token: 'mmm'}
    assert_response :not_found
  end

  test "create new match" do
    post :create, {category: 2, access_token: 'mmm'}
    assert_response :ok

    data = JSON.parse @response.body
    assert_equal 2, data['questions'].length
  end

  test "get match information with invalid access token" do
    get :show, {id: 1, access_token: 'xyz'}
    assert_response :unauthorized
  end

  test "get match information with valid access token" do
    get :show, {id: 1, access_token: 'mmm'}
    assert_response :ok

    data = JSON.parse @response.body
    assert_equal 2, data['questions'].length
  end

  test "get match information twice" do
    #TODO implements
  end

  test "get match result with non-exist id" do
    get :result, {id: 100}
    assert_response :not_found
  end

  test "get match result of non-completed match" do
    get :result, {id: 1}
    assert_response :not_found #TODO specify this case in api references
  end

  test "get match result with exist id" do
    get :result, {id: 2}
    assert_response :ok

    data = JSON.parse @response.body
    assert_equal 10, data['score']
  end

  test "update result of match with missing parameters" do
    patch :update, {id: 1, access_token: 'mmm'}
    assert_response :bad_request
  end

  test "update result of match with invalid access token" do
    patch :update, {id: 1, access_token: 'xxx', score: 10, time: 10, streak: 10,
      answers: [1, 2]}
    assert_response :unauthorized
  end

  test "update result of completed match" do
    patch :update, {id: 2, access_token: 'mmm', score: 10, time: 10, streak: 10,
      answers: [1, 2]}
    assert_response :bad_request
  end

  test "update result of match" do
    patch :update, {id: 1, access_token: 'mmm', score: 10, time: 10, streak: 10,
      answers: [1, 2]}
    assert_response :ok
  end
end
