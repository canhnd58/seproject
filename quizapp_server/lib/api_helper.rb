module ApiHelper
  def current_user(token)
    user = User.find_by(access_token: token)
    raise ApiException::InvalidToken if user == nil
    user
  end

  def randomize_questions(category)
    q_ids = category.question_ids.sort_by { rand }.slice(0, QUESTION_LIMIT)
    questions = Question.where(id: q_ids).sort_by{ rand }
  end
end
