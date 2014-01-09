puts "Menu creating..."

Menu.setup domain, :Barcode, {:rank => 1000} do
  submenu :Master, {:rank => 1100, :menu_type => 'SEPARATOR'}
  submenu :Trade, {:rank => 1200, :template => 'Bar.view.trade.Trade'}
  submenu :Baseloc, {:rank => 1300, :template => 'Bar.view.baseloc.Baseloc'}
  submenu :Loc, {:rank => 1400, :template => 'Bar.view.loc.Loc'}
end

puts "Menu created"