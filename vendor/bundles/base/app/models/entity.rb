class Entity < ActiveRecord::Base

    stampable
    meaningful_id [:domain_id, :name]
    belongs_to :domain
    has_many :entity_columns, :order => 'display_rank asc', :dependent => :destroy
    attr_accessible :name,:description,:bundle

    # create_entity_columns for loaded resource's columns
    def create_entity_columns
      entity = self.name.constantize
      pkcolumn = entity.primary_key
      entity.reset_column_information
      entity.columns.each_with_index do |column, i|
        f = self.entity_columns.detect{|col| col.name == column.name}
        unless f
          f = self.entity_columns.build(:name => column.name)
          f.pk = true if(pkcolumn == column.name)
          f.column_type = column.type.to_s
          f.display_rank = i * 10        
          association = entity.reflect_on_all_associations(:belongs_to).detect{|a| a.options[:foreign_key] == column.name }
          association ||= entity.reflect_on_association column.name.sub(/_id$/, '').to_sym if column.name.ends_with? '_id'
          if association
            f.ref_type = 'Entity'
            f.ref_name = association.options[:polymorphic] ? 'POLYMORPHIC' : association.class_name
          end
          f.save!
        end
      end
      return self.entity_columns
    end
    
    def list_columns
      self.entity_columns.select{|f| f.list_rank && f.list_rank > 0 }.sort_by(&:list_rank)
    end

    def search_columns
      self.entity_columns.select{|f| f.search_rank && f.search_rank > 0 }.sort_by(&:search_rank)
    end

    def sort_columns
      self.entity_columns.select{|f| f.sort_rank && f.sort_rank > 0 }.sort_by(&:sort_rank)
    end

    def reverse_sort_columns
      self.entity_columns.select{|f| f.reverse_sort }
    end
    
    def editable_columns
      self.entity_columns.select{|f| f.editable }
    end
    
    def self.setup(domain, entity_class, options={}, &block)
      entity = domain.entities.find_by_name(entity_class.to_s)
      entity ||= domain.entities.create(options.merge({:name => entity_class.to_s}))

      setup_helper = SetupHelper.new(entity)
      setup_helper.instance_eval &block if block_given?
      setup_helper.ending

      entity.create_entity_columns
      setup_helper.columns.each do |c|
        column = entity.entity_columns.detect{|ec| ec.name == c[:name].to_s}
        next unless column

        c.each do |key, value|
          case key
          when :editable
            column.editable = value
          when :search_rank
            column.search_rank = value
          when :list_rank
            column.list_rank = value
          when :sort_rank
            column.sort_rank = value
          when :reverse_sort
            column.reverse_sort = value
          when :code
            column.ref_type = 'CommonCode'
            column.ref_name = value.to_s
          when :resource
            column.ref_type = 'Resource'
            column.ref_name = value.to_s
          end
        end

        column.save
      end

      entity.save
      entity
    end
    
    # setup helper
    class SetupHelper
      attr_accessor :list_columns, :search_columns, :sort_columns, :reverse_sort_columns, :editable_columns, :columns

      def initialize(entity)
        @entity = entity
        @columns = []
        @list_columns = []
        @search_columns = []
        @sort_columns = []
        @reverse_columns = []
        @editable_columns = []
      end

      def ending
        if @list_columns && !@list_columns.empty?
          @entity.list_columns.each{|h| h.list_rank = 0}
          @list_columns.each_with_index do |column, i|
            @columns << {:name => column, :list_rank => ((i + 1) * 10)}
          end
        end

        if @search_columns && !@search_columns.empty?
          @entity.search_columns.each{|h| h.search_rank = 0}
          @search_columns.each_with_index do |column, i|
            @columns << {:name => column, :search_rank => ((i + 1) * 10)}
          end
        end

        if @sort_columns && !@sort_columns.empty?
          @entity.sort_columns.each{|h| h.sort_rank = 0}
          @sort_columns.each_with_index do |column, i|
            @columns << {:name => column, :sort_rank => ((i + 1) * 10)}
          end
        end

        if @reverse_sort_columns && !@reverse_sort_columns.empty?
          @entity.reverse_sort_columns.each{|h| h.reverse_sort = false}
          @reverse_sort_columns.each_with_index do |column, i|
            @columns << {:name => column, :reverse_sort => true}
          end
        end
        
        if @editable_columns && !@editable_columns.empty?
          @entity.editable_columns.each{|h| h.editable = false}
          @editable_columns.each_with_index do |column, i|
            @columns << {:name => column, :editable => true}
          end
        end
      end

      def column(column_name, options={})
        @columns << options.merge({:name => column_name})
      end
    end
end
