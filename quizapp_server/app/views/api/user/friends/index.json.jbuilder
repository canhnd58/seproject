json.friends @friends do |friend|
  json.(friend, :id, :win, :lose, :status, :challenge_id)
  json.name friend.friend.name
  json.avatar friend.friend.avatar
end
