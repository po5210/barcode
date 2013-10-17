# migration id type 바꾸기. integer => string
Object.class_eval do
  def meaningful keys, separator = '-'
    keys.collect{|key| key.class == Symbol ? self.send(key) : key}.join(separator || '-')
  end
end

# userstamp 명세 변경하기.
module Hatio
  module MigrationHelper
    module Userstamp
      def self.included(base) # :nodoc:
        base.send(:include, InstanceMethods)
      end

      module InstanceMethods
        def userstamps(include_deleted_by = false)
          column(:creator_id, :string, :limit => 16)
          column(:updater_id, :string, :limit => 16)
          column(:deleter_id, :string, :limit => 16) if include_deleted_by
        end        
      end
    end
  end
end

ActiveRecord::ConnectionAdapters::TableDefinition.send(:include, Hatio::MigrationHelper::Userstamp)

ActiveRecord::ConnectionAdapters::TableDefinition.class_eval do
  # def primary_key(name)
  #   # column(name, :string, :limit => 48)
  #   string(name, :limit => 36, :primary_key => true)
  # end
  
  def references(*args)
    options = args.extract_options!
    options[:limit] ||= 64
    polymorphic = options.delete(:polymorphic)
    args.each do |col|
      column("#{col}_id", :string, options)
      column("#{col}_type", :string, polymorphic.is_a?(Hash) ? polymorphic.merge({:limit => 64}) : options) unless polymorphic.nil?
    end
  end      
end

ActiveRecord::ConnectionAdapters::Table.class_eval do
  def references(*args)
    options = args.extract_options!
    options[:limit] ||= 64
    polymorphic = options.delete(:polymorphic)
    args.each do |col|
      column("#{col}_id", :string, options)
      column("#{col}_type", :string, polymorphic.is_a?(Hash) ? polymorphic.merge({:limit => 64}) : options) unless polymorphic.nil?
    end
  end      
end

module ActiveRecord
  module ConnectionAdapters # :nodoc:
    module SchemaStatements
      def create_table(table_name, options = {})
        table_definition = TableDefinition.new(self)
        table_definition.primary_key(options[:primary_key] || Base.get_primary_key(table_name.to_s.singularize)) unless options[:id] == false || options[:id] == :meaningful || options[:id] == :uuid

        yield table_definition

        if options[:force] && table_exists?(table_name)
          drop_table(table_name, options)
        end

        create_sql = "CREATE#{' TEMPORARY' if options[:temporary]} TABLE "
        create_sql << "#{quote_table_name(table_name)} ("
        create_sql << "id varchar(#{options[:id_limit] || 64}) NOT NULL PRIMARY KEY, " if options[:id] == :meaningful || options[:id] == :uuid
        create_sql << table_definition.to_sql
        create_sql << ") #{options[:options]}"
        execute create_sql
      end
    end
  end
  
  class SchemaDumper #:nodoc:
    def table(table, stream)
      columns = @connection.columns(table)
      begin
        tbl = StringIO.new

        # first dump primary key column
        if @connection.respond_to?(:pk_and_sequence_for)
          pk, _ = @connection.pk_and_sequence_for(table)
        elsif @connection.respond_to?(:primary_key)
          pk = @connection.primary_key(table)
        end

        tbl.print "  create_table #{remove_prefix_and_suffix(table).inspect}"
        if columns.detect { |c| c.name == pk }
          if pk != 'id'
            tbl.print %Q(, :primary_key => "#{pk}")
          # TODO modify
          else
            tbl.print ", :id => :uuid"
          end
        else
          tbl.print ", :id => false"
        end
        tbl.print ", :force => true"
        tbl.puts " do |t|"

        # then dump all non-primary key columns
        column_specs = columns.map do |column|
          raise StandardError, "Unknown type '#{column.sql_type}' for column '#{column.name}'" if @types[column.type].nil?
          next if column.name == pk
          spec = {}
          spec[:name]      = column.name.inspect

          # AR has an optimization which handles zero-scale decimals as integers. This
          # code ensures that the dumper still dumps the column as a decimal.
          spec[:type]      = if column.type == :integer && [/^numeric/, /^decimal/].any? { |e| e.match(column.sql_type) }
                               'decimal'
                             else
                               column.type.to_s
                             end
          spec[:limit]     = column.limit.inspect if column.limit != @types[column.type][:limit] && spec[:type] != 'decimal'
          spec[:precision] = column.precision.inspect if column.precision
          spec[:scale]     = column.scale.inspect if column.scale
          spec[:null]      = 'false' unless column.null
          spec[:default]   = default_string(column.default) if column.has_default?
          (spec.keys - [:name, :type]).each{ |k| spec[k].insert(0, "#{k.inspect} => ")}
          spec
        end.compact

        # find all migration keys used in this table
        keys = [:name, :limit, :precision, :scale, :default, :null] & column_specs.map{ |k| k.keys }.flatten

        # figure out the lengths for each column based on above keys
        lengths = keys.map{ |key| column_specs.map{ |spec| spec[key] ? spec[key].length + 2 : 0 }.max }

        # the string we're going to sprintf our values against, with standardized column widths
        format_string = lengths.map{ |len| "%-#{len}s" }

        # find the max length for the 'type' column, which is special
        type_length = column_specs.map{ |column| column[:type].length }.max

        # add column type definition to our format string
        format_string.unshift "    t.%-#{type_length}s "

        format_string *= ''

        column_specs.each do |colspec|
          values = keys.zip(lengths).map{ |key, len| colspec.key?(key) ? colspec[key] + ", " : " " * len }
          values.unshift colspec[:type]
          tbl.print((format_string % values).gsub(/,\s*$/, ''))
          tbl.puts
        end

        tbl.puts "  end"
        tbl.puts

        indexes(table, tbl)

        tbl.rewind
        stream.print tbl.read
      rescue => e
        stream.puts "# Could not dump table #{table.inspect} because of following #{e.class}"
        stream.puts "#   #{e.message}"
        stream.puts
      end

      stream
    end
  end
end

# oracle default primary key number --> varchar2(64)
if RUBY_PLATFORM =~ /java/
module ::ArJdbc
  module Oracle
    def create_table(table_name, options = {})
      puts "oracel patch"
      table_definition = TableDefinition.new(self)
      table_definition.primary_key(options[:primary_key] || Base.get_primary_key(table_name.to_s.singularize)) unless options[:id] == false || options[:id] == :meaningful || options[:id] == :uuid

      yield table_definition

      if options[:force] && table_exists?(table_name)
        drop_table(table_name, options)
      end

      create_sql = "CREATE#{' TEMPORARY' if options[:temporary]} TABLE "
      create_sql << "#{quote_table_name(table_name)} ("
      create_sql << "id varchar(#{options[:id_limit] || 64}) NOT NULL PRIMARY KEY, " if options[:id] == :meaningful || options[:id] == :uuid
      create_sql << table_definition.to_sql
      create_sql << ") #{options[:options]}"
      execute create_sql
    end
  end
end
end