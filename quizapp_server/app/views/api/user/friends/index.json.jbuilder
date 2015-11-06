json.friends @friends do |friend|
  json.(friend, :id, :name, :avatar, :win, :lose, :status, :challenge_id)
end
