AdminUser.delete_all
AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
User.create!(
  name: 'canh',
  avatar: 'white.png',
  rating: 1000,
  highscore: 100,
  exp: 50000,
  accuracy: 10.0,
  speed: 10.0,
  versatility: 10.0,
  diligence: 10.0,
  impressiveness: 10.0
  )
