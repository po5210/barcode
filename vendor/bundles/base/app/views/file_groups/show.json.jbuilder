json.(@file_group, :id,:domain_id,:name,:description,:creator_id,:updater_id,:created_at,:updated_at)
json.attachments(@file_group.attachments) do |json, attachment|
	json.(attachment, :id,:domain_id,:name,:description, :path, :file_size, :mimetype, :creator_id, :created_at, :updater_id, :updated_at)

  	json.creator do
    	json.id attachment.creator_id
    	json.name attachment.creator ? attachment.creator.name : ''
  	end if attachment.creator
  	json.updater do
    	json.id attachment.updater_id
    	json.name attachment.updater ? attachment.updater.name : ''
  	end if attachment.updater
end
