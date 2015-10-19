ActiveAdmin.register User do
  permit_params :name, :facebook_id, :avatar

  form do |f|
    f.inputs "User Details" do
      f.input :name
      f.input :facebook_id
      f.input :avatar
    end
    f.actions
  end

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end


end
