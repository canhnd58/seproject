ActiveAdmin.register Category do
  menu priority: 3
  permit_params :name, :image

  index do
    selectable_column
    id_column
    column :name
    column "Questions" do |category|
      link_to "#{category.questions.count} question(s)", admin_category_questions_path(category)
    end
    column :created_at
    column :updated_at
    actions
  end

  filter :id
  filter :name
  filter :created_at
  filter :updated_at

  form html: { multipart: true } do |f|
    f.inputs 'Category details' do
      f.input :name
      f.input :image
    end
    f.actions
  end
  show do
    attributes_table do
      row :id
      row :name
      row "Image" do |category|
        link_to image_tag(category.image.url), category.image.url
      end
      row "Questions" do |category|
        link_to "#{category.questions.count} question(s)", admin_category_questions_path(category)
      end
      row :created_at
      row :updated_at
    end
  end

end
