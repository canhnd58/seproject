class Api::ChallengesController < ApplicationController
  def create
    challenger = current_user(params.require(:access_token))
    category = Category.find(params.require(:category))
    challengee = challenger.friends.find(params.require(:opponent_id))

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

    challenger_f = challenger.user_friends.find_by(friend_id: challengee.id)
    challenger_f.challenging!
    challenger_f.challenge_id = @challenge.id
    challenger_f.save!

    challengee_f = challengee.user_friends.find_by(friend_id: challenger.id)
    if challengee_f.nil?
      challengee_f = UserFriend.new(
          friend_id: challenger.id,
          win: 0,
          lose: 0,
          user_id: challengee.id
          )
    end
    challengee_f.challenged!
    challengee_f.challenge_id = @challenge.id
    challengee_f.save!
  end

  def index
    user = current_user(params.require(:access_token))
    num = params[:limit] || 10
    @challenges = Challenge.order('updated_at DESC')
                  .where('challenger_id = :id OR challengee_id = :id', id: user.id)
                  .limit(num)
  end

  def show
    @challenge = Challenge.find(params[:id])
    @challenger_match = Match.find(@challenge.challenger_match_id)
    @challengee_match = Match.find(@challenge.challengee_match_id)
    challenger = UserFriend.where(user_id: @challenge.challenger_id, friend_id: @challenge.challengee_id).first

    if challenger.not_viewed?
      challenger.normal!
      challenger.save!
    end
  end
end
