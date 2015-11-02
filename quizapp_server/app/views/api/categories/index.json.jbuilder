json.categories @categories do |category|
  json.(category, :id, :name)
  json.image_url category.image.url
end
