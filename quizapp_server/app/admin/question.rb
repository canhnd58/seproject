ActiveAdmin.register Question do
  menu priority: 2
  permit_params :description, :image, :kind, :score, :category_id,
    answers_attributes: [:id, :value, :is_correct, :_destroy]

  belongs_to :category, optional: true

  index do
    selectable_column
    id_column
    column :description do |question|
      text = "#{question.description[0..150]}"
      text += "..." if question.description.length > 150
      text
    end
    column :kind
    column :score
    column :updated_at
    actions
  end

  filter :category
  filter :id
  filter :description
  filter :score
  filter :kind
  filter :created_at
  filter :updated_at

  form do |f|
    f.inputs 'Questions details' do
      f.input :category_id, as: :select, collection: Category.all.map {|cat| [cat.name, cat.id]}, include_blank: false
      f.input :description
      f.input :image
      f.input :kind
      f.input :score
    end
    f.inputs "Answers" do
      f.has_many :answers, heading: false, allow_destroy: true do |answer|
        answer.input :value
        answer.input :is_correct
      end
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :category
      row :description
      row "Image" do |question|
        link_to image_tag(question.image.url), question.image.url
      end
      row :kind
      row :score
      row :created_at
      row :updated_at
    end

    panel "Answers" do
      table_for question.answers do
        column :value
        column :is_correct
      end
    end
  end

end
