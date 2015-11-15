require 'test_helper'

class Api::ChallengesControllerTest < ActionController::TestCase
  test "create challenge with invalid access token" do
    post :create, access_token: 'abc', category: 1, opponent_id: 2

    assert_response :unauthorized
  end

  test "create challenge with missing parameter" do
    post :create, access_token: 'mmm', cat: 1, opponent_id: 2

    assert_response :bad_request
  end

  test "create challenge with non-exist user" do
    post :create, access_token: 'mmm', category: 1, opponent_id: 10

    assert_response :not_found
  end

  test "create challenge with non-exist category" do
    post :create, access_token: 'mmm', category: 10, opponent_id: 2

    assert_response :not_found
  end

  test "create challenge with same user" do
    post :create, access_token: 'mmm', category: 1, opponent_id: 1

    assert_response :forbidden
  end

  test "create challenge to user who is challenging" do
    post :create, access_token: 'mmm', category: 1, opponent_id: 3

    assert_response :forbidden
  end

  test "get challenge's information with non-exist id" do
    get :show, id: 100

    assert_response :not_found
  end

  test "get challenge's information successfully" do
    get :show, id: 1

    assert_response :ok
  end
end
