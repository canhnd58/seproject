json.match_id @match.id
json.questions @questions do |question|
  json.(question, :description, :image_url, :kind, :score)
  json.answers question.answers do |answer|
    json.(answer, :value, :is_correct)
  end
end

