# ActionMailer::Base.smtp_settings = {
#  :address              => "smtp.gmail.com",
#  :port                 => "587",
#  :domain               => "mail.gmail.com",
#  :user_name            => "glorys220",
#  :password             => "Qkrwjdduf1",
#  :authentication       => "plain",
#  :enable_starttls_auto => true
# }

ActionMailer::Base.smtp_settings = {
 :address              => "218.24.159.60",
 :port                 => "25",
 :user_name            => "MES-ADMIN",
 :password             => "123456",
 :authentication       => "login",
 :enable_starttls_auto => false
}

ActionMailer::Base.raise_delivery_errors = true
ActionMailer::Base.default_url_options[:host] = "localhost:3000"