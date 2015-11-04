json.questions @questions do |q|
  json.(q, :description, :kind, :score)
  json.image_url q.image.url
  json.answers q.answers do |a|
    json.(a, :value, :is_correct)
  end
end
