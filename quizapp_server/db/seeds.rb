# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Category.destroy_all
ActiveRecord::Base.connection.reset_pk_sequence!('categories')

category = Category.create!(name: 'Miscellaneous')

q1 = category.questions.create(
  description: 'Which city is the capital of Vietnam?',
  image_url: 'x.jpg',
  kind: 1,
  score: 10)

q1.answers.create([
  {value: 'Hai Phong', is_correct: false},
  {value: 'Ha Noi', is_correct: true},
  {value: 'Bac Ninh', is_correct: false},
  {value: 'Da Nang', is_correct: false} ])
