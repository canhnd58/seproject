ActiveAdmin.register Rank do
  permit_params :avatar

  show do
    attributes_table do
      row :id
      row "Avatar" do |rank|
        link_to image_tag(rank.avatar.url), rank.avatar.url
      end
      row :created_at
      row :updated_at
    end
  end
end
