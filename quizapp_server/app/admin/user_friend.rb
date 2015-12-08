ActiveAdmin.register UserFriend do
  belongs_to :user
  permit_params :status

  index title: "Friendship" do
    selectable_column
    column "Name" do |uf|
      link_to "#{uf.friend.name}", admin_user_path(uf.friend_id)
    end
    column :win
    column :lose
    column :status
    actions
  end

  form do |f|
    f.inputs 'Friendship details' do
      f.input :status, as: :select, collection: UserFriend.statuses.keys, include_blank: false
    end
    f.actions
  end
end
