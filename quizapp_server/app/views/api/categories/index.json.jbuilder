json.status @status
if @status == 200
  json.data @category
  json.data @categories do |category|
    json.(category, :id, :name)
  end
end
