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
  enable :sessions, :static
  set :public_folder, -> { File.join(root, 'client/build') }
  set :views, -> { File.join(root, 'client/build') }
  set :server, :puma
  APP_API = API.new(plaid_credentials: settings.plaid,
                    clearbit_key: settings.clearbit_key)

  configure :development do
    register Sinatra::Reloader
  end

  before '/transactions*' do
    content_type :json

    403 unless APP_API.logged_in?
  end

  get '/' do
    render :html, :index
  end

  get '/companies/:name' do
    content_type :json
    company = APP_API.company_info(params['name'])
    halt 404, 'Company not found' unless company

    return company.to_json
  end

  # Receives optional parameters
  # @param [number] count how many transactions retrieve per batch
  # @param [number] offset index to start fetching (to paginate results)
  # @see https://plaid.com/docs/api/#transactions to know the attributes of each record
  # @see API#transactions
  # @return [Array] a list of transactions
  get '/transactions' do
    count  = params['count'].to_i
    offset = params['offset'].to_i
    begin
      response = APP_API.transactions(offset: offset, count: count)
    rescue Plaid::ItemError, Plaid::InvalidInputError, Plaid::InvalidRequestError => e
      response = { error: { error_code: e.error_code, error_message: e.error_message } }
      halt 400, response.to_json
    end

    response.to_json
  end

  # Generates an access token for Plaid
  # @param [public_token] [string] a public_token obtained from a Plaid successful login
  # @see https://plaid.com/docs/api/#api-keys-and-access
  #
  # @return [string, error] `access_token` if the connection is made successfully,
  #   `{ error: { error_code, error_message }}` otherwise.
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
