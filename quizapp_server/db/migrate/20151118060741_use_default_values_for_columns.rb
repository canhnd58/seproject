class UseDefaultValuesForColumns < ActiveRecord::Migration
  def change
    change_table :user_friends do |t|
      t.change :win, :integer, default: 0
      t.change :lose, :integer, default: 0
      t.change :status, :integer, default: 0
    end

    change_table :users do |t|
      t.change :rating, :integer, default: 0
      t.change :highscore, :integer, default: 0
      t.change :exp, :integer, default: 0
      t.change :accuracy, :integer, default: 0
      t.change :speed, :integer, default: 0
      t.change :versatility, :integer, default: 0
      t.change :diligence, :integer, default: 0
      t.change :impressiveness, :integer, default: 0
    end
  end
end
