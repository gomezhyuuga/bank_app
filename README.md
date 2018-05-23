# Bank Account Transactions

![Thumbnail](https://raw.githubusercontent.com/gomezhyuuga/bank_app/master/thumbnail.png)

[React 16][react] & [Sinatra][sinatra] application to list bank transactions using
[Plaid][plaid] as account provider.

[https://gh-bankapp.herokuapp.com/]()

It connects to the Plaid service to gather bank transactions and then
uses [Clearbit's Enrich API][clearbit] to fetch more information about the company
who charged the transaction.

# Instructions
1. Clone it:

```
git clone git@github.com:gomezhyuuga/bank_app.git
```

2. Run application with:


```
rackup -p 4567
```

3. Access to it: http://localhost:4567/


# Development
## Run server:

```
rackup -p 4567
```

## Run client (dev):

```
cd client; yarn start
```

Access to the client using: http://localhost:3000

## To create the build version for deployment, run:

```
cd client; yarn build
```

## Unit testing

__[RSpec][rspec]__ test suite for `api.rb`:

```
➜  bank_app git:(master) bundle exec rspec spec/api_spec.rb
Finished in 8.87 seconds (files took 1.47 seconds to load)
17 examples, 0 failures
```

## Integration testing

__[Capybara][capybara]__  to test basic UI functionality:

```
➜  bank_app git:(master) ✗ bundle exec rspec spec/integration_spec.rb
Finished in 49.96 seconds (files took 1.24 seconds to load)
5 examples, 0 failures
```

[clearbit]: https://clearbit.com/
[capybara]: http://teamcapybara.github.io/capybara/
[rspec]: http://rspec.info/
[plaid]: https://plaid.com/
[react]: https://reactjs.org/
[sinatra]: http://sinatrarb.com/
