json.(@bar_locmap, :id,:domain_id,:bar_locgrp_id,:name,:description,:loc_nmk,:loc_dc,:use_yn,:creator_id,:created_at,:updater_id,:updated_at,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:reg_ip,:mod_ip)
json.bar_locgrp do
	json.id @bar_locmap.bar_locgrp_id
	json.name @bar_locmap.bar_locgrp ? @bar_locmap.bar_locgrp.name : ''
end		
