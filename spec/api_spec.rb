require 'rspec'
require 'yaml'
require_relative '../API'

# Tests for the API
describe API do
  before :all do
    settings = YAML.load_file('config.yml')

    @api = API.new(plaid_credentials: settings['plaid'],
                   clearbit_key: settings['clearbit_key'])
  end

  %i[access_token public_token transactions logged_in?].each do |method|
    it "responds to access #{method}" do
      expect(@api).to respond_to(method)
    end
  end
  it 'should not be logged in when initialized' do
    expect(@api.logged_in?).to eq true
  end
end
