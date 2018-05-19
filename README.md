# Clearbit Interview Project

Application made as part of the interview process at [Clearbit][clearbit].

[https://clearbit-gh.herokuapp.com/]()

It connects to the Plaid service to gather bank transactions and then
uses Clearbit's Enrich API to fetch more information about the company
who charged the transaction.

# Run server:

```
rackup -p 4567
```

# Run client (dev):

```
cd client; yarn start
```

# Unit testing

__[RSpec][rspec]__ test suite for `api.rb`:

```
➜  clearbit_interview git:(master) bundle exec rspec spec/api_spec.rb
Finished in 8.87 seconds (files took 1.47 seconds to load)
17 examples, 0 failures
```

# Integration testing

__[Capybara][capybara]__  to test basic UI functionality:

```
➜  clearbit_interview git:(master) ✗ bundle exec rspec spec/integration_spec.rb
Finished in 49.96 seconds (files took 1.24 seconds to load)
5 examples, 0 failures
```

[clearbit]: https://clearbit.com/
[capybara]: http://teamcapybara.github.io/capybara/
[rspec]: http://rspec.info/
