class Api::CategoriesController < ApplicationController
  def index
    @status = 200
    @categories = Category.all
  end
end
