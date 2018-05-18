ENV['RACK_ENV'] = 'test'

require_relative '../interview_app'

Capybara.configure do |config|
  config.app_host = 'localhost:3000'
  config.app = InterviewApp
  config.default_driver = :selenium_chrome
  config.save_path = '/Users/gomezhyuuga/'
  config.server_port = 4567
end
Capybara.save_path = '/Users/gomezhyuuga/'

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
    it 'does not ask for login' do
      expect(page).not_to have_content 'You must login'
    end
    it 'shows the list of transactions' do
      expect(page).to have_content 'Transactions'
    end

    describe 'selecting a transaction' do
      it 'shows related information' do
        find('.timeline-item', match: :first).click
        expect(page).to have_selector '#transaction_details'
        expect(page).to have_selector '#company_details'
      end
    end
    describe 'requesting more transactions' do
      it 'loads the correct amount of transactions' do
        expect(all('.timeline-item').length).to eq 10
      end
    end
  end
end
