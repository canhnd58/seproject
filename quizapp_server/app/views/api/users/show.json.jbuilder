json.(@user, :name, :rating, :highscore, :exp)

json.avatar @rank.avatar.url
json.accuracy @user.accuracy.round(1)
json.speed @user.speed.round(1)
json.versatility @user.versatility.round(1)
json.diligence @user.diligence.round(1)
json.impressiveness @user.impressiveness.round(1)


