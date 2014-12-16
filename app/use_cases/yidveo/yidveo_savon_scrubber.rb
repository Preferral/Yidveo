module Yidveo
  class YidveoSavonScrubber

    def initialize(options)
      @action = Yidveo::SnakeCaser.new(options.fetch(:action)).call
      @params = options.fetch(:params).to_hash[((@action + '_response').to_sym)].to_camelback_keys
    end

    def scrubbed
      recursively_scrub
    end

    private

    def recursively_scrub(params = @params)
      if params.class == Hash
        params.inject({}) do |hash, (k, v)|
          scrubbed = scrub_attribute(v)
          if k.to_s.downcase =~ /(id|Id|ID)\b/
            new_key = k.to_s.gsub(/(id|Id|ID)\b/, 'ID').to_sym
            hash[new_key] = scrubbed
          elsif k.to_s.downcase == 'entity'
            hash[:Entity] = scrubbed
          elsif Yidveo::SnakeCaser.new(k.to_s).call == 'room_mode'
            hash[:RoomMode] = scrubbed
          else
            hash[k] = scrubbed
          end
          hash
        end
      else
        params
      end
    end

    def scrub_attribute(attr)
      if attr.class == Array
        attr.map { |nested_param| recursively_scrub(nested_param) }
      else
        recursively_scrub(attr)
      end
    end

  end
end
