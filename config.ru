require './interview_app'
require 'rack-proxy'

class AppProxy < Rack::Proxy
  def rewrite_env(env)
    env['HTTP_HOST'] = 'localhost:3000'
    env
  end
  def rewrite_response(triplet)
    _status, headers, _body = triplet
    headers["Upgrade"] = "WebSocket"
    headers["Connection"] = "Upgrade"
    triplet
  end
end

run Rack::URLMap.new(
    '/api' => InterviewApp,
    '/' => AppProxy.new
)

# run InterviewApp