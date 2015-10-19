class Api::CategoriesController < ApplicationController
  def index
    @categories = Category.all
    render json: {'status': '200', 'data': @categories}
  end
end
