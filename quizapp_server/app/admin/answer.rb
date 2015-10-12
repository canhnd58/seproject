ActiveAdmin.register Answer do
  permit_params :value, :is_correct

  belongs_to :question, optional: true
end
