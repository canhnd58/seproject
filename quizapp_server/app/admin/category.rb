ActiveAdmin.register Category do
  permit_params :name

  sidebar "Category Details", only: [:show, :edit] do
    link_to "Questions", admin_category_questions_path(category)
  end

  index do
    selectable_column
    id_column
    column :name
    column :updated_at
    column "Questions" do |category|
      link_to "Questions", admin_category_questions_path(category)
    end
    actions
  end
end
