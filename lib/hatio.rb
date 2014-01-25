require "hatio/version"

$HATIO_ROOT = File.join(File.dirname(__FILE__), '..')

require 'hatio/pluggable/pluggable_spot'
require 'hatio/action_controller/search_helper'
require 'hatio/patch/string_key'
require 'hatio/patch/activerecord_hatio_patch'
require 'hatio/patch/actionpack_hatio_patch'
require 'hatio/patch/date'
require 'hatio/active_record/stringified_id'
require 'hatio/active_record/userstamp'
require 'hatio/active_record/acts_as_import'
require 'hatio/util/hatio_util'
require 'hatio/bundle/hatio_bundle'
require 'hatio/exception/exceptions'

include Hatio::Util::HatioUtil

ActiveRecord::Base.send :include, Hatio::StringfiedID
ActiveRecord::Base.send :include, Hatio::Userstamp
ActiveRecord::Base.send :include, Hatio::ActsAsImport

ActionController::Base.send :include, Hatio::SearchHelper

debug_print "Hatio Loaded!"