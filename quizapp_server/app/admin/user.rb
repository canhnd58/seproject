ActiveAdmin.register User do
  menu priority: 4
  permit_params :access_token

  index do
    selectable_column
    id_column
    column :name
    column :highscore
    column "Friends" do |user|
      link_to "#{user.friends.count} friend(s)", admin_user_user_friends_path(user)
    end
    column "Matches" do |user|
      link_to "#{user.matches.count} match(es)", admin_user_matches_path(user)
    end
    column :created_at
    actions
  end
end
