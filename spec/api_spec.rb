require 'rspec'
require 'yaml'
require 'json'
require 'faker'
require_relative '../API'

# Tests for the API
describe API do
  before :context do
    settings = YAML.load_file('config.yml')
    @api = API.new(plaid_credentials: settings['plaid'],
                   clearbit_key: settings['clearbit_key'])
    @transactions = JSON.parse(File.read('transactions.json'))['transactions']
  end

  %i[access_token public_token transactions logged_in?
     domains fetch_domains companies].each do |method|
    it "responds to access #{method}" do
      expect(@api).to respond_to(method)
    end
  end
  context 'when not logged in' do
    describe '#logged_in?' do
      it { expect(@api.logged_in?).to eq false }
    end
  end

  describe 'Clearbit integration' do
    before :all do
      @api.transactions = @transactions
      extract_name = ->(x) { x['name'].gsub(/[^A-Za-z\s]/, '') }
      @names = @transactions.map(&extract_name).uniq
    end
    describe '#names_to_domains' do
      it 'converts company names to domains' do
        expect(@api.domains).to be_empty
        @api.fetch_domains()
        expect(@api.domains).not_to be_empty
        expect(@api.domains).to include(*@names)
      end
    end
    describe '#enrich_domains' do
      it 'retrieves information for the domains' do
        expect(@api.companies).to be_empty
        @api.fetch_domains()
        @api.enrich_domains()
        expect(@api.companies).not_to be_empty
        expect(@api.companies).to include(*@names)
      end
    end
  end
end
