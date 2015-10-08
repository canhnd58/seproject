ActiveAdmin.register Question do
  permit_params :description, :image_url, :kind, :score,
    answers_attributes: [:value, :is_correct]

  belongs_to :category
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
end
