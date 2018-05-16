require 'pry'
require 'plaid'
require 'clearbit'
require 'logger'

# Handler of the app logic
LOG = Logger.new(STDOUT)
class API
  attr_reader :public_token, :access_token, :domains

  def initialize(plaid_credentials:, clearbit_key:)
    @public_token = ''
    @access_token = ''
    @transactions = []
    @domains      = {}

    Clearbit.key = clearbit_key

    client_id, secret, public_key = plaid_credentials.values_at('client_id', 'secret', 'public_key')
    @plaid = Plaid::Client.new(env: :sandbox, client_id: client_id,
                               secret: secret, public_key: public_key)
  end

  def transactions
    @transactions = @plaid.transactions.get(@access_token, 6.months.ago, Date.today)
    binding.pry
    @transactions
  end

  def generate_access_token(public_token)
    @public_token     = public_token
    exchange_response = @plaid.item.public_token.exchange(@public_token)
    @access_token     = exchange_response.access_token
    puts "access token: #{@access_token}"
    exchange_response
  end

  def logged_in?
    !@access_token.empty?
  end

  def fetch_domains(companies)
    companies ||= @transactions.map(&name)
    query = companies.uniq # to avoid repeated queries
    query = @domains.keys - query # cache, only retrieve new companies
    @domains = query.map { |name| [name, Clearbit::NameDomain.find(name: name)] }.to_h
  end

  private

  def process_transactions
    # Name to domains
    # Clearbit.NameDomain.
    # Then, use Enrich AP
  end
end
