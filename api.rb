require 'pry'
require 'plaid'
require 'clearbit'
require 'logger'

LOG = Logger.new(STDOUT)

# Handler of the app logic
class API
  attr_reader :public_token, :access_token
  attr_accessor :domains, :companies
  attr_writer :transactions

  def initialize(plaid_credentials:, clearbit_key:)
    @public_token = ''
    @access_token = ''
    @transactions = []
    @domains      = {}
    @companies    = {}

    Clearbit.key = clearbit_key

    client_id, secret, public_key = plaid_credentials.values_at('client_id', 'secret', 'public_key')
    @plaid = Plaid::Client.new(env: :sandbox, client_id: client_id,
                               secret: secret, public_key: public_key)
  end

  def transactions
    @transactions = @plaid.transactions.get(@access_token, 6.months.ago, Date.today)
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

  def fetch_domains(companies = [])
    extract_name = ->(x) { x['name'].gsub(/[^A-Za-z\s]/, '') }
    companies = @transactions.map(&extract_name) unless @transactions.empty?

    query = companies.uniq # to avoid repeated queries
    query -= @domains.keys # cache, only retrieve new companies
    LOG.debug("Fetching info for #{query.length} companies")
    @domains.merge!(query.map { |name| [name, domain_lookup(name)] }.to_h)
    LOG.debug(@domains)
    @domains
  end

  def enrich_domains
    return {} if @domains.empty?

    query = @domains.keys - @companies.keys # only new domains
    LOG.debug("Enrich for #{query.length} companies...")
    response = query.map { |name| enrich(name, @domains[name]) }
    @companies.merge!(response.map { |x| [x[:company], x[:info]] }.to_h)
    LOG.debug("#{@companies.length} companies enriched!")
    @companies
  end

  private

  def domain_lookup(company)
    Clearbit::NameDomain.find(name: company)
  end

  def enrich(company, domain_info)
    return { company: company, info: nil } unless domain_info

    domain = domain_info['domain']
    name   = domain_info['name']
    info   = Clearbit::Enrichment::Company.find(domain: domain, company_name: name)

    { company: company, info: info }
  end
end
