ENV['RACK_ENV'] = 'test'

require_relative '../app'

Capybara.configure do |config|
  config.app_host = 'localhost:3000'
  config.app = App
  config.default_driver = :selenium_chrome
  config.server_port = 4567
end

describe '/', type: :feature do
  before :each do
    visit '/'
  end
  context 'when not logged in' do
    it 'asks to login' do
      expect(page).to have_content 'You must login'
      expect(page).not_to have_selector('#transaction_list')
    end
  end
  context 'when logged in' do
    before :each do
      visit '/'
      click_on('Select your bank')
      within_frame('plaid-link-iframe-1') do
        find('.InstitutionSelectPaneButton:first-child').click
        fill_in 'username', with: 'user_good'
        fill_in 'password', with: 'pass_good'
        click_button 'Submit'

        expect(find('#plaid-link-container')).to have_content('Your account has been successfully linked', wait: 20)
        click_button 'Continue'
      end
    end
    it 'do not ask for login' do
      expect(page).not_to have_content 'You must login', wait: 10
    end
    it 'shows the list of transactions' do
      expect(page).to have_content 'Loading transactions...'
      expect(page).to have_content 'Transactions', wait: 30
      expect(page).to have_selector '.timeline-item'
    end
    it 'shows related information' do
      find('.timeline-item', match: :first, wait: 30).click
      expect(page).to have_selector '#transaction_details'
      expect(page).to have_selector '#company_details'
    end
    it 'is able to load more transactions' do
      page.assert_selector('.timeline-item', visible: false, count: 10, wait: 40)
      click_button 'Load more'
      page.assert_selector('.timeline-item', visible: false, count: 20, wait: 40)
      click_button 'Load more'
      page.assert_selector('.timeline-item', visible: false, count: 30, wait: 40)
    end
  end
end
