class Ability
  include CanCan::Ability

  def initialize(admin)
    admin ||= AdminUser.new
    can :manage, :all

    cannot [:update, :destroy], AdminUser
    can [:update, :destroy], AdminUser, id: admin.id

    #cannot [:create, :update], User
  end
end
