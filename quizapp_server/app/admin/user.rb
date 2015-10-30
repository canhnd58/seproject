ActiveAdmin.register User do
  menu priority: 4

  index do
    selectable_column
    id_column
    column :name
    column :highscore
    column :rating
    column "Matches" do |user|
      link_to "Matches", admin_user_matches_path(user)
    end
    column :created_at
    actions
  end
end
