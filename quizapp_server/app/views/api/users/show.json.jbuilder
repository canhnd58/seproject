json.status @status
if @status == 200
  json.data do
    json.(@user, :name, :avatar, :rating, :highscore, :exp,
                :accuracy, :speed, :versatility, :diligence, :impressiveness)
  end
end
