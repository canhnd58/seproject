# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151127122950) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

  create_table "admin_users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
  add_index "admin_users", ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree

  create_table "answers", force: :cascade do |t|
    t.string   "value"
    t.boolean  "is_correct"
    t.integer  "question_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "answers", ["question_id"], name: "index_answers_on_question_id", using: :btree

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "image"
  end

  create_table "challenges", force: :cascade do |t|
    t.integer  "challenger_id"
    t.integer  "challengee_id"
    t.integer  "challenger_match_id"
    t.integer  "challengee_match_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "match_questions", force: :cascade do |t|
    t.integer  "match_id"
    t.integer  "question_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "answer_id"
  end

  add_index "match_questions", ["answer_id"], name: "index_match_questions_on_answer_id", using: :btree
  add_index "match_questions", ["match_id"], name: "index_match_questions_on_match_id", using: :btree
  add_index "match_questions", ["question_id"], name: "index_match_questions_on_question_id", using: :btree

  create_table "matches", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "score"
    t.integer  "time"
    t.integer  "category_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "streak"
  end

  add_index "matches", ["category_id"], name: "index_matches_on_category_id", using: :btree
  add_index "matches", ["user_id"], name: "index_matches_on_user_id", using: :btree

  create_table "questions", force: :cascade do |t|
    t.text     "description"
    t.string   "image"
    t.integer  "score"
    t.integer  "category_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "kind"
  end

  add_index "questions", ["category_id"], name: "index_questions_on_category_id", using: :btree

  create_table "ranks", force: :cascade do |t|
    t.string   "avatar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_friends", force: :cascade do |t|
    t.integer  "friend_id"
    t.integer  "status",       default: 0
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "win",          default: 0
    t.integer  "lose",         default: 0
    t.integer  "challenge_id"
    t.integer  "user_id"
  end

  add_index "user_friends", ["challenge_id"], name: "index_user_friends_on_challenge_id", using: :btree
  add_index "user_friends", ["user_id"], name: "index_user_friends_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "facebook_id"
    t.string   "avatar"
    t.float    "rating",         default: 0.0
    t.integer  "highscore",      default: 0
    t.integer  "exp",            default: 0
    t.float    "accuracy",       default: 0.0
    t.float    "speed",          default: 0.0
    t.float    "versatility",    default: 0.0
    t.float    "diligence",      default: 0.0
    t.float    "impressiveness", default: 0.0
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "access_token"
    t.datetime "last_played"
  end

  add_foreign_key "answers", "questions"
  add_foreign_key "match_questions", "answers"
  add_foreign_key "match_questions", "matches"
  add_foreign_key "match_questions", "questions"
  add_foreign_key "matches", "categories"
  add_foreign_key "matches", "users"
  add_foreign_key "questions", "categories"
  add_foreign_key "user_friends", "challenges"
  add_foreign_key "user_friends", "users"
end
