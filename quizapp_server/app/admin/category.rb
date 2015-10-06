ActiveAdmin.register Category do

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

permit_params :name

ActiveAdmin.register Question do
	belongs_to :Category
end

ActiveAdmin.register Answer do
	belongs_to :Question
end

  form do |f|
    f.inputs "Add Category" do
      f.input :name
    end
    f.actions
  end

end
