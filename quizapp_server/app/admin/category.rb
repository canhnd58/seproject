ActiveAdmin.register Category do
  menu priority: 3
  permit_params :name

  index do
    selectable_column
    id_column
    column :name
    column "Questions" do |category|
      link_to "#{category.questions.count} question(s)", admin_category_questions_path(category)
    end
    column :updated_at
    actions
  end

  filter :id
  filter :name
  filter :created_at
  filter :updated_at

  show do
    attributes_table do
      row :id
      row :name
      row :image_url
      row :created_at
      row :updated_at
      row "Questions" do |category|
        link_to "#{category.questions.count} question(s)", admin_category_questions_path(category)
      end
    end
  end

end
