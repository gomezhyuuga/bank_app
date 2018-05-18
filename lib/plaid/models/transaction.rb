module Plaid
  module Models
    # Monkey patch to include the recurring attr
    # Plaid appers to be using hashie
    class Transaction
      property :recurring
    end
  end
end
