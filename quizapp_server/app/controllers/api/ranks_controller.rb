class Api::RanksController < ApplicationController
  def show
    @rank = Rank.find params[:id]
  end
end
