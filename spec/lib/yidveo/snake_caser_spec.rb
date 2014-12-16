require 'rails_helper'
require 'yidveo/snake_caser'

describe 'snake_caser' do

  describe 'properly snakecases the following variations' do

    it { expect(Yidveo::SnakeCaser.new('someThing').call).to eq('some_thing') }
    it { expect(Yidveo::SnakeCaser.new('SomeThing').call).to eq('some_thing') }
    it { expect(Yidveo::SnakeCaser.new('something').call).to eq('something') }
    it { expect(Yidveo::SnakeCaser.new('Some_Thing').call).to eq('some_thing') }
    it { expect(Yidveo::SnakeCaser.new('Something').call).to eq('something') }

  end
end
