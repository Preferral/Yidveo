require_dependency "yidveo/application_controller"

module Yidveo
  class ProxyRequestController < ApplicationController

    def show
      if required_param_missing
        response.content_type = 'text/javascript'

      else
        log_action
        soap_response = perform_soap_request
        respond_with_data(soap_response)
      end
    end

    private

    def perform_soap_request
      url = params[:soapServerUrl] + params[:soapServicePath]
      auth = [params[:soapServiceUsername], params[:soapServicePassword]]

      client = Savon::Client.new({ wsdl: url, basic_auth: auth, ssl_verify_mode: :none, follow_redirects: true })

      callback = params[:callback]
      action = params[:soapAction]
      body = params[:soapBody]

      if body.blank?
        vidyo_response = client.call(Yidveo::SnakeCaser.new(action).call.to_sym)
      else
        vidyo_response = client.call(Yidveo::SnakeCaser.new(action).call.to_sym, message: body)
      end

      response_we_care_about = {}
      response_we_care_about = Yidveo::YidveoSavonScrubber.new(action: action, params: vidyo_response).scrubbed
      # binding.pry
      { success: true, message: '', response: response_we_care_about }
    rescue Exception => e
      binding.pry
      # raise e
      { success: false, message: 'SOAP failure' }
    end

    def respond_with_data(soap_response)
      if params[:callback].present?
        response.content_type = 'text/javascript'
        cb = params[:callback] + '(' + soap_response.to_json + ');'
        render text: cb
      else
        response.content_type = 'application/json'
        render text: soap_response.to_json
      end
    end

    def log_action
      puts "\n\n~~~~~~~~~~~~~~~~~~"
      puts params[:soapAction] + (params[:soapBody].present? ? (' ' + params[:soapBody].to_s) : '' )
      puts "~~~~~~~~~~~~~~~~~~\n\n"
    end

    def required_param_missing
      required_params.map { |param| params[param].blank? }.include?(true)
    end


    def params_not_set
      required_params.reduce({}) do |result, param|
        result[param] = 'Not set' if params[param].blank?
        result
      end
    end

    def required_params
      @required_params ||= [
        :soapAction,
        :soapServerUrl,
        :soapServicePath,
        :soapServiceUsername,
        :soapServicePassword
      ]
    end
  end
end
