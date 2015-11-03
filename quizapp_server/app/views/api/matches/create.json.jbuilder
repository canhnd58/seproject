json.match_id @match.id
json.questions @questions do |question|
  json.(question, :description, :kind, :score)
  json.image_url question.image.url
  json.answers question.answers do |answer|
    json.(answer, :value, :is_correct)
  end
end

