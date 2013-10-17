json.(@attachment, :id, :domain_id, :name, :description, :file_size, :mimetype, :path, :creator_id, :created_at)
json.creator do
	json.id @attachment.creator_id
	json.name @attachment.creator ? @attachment.creator.name : ''
end
