json.friends @friends do |friend|
  json.(friend, :win, :lose, :status, :challenge_id)
  json.id friend.friend.id
  json.name friend.friend.name
  json.avatar friend.friend.avatar
end
