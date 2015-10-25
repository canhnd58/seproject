json.status @status
if @status == 200
  json.data do
    json.id @user.id
  end
end
