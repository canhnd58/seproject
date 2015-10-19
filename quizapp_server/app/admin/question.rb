ActiveAdmin.register Question do
  permit_params :description, :image_url, :kind, :score,
    answers_attributes: [:value, :is_correct]

  belongs_to :category, optional: true

  sidebar "Question Details", only: [:show, :edit] do
    link_to "Answers", admin_question_answers_path(question)
  end

  index do
    selectable_column
    id_column
    column :description
    column :image_url
    column :kind
    column :score
    column :updated_at
    column "Answers" do |question|
      link_to "Answers", admin_question_answers_path(question)
    end
    actions
  end

  form do |f|
    f.inputs 'Questions details' do
      f.input :category_id, :as => :select, :collection => Category.all.map {|u| ["#{u.name}", u.id]}, :include_blank => false
      f.input :description
      f.input :image_url
      f.input :kind
      f.input :score
      f.has_many :answers do |answer|
        answer.input :value
        answer.input :is_correct
      end
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :description
      row :image_url
      row :kind
      row :score
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
