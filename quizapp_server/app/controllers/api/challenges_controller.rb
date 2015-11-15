class Api::ChallengesController < ApplicationController
  def create
    challenger = current_user(params.require :access_token)
    category = Category.find(params.require :category)
    challengee = challenger.friends.find(params.require :opponent_id)
    challenger_f = challenger.user_friends.find_by friend_id: challengee.id
    challengee_f = challengee.user_friends.find_by friend_id: challenger.id

    #Create new friendship if the challengee has not updated his friendlist
    if challengee_f.nil?
      challengee_f = UserFriend.new(
          friend_id: challenger.id,
          win: 0,
          lose: 0,
          status: 0,
          user_id: challengee.id)
    end
    raise ApiException::InvalidAction unless challenger_f.normal? && (challengee_f.normal? || challengee_f.not_viewed?)

    #Create a new challenge with two matches
    questions = randomize_questions(category)
    challenger_match = Match.create!(
      questions: questions,
      user_id: challenger.id,
      category_id: category.id)
    challengee_match = Match.create!(
      questions: questions,
      user_id: challengee.id,
      category_id: category.id)
    @challenge = Challenge.create!(
      challenger_id: challenger.id,
      challengee_id: challengee.id,
      challenger_match_id: challenger_match.id,
      challengee_match_id: challengee_match.id)

    #Change users' status
    challenger_f.challenge_id = @challenge.id
    challenger_f.challenging!
    challenger_f.save!
    if challengee_f.normal?
      challengee_f.challenge_id = @challenge.id
      challengee_f.save!
    end
  end

  def index
    user = current_user(params.require :access_token)
    num = params[:limit] || 10
    @challenges = Challenge.order('updated_at DESC')
                  .where('challenger_id = :id OR challengee_id = :id', id: user.id)
                  .limit(num)
  end

  def show
    @challenge = Challenge.find(params[:id])
    user = current_user(params.require :access_token)
    @challenger_match = Match.find(@challenge.challenger_match_id)
    @challengee_match = Match.find(@challenge.challengee_match_id)
    challenger = UserFriend.find_by user_id: @challenge.challenger_id, friend_id: @challenge.challengee_id

    #Only update user's status when the request is from the challenger
    if user.id == @challenge.challenger_id && challenger.not_viewed?
      challengee = UserFriend.find_by user_id: @challenge.challengee_id, friend_id: @challenge.challenger_id
      if challengee.challenging?
        challenger.challenged!
        challenger.challenge_id = challengee.challenge_id
      else
        challenger.normal!
      end
      challenger.save!
    end
  end
end
