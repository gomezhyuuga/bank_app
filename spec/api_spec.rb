require 'rspec'
require 'yaml'
require 'json'
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
     domains fetch_domains companies find_recurring].each do |method|
    it "responds to access #{method}" do
      expect(@api).to respond_to(method)
    end
  end

  subject { @api }
  it { is_expected.to respond_to(:company_info).with(1).argument }

  describe '#find_recurring' do
    it 'identifies recurring transactions' do
      recurrings = %w[ex02 ex03 ex04 ex05 ex06 ex07]
      @api.transactions = JSON.parse([
        { transaction_id: 'xx01', date: '2018-05-20', amount: 312, name: 'Something 1' },
        { transaction_id: 'ex01', date: '2018-05-17', amount: 300, name: 'Sample not recurring' },
        { transaction_id: 'xx02', date: '2018-05-20', amount: 201, name: 'Something 2' },
        { transaction_id: 'ex02', date: '2018-05-15', amount: 444, name: 'Sample recurring' },
        { transaction_id: 'ex03', date: '2018-04-15', amount: 444, name: 'Sample recurring' },
        { transaction_id: 'xx03', date: '2018-05-20', amount: 201, name: 'Something 3' },
        { transaction_id: 'ex04', date: '2018-03-15', amount: 444, name: 'Sample recurring' },
        { transaction_id: 'ex05', date: '2018-01-10', amount: 123, name: 'Sample recurring change year' },
        { transaction_id: 'xx04', date: '2017-12-20', amount: 201, name: 'Something 4' },
        { transaction_id: 'ex06', date: '2017-12-10', amount: 123, name: 'Sample recurring change year' },
        { transaction_id: 'xx05', date: '2017-11-19', amount: 201, name: 'Something 5' },
        { transaction_id: 'ex07', date: '2017-11-10', amount: 123, name: 'Sample recurring change year' }
      ].to_json)
      expect(@api.find_recurring).to include(*recurrings)
      lst = @api.transactions.select { |t| recurrings.include? t['transaction_id'] }
      lst.each { |t| expect(t).to include('recurring' => true) }
    end
  end

  context 'when not logged in' do
    describe '#logged_in?' do
      it { expect(@api.logged_in?).to eq false }
    end
    describe '#transactions' do
      context 'when no offset' do
        it 'returns a list of 10 transactions' do
          @api.transactions = @transactions
          expect(@api.transactions.length).to eq 10
        end
      end
      context 'when offset provided' do
        it 'returns the next 10 transactions' do
          id_mapper = ->(x) { x['transaction_id'] }
          @api.transactions = @transactions
          count = 10
          ids = @api.transactions.map(&id_mapper)
          expected_ids = @transactions.map(&id_mapper)
          expect(ids.length).to eq 10
          expect(ids).to include(*expected_ids[0...count])
          ids = @api.transactions(offset: 10, count: 10).map(&id_mapper)
          expect(ids.length).to eq 10
          expect(ids).to include(*expected_ids[count...(count * 2)])
        end
      end
    end
  end

  before :all do
    @api.transactions = @transactions
    @names = @transactions.map { |x| API.clean_name(x['name']) }.uniq
  end
  describe '.clean_name' do
    it 'returns names of a company without special characters' do
      names = ['Uber 072515 SF**POOL**', 'United Airlines', 'CD DEPOSIT .INITIAL.',
               "McDonald's", 'CREDIT CARD 3333 PAYMENT *//']
      clean = ['Uber', 'United Airlines', 'CD DEPOSIT INITIAL',
               'McDonalds', 'CREDIT CARD PAYMENT']
      clean_name = ->(x) { API.clean_name(x) }
      expect(names.map(&clean_name)).to eq clean
    end
  end
  describe 'Clearbit integration' do
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

    describe '#company_info' do
      it 'retrieves information for an existing company' do
        company = 'United Airlines'
        @api.fetch_domains()
        @api.enrich_domains()
        info = @api.company_info(company)

        expect(info).to be_truthy
        # Just test for few attributes present
        %i[id name domain description logo].each { |key| expect(info).to have_key(key) }
      end
    end
  end
end
