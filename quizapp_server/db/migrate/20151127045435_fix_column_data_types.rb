class FixColumnDataTypes < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.change :rating, :float, default: 0
      t.change :accuracy, :float, default: 0
      t.change :speed, :float, default: 0
      t.change :versatility, :float, default: 0
      t.change :diligence, :float, default: 0
      t.change :impressiveness, :float, default: 0
    end
  end
end
