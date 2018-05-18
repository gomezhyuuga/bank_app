require 'pry'
require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/cors'
require 'sinatra/config_file'
require 'rack/contrib'

require 'active_support'
require 'active_support/core_ext/numeric/time'
require 'active_support/core_ext/integer/time'

require_relative 'api'

# Interview Server Controller
class InterviewApp < Sinatra::Base
  register Sinatra::ConfigFile
  use Rack::PostBodyContentTypeParser

  # Settings
  config_file 'config.yml'
  set :sessions, true

  APP_API = API.new(plaid_credentials: settings.plaid,
                    clearbit_key: settings.clearbit_key)
  # transactions = JSON.parse(File.read('transactions.json'))
  # APP_API.transactions = transactions['transactions']
  # APP_API.domains = JSON.parse(File.read('domains.json'))
  # APP_API.companies = JSON.parse(File.read('companies.json'))

  configure :development do
    register Sinatra::Reloader
    after_reload do
      puts "#{'#' * 10} RELOADED #{'#' * 10}"
    end
  end
  before '/transactions*' do
    response.headers['Access-Control-Allow-Origin'] = '*'
    content_type :json

    403 unless APP_API.logged_in?
  end
  options '*' do
    response.headers['Allow'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token, access-control-allow-origin,content-type'
    response.headers['Access-Control-Allow-Origin'] = '*'
    200
  end

  get '/companies/:name' do
    content_type :json
    company = APP_API.company_info(params['name'])
    halt 404, 'Company not found' unless company

    return company.to_json
  end

  # Routes
  get '/transactions' do
    begin
      response = APP_API.transactions
    rescue Plaid::ItemError, Plaid::InvalidInputError, Plaid::InvalidRequestError => e
      response = { error: { error_code: e.error_code, error_message: e.error_message } }
      halt 400, response.to_json
    end

    response.to_json
  end

  post '/get_access_token' do
    begin
      response = APP_API.generate_access_token(params['public_token'])
    rescue Plaid::InvalidInputError => e
      puts e.inspect
      halt 400, { error: { error_code: e.error_code, error_message: e.error_message } }.to_json
    end

    response.to_json
  end
end
