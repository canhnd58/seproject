json.friends @friends do |friend|
  json.(friend, :name, :avatar, :win, :lose, :status, :challenge_id)
end