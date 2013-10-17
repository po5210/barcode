class Attachment < ActiveRecord::Base
  attr_accessible :path, :name, :file_group_id
  
  stampable
  universal_unique_id

  mount_uploader :path, FileUploader
    
  belongs_to :file_group
  
  before_create :update_asset_attributes
  
  def update_asset_attributes
    basename = File.basename(path.filename, '.*') if path
    extname = File.extname(path.filename) if path
    self.name ||=  basename + extname if path
    self.mimetype ||= Mime::Type.lookup_by_extension(extname.sub('.', '')).to_s if path
    self.file_size ||= path.file.size if path
  end
end
