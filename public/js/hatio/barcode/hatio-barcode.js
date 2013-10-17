var barcodeImage;
var stage;
var layer;
var addLalyer;
var rulerLayer;
var horRulerBox;
var horRulerPoint;
var horRulerContent;
var verRulerBox;
var verRulerPoint;
var verRulerContent;
var contentBox;
var backBox;
var stageDown = false;
var stageDownX;
var stageDownY;
var shapeDownX;
var shapeDownY;
var sectionBox;
var resizeMode = false;
var addShapeMode = false;
var addShapeBox;
var addShapeHorLine;
var addShapeVerLine;
var addShapeStartText;
var addShapeEndText;
var addShapeType;
var mmPixel = 3.779527559;
var currentModelerData;
var currentShapes = [];

function editorLoad(){
	$(document).keydown(function(event) {
//	  	if(event.keyCode==8 && currentShapes.length>0){
//	  		removeShape()
//	  		return false;
//	  	}
	  	if(event.keyCode==27 && addShapeMode){
	  		addShapeCancel();
	  		return false;
	  	}
    });
    $(document).mouseup(function() {
  	  	makeShapeOrSelection();
	});
	$(window).resize(function() {
		containerReizeHanler();
	});
	stageLoad();
	propertyRender();
}

function containerReizeHanler(){
	var diffX = ($('#container').width() - stage.getWidth())/2;
	var diffY = ($('#container').height() - stage.getHeight())/2;
	if(diffX<0){
		diffX = Math.sqrt(Math.pow(diffX,2)) * -1;
	}else{
		diffX = Math.sqrt(Math.pow(diffX,2));
	}
	if(diffY<0){
		diffY = Math.sqrt(Math.pow(diffY,2)) * -1;
	}else{
		diffY = Math.sqrt(Math.pow(diffY,2));
	}
	stage.setWidth($('#container').width());
	stage.setHeight($('#container').height());
	var arr = stage.getChildren();
    layer = arr[0];
    
    var children = layer.getChildren();
  	for(var i=0; i<children.length; i++){
  		if(i==0){
  			backBox = children[i];
  			backBox.setWidth($('#container').width());
			backBox.setHeight($('#container').height());
  		}else if(i==1){
  			contentBox = children[i];
  			contentBox.setX(contentBox.getX() + diffX);
  			contentBox.setY(contentBox.getY() + diffY);
  		}else{
  			var group = children[i];
  			group.setX(group.getX() + diffX);
  			group.setY(group.getY() + diffY);
  		}
  	}
  	
	makeRuler();
	stage.draw();
}

function stageLoad(modelerData){
	currentModelerData = modelerData;
	if(!modelerData){
		 stage = new Kinetic.Stage({
	        container: 'container',
	        width: $('#container').width(),
	        height: $('#container').height(),
	        id:'ashStage'
	      });
	      layer = new Kinetic.Layer({id:'contentLayer'});
	      backBox = new Kinetic.Rect({
	            width: $('#container').width(),
	        	height: $('#container').height(),
	            fill: '#cccccc',
	            stroke: '#cccccc',
	            strokeWidth: 0,
	            name: 'back',
	            draggable: false
	          });
	   	  layer.add(backBox);
	   	  
	      contentBox = new Kinetic.Rect({
	            width: 120*mmPixel,
	            height: 80*mmPixel,
	            fill: '#ffffff',
	            stroke: '#000000',
	            strokeWidth: 0.78,
	            dashArray: [6, 6],
	            name: 'contentBox',
	            draggable: false
	          });
	      contentBox.setX(stage.getWidth()/2-contentBox.getWidth()/2);
	      contentBox.setY(stage.getHeight()/2-contentBox.getHeight()/2);
	      contentBox.attrs.barcodeMeta = {
				dpi : 200,
				labelWidth : pixelValueTomm(contentBox.getWidth()),
				labelHeight : pixelValueTomm(contentBox.getHeight()),
				rotated : true
		  }  
	   	  layer.add(contentBox);
	   	  stage.add(layer);
   	}else{
   		try{
			stage.remove();
			stage = null;
			delete stage;
		}catch(e){}
		
		$('#container').html('');
		stage = Kinetic.Node.create(modelerData, 'container');
		var diffX = ($('#container').width() - stage.getWidth())/2;
		var diffY = ($('#container').height() - stage.getHeight())/2;
		if(diffX<0){
			diffX = Math.sqrt(Math.pow(diffX,2)) * -1;
		}else{
			diffX = Math.sqrt(Math.pow(diffX,2));
		}
		if(diffY<0){
			diffY = Math.sqrt(Math.pow(diffY,2)) * -1;
		}else{
			diffY = Math.sqrt(Math.pow(diffY,2));
		}
		stage.setWidth($('#container').width());
		stage.setHeight($('#container').height());
	    var arr = stage.getChildren();
	    layer = arr[0];
	    
	    var children = layer.getChildren();
	  	for(var i=0; i<children.length; i++){
	  		if(i==0){
	  			backBox = children[i];
	  			backBox.setWidth($('#container').width());
				backBox.setHeight($('#container').height());
	  		}else if(i==1){
	  			contentBox = children[i];
	  			contentBox.setX(contentBox.getX() + diffX);
	  			contentBox.setY(contentBox.getY() + diffY);
	  		}else{
	  			var group = children[i];
	  			group.setX(group.getX() + diffX);
	  			group.setY(group.getY() + diffY);
	  			if(group.get(".hatioShape")[0] instanceof Kinetic.Image){
	  				var img = group.get(".hatioShape")[0];
		  			addBarcodeShape(img.attrs.imgData, group.attrs.barcodeMeta, group, img);	
	  			}else{
	  				regEventsHatioGroup(group);
	  			}
	  		}
	  	}
	  	unSelectHatioShapes();
	  	propertyRender();
   	}
   	makeRuler();
   	addLalyer = new Kinetic.Layer({id:'addLayer'});
   	stage.add(addLalyer);
      
	  stage.on('mousedown', function(evt){
	  	unSelectHatioShapes();
	  	if(!resizeMode && !addShapeMode){
	  		try{
		  		addShapeBox.remove();
		  		addShapeHorLine.remove();
		  		addShapeVerLine.remove();
		  		addShapeStartText.remove();
		  		addShapeEndText.remove();
		  		addShapeBox = null;
		  		addShapeHorLine = null;
		  		addShapeVerLine = null;
		  		addShapeStartText = null;
		  		addShapeEndText = null;
		  		delete addShapeBox;
		  		delete addShapeHorLine;
		  		delete addShapeVerLine;
		  		delete addShapeStartText;
		  		delete addShapeEndText;
		  		sectionBox.remove();
				sectionBox = null;
				delete sectionBox;
	  		}catch(e){}
	  		stageDownX = evt.layerX;
	      	stageDownY = evt.layerY;
	      	sectionBox = new Kinetic.Rect({
	            width: 0,
	            height: 0,
	            fill: '#E1C2C2',
	            stroke: '#B36666',
	            strokeWidth: 0,
	            opacity: 0.3,
	            id: 'selectionRec'
	          });
	        sectionBox.setX(stageDownX);
	        sectionBox.setY(stageDownY);
	        layer.add(sectionBox);
	        layer.draw();
	        addLalyer.draw();
	      	stageDown = true;
	  	}else if(!resizeMode && addShapeMode){
	  		stageDownX = evt.layerX-2;
	      	stageDownY = evt.layerY-2;
	      	addShapeBox = new Kinetic.Rect({
	            width: 0,
	            height: 0,
	            fill: '#E6F2F7',
	            stroke: '#1B9EE0',
	            strokeWidth: 1,
	            opacity: 0.5,
	            id: 'selectionRec'
	          });
	        addShapeBox.setX(stageDownX);
	        addShapeBox.setY(stageDownY);
	        addLalyer.add(addShapeBox);
	        
	        addShapeStartText = new Kinetic.Text({
	        	x:stageDownX-24,
	        	y:stageDownY-14,
		        text: '(' + pixelTomm(stageDownX, 'x') + ", " + pixelTomm(stageDownY, 'y') + ")",
		        fontSize: 12,
		        fontFamily: 'Calibri',
		        fill: '#0000ff',
		        opacity: 0.7,
		        draggable: false
		    });
		    addLalyer.add(addShapeStartText);
	        
		    addShapeEndText = new Kinetic.Text({
		        fontSize: 12,
		        fontFamily: 'Calibri',
		        fill: '#ff0000',
		        opacity: 0.7,
		        draggable: false,
		        visible:false
		    });
		    addLalyer.add(addShapeEndText);
		    
	        addLalyer.draw();
	      	stageDown = true;
	  	}
	  });
  	  
  	  stage.on('mousemove', function(evt){
  	  	if(!stageDown && addShapeMode){
  	  		horRulerPoint.setPosition(evt.layerX-2, 0);
  	  		verRulerPoint.setPosition(0, evt.layerY-2);
  	  	}else{
  	  		horRulerPoint.setPosition(evt.layerX, 0);
  	  		verRulerPoint.setPosition(0, evt.layerY);
  	  	}
  	  	rulerLayer.draw();
  	  	if(stageDown && !addShapeMode){
  	  		var dx = evt.layerX-stageDownX;
  	  		var dy = evt.layerY-stageDownY;
  	  		sectionBox.setWidth(dx);
            sectionBox.setHeight(dy);
            if(sectionBox.getWidth()<0){
            	sectionBox.setWidth(Math.abs(dx));
            	sectionBox.setX(stageDownX + dx);
            }else{
            	sectionBox.setX(stageDownX);
            }
            if(sectionBox.getHeight()<0){
            	sectionBox.setHeight(Math.abs(dy));
            	sectionBox.setY(stageDownY + dy);
            }else{
            	sectionBox.setY(stageDownY);
            }
  	  		layer.draw();
  	  	}if(stageDown && addShapeMode){
  	  		var dx = evt.layerX-stageDownX;
  	  		var dy = evt.layerY-stageDownY;
  	  		if(addShapeType=='HorzLine'){
  	  			dy = 1;
  	  		}
  	  		if(addShapeType=='VertLine'){
  	  			dx = 1;
  	  		}
  	  		addShapeBox.setWidth(dx);
            addShapeBox.setHeight(dy);
            if(addShapeBox.getWidth()<0){
            	addShapeBox.setWidth(Math.abs(dx));
            	addShapeBox.setX(stageDownX + dx);
            }else{
            	addShapeBox.setX(stageDownX);
            }
            if(addShapeBox.getHeight()<0){
            	addShapeBox.setHeight(Math.abs(dy));
            	addShapeBox.setY(stageDownY + dy);
            }else{
            	addShapeBox.setY(stageDownY);
            }
            
            addShapeHorLine.setPoints([0, addShapeBox.getY()+addShapeBox.getHeight(), addShapeBox.getX(), addShapeBox.getY()+addShapeBox.getHeight()]);
            addShapeVerLine.setPoints([addShapeBox.getX()+addShapeBox.getWidth(), 0, addShapeBox.getX()+addShapeBox.getWidth(), addShapeBox.getY()]);
            
            addShapeEndText.setVisible(true);
            addShapeEndText.setPosition(evt.layerX-14, evt.layerY+7)
            addShapeEndText.setText('(' + pixelTomm(evt.layerX, 'x') + ', ' + pixelTomm(evt.layerY, 'y') + ')');
  	  		addLalyer.draw();
  	  	}else if(!stageDown && addShapeMode){
  	  		try{
		  		addShapeBox.remove();
		  		addShapeHorLine.remove();
		  		addShapeVerLine.remove();
		  		addShapeStartText.remove();
		  		addShapeEndText.remove();
		  		addShapeBox = null;
		  		addShapeHorLine = null;
		  		addShapeVerLine = null;
		  		addShapeStartText = null;
		  		addShapeEndText = null;
		  		delete addShapeBox;
		  		delete addShapeHorLine;
		  		delete addShapeVerLine;
		  		delete addShapeStartText;
		  		delete addShapeEndText;
		  		sectionBox.remove();
				sectionBox = null;
				delete sectionBox;
	  		}catch(e){}
  	  		if(!addShapeHorLine){
  	  			addShapeHorLine = new Kinetic.Line({
			  		points: [0, 0, stage.getWidth(), 0],
			        stroke: '#1B9EE0',
			        strokeWidth: 1,
			        opacity: 1,
			        draggable: false,
			        dashArray: [6, 6]
			    });
			    addLalyer.add(addShapeHorLine);
			    
			    addShapeVerLine = new Kinetic.Line({
			  		points: [0, 0, 0, stage.getHeight()],
			        stroke: '#1B9EE0',
			        strokeWidth: 1,
			        opacity: 1,
			        draggable: false,
			        dashArray: [6, 6]
			    });
			    addLalyer.add(addShapeVerLine);
  	  		}
  	  		addShapeHorLine.setPoints([0, stage.getMousePosition().y-2, stage.getMousePosition().x-2, stage.getMousePosition().y-2]);
            addShapeVerLine.setPoints([stage.getMousePosition().x-2, 0, stage.getMousePosition().x-2, stage.getMousePosition().y-2]);
            layer.draw();
            addLalyer.draw();
  	  	}
  	  });
  	  
  	  stage.on('mouseup', function(evt){
  	  	var children = layer.getChildren();
	  	for(var i=2; i<children.length; i++){
	  		children[i].setDraggable(true);
	  	}
  	  	makeShapeOrSelection();
  	  });
}

function makeShapeOrSelection(evt){
	if(sectionBox){
  		var xMin = sectionBox.getX();
    	var yMin = sectionBox.getY();
    	var xMax = sectionBox.getWidth()+sectionBox.getX();
    	var yMax = sectionBox.getHeight()+sectionBox.getY();
    	
  		var children = layer.getChildren();
  		for(var i=0; i<children.length; i++){
  			if(children[i] instanceof Kinetic.Group){
  				var hatioShape = children[i].get(".hatioShape")[0];
				var hatioShape2 = children[i].get(".hatioShape2")[0];
				var child;
				if(hatioShape2){
					child = hatioShape2;
				}else{
					child = hatioShape;
				}
				var aPoint = child.getAbsolutePosition();
  				var centerX = aPoint.x + child.getWidth()/2;
	        	var centerY = aPoint.y + child.getHeight()/2;
	        	if(centerX>xMin && centerX<xMax && centerY>yMin && centerY<yMax){
  					selectHatioShape(children[i], false);
  				}
  			}
  		}
  		sectionBox.remove();
		sectionBox = null;
		delete sectionBox;
  		layer.draw();
  	}
  	if(addShapeBox){
  		if(addShapeBox.getWidth()!=0 && addShapeBox.getHeight()!=0){
  			switch (addShapeType) {
	  			case "BarcodeShape":
	  				//bwipRender(addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth(), addShapeBox.getHeight());
	  				barTypePopup(addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth(), addShapeBox.getHeight());
	  				break;
	  			case "RectangleShape":
	  				addRectangleShape(null, addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth(), addShapeBox.getHeight());
	  				break;
	  			case "EllipseShape":
	  				addEllipseShape(null, addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth(), addShapeBox.getHeight());
	  				break;
	  			case "HorzLine":
	  				addHorzLine(null, addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth(), addShapeBox.getHeight()+15);
	  				break;
	  			case "VertLine":
	  				addVertLine(null, addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth()+15, addShapeBox.getHeight());
	  				break;
	  			case "TextShape":
	  				addTextShape(null, addShapeBox.getX(), addShapeBox.getY(), addShapeBox.getWidth(), addShapeBox.getHeight());
	  				break;
	  		}	
  		}
  		
  		addShapeBox.remove();
  		addShapeHorLine.remove();
  		addShapeVerLine.remove();
  		addShapeStartText.remove();
  		addShapeEndText.remove();
  		addShapeBox = null;
  		addShapeHorLine = null;
  		addShapeVerLine = null;
  		addShapeStartText = null;
  		addShapeEndText = null;
  		delete addShapeBox;
  		delete addShapeHorLine;
  		delete addShapeVerLine;
  		delete addShapeStartText;
  		delete addShapeEndText;

  		layer.draw();
  		addLalyer.draw();
  	}
  	stageDown = false;
  	addShapeMode = false;
  	document.body.style.cursor = "default";
}

function addRectangleShape(group, addX, addY, addWidth, addHeight, copyGroup){
	var hatioGroup = group;
	if(!hatioGroup){
		hatioGroup = new Kinetic.Group({
	      	x: addX,
	        y: addY,
	        width: addWidth,
	        height: addHeight,
	      	draggable: true
	    });
		layer.add(hatioGroup);
		var rectangle = new Kinetic.Rect({
	        width: addWidth,
	        height: addHeight,
	        name : 'hatioShape',
	        fill: '#ffffff',
	        stroke: '#000000',
	        strokeWidth: 1,
	        draggable: false,
	        opacity: 1
	    });
	    
	    hatioGroup.add(rectangle);
	    hatioGroup.attrs.myZIndex = layer.getChildren().length-1;
	    hatioGroup.attrs.shapeType = 'RectangleShape';
	    hatioGroup.attrs.barcodeMeta = {
			horizontalScale : 1,
			verticalScale : 1,
			thickness : rectangle.getStrokeWidth(),
			cmWidth : pixelValueTomm(addWidth),
			cmHeight : pixelValueTomm(addHeight),
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0
		}
		
		if(copyGroup){
	    	rectangle.setFill(copyGroup.get(".hatioShape")[0].getFill());
	    	rectangle.setStroke(copyGroup.get(".hatioShape")[0].getStroke());
	    	rectangle.setStrokeWidth(copyGroup.get(".hatioShape")[0].getStrokeWidth());
	    	hatioGroup.setScale(copyGroup.attrs.barcodeMeta.horizontalScale, copyGroup.attrs.barcodeMeta.verticalScale)
	    	hatioGroup.rotate(copyGroup.attrs.barcodeMeta.rotation/90 * Math.PI/2);
	    	hatioGroup.attrs.barcodeMeta.horizontalScale = copyGroup.attrs.barcodeMeta.horizontalScale;
	    	hatioGroup.attrs.barcodeMeta.verticalScale = copyGroup.attrs.barcodeMeta.verticalScale;
	    	hatioGroup.attrs.barcodeMeta.thickness = rectangle.getStrokeWidth();
	    	hatioGroup.attrs.barcodeMeta.rotation = copyGroup.attrs.barcodeMeta.rotation;
	    }
	}
	regEventsHatioGroup(hatioGroup);
	selectHatioShape(hatioGroup, true);
	propertyRender(hatioGroup);
}

function addEllipseShape(group, addX, addY, addWidth, addHeight, copyGroup){
	var hatioGroup = group;
	if(!hatioGroup){
		hatioGroup = new Kinetic.Group({
	      	x: addX,
	        y: addY,
	        width: addWidth,
	        height: addHeight,
	      	draggable: true
	    });
		layer.add(hatioGroup);
		
		var rectangle = new Kinetic.Rect({
	        width: addWidth,
	        height: addHeight,
	        name : 'hatioShape',
	        fill: '#ffffff',
	        stroke: '#ffffff',
	        strokeWidth: 1,
	        opacity: 0,
	        draggable: false
	    });
	    hatioGroup.add(rectangle);
		
		var ellipse = new Kinetic.Ellipse({
			x: addWidth/2,
	        y: addHeight/2,
	        radius: {
	          x: addWidth/2,
	          y: addHeight/2
	        },
	        name : 'hatioShape2',
	        fill: '#ffffff',
	        stroke: '#000000',
	        strokeWidth: 1,
	        draggable: false
	    });
	    hatioGroup.add(ellipse);
	    hatioGroup.attrs.myZIndex = layer.getChildren().length-1;
	    hatioGroup.attrs.shapeType = 'EllipseShape';
	    hatioGroup.attrs.barcodeMeta = {
			horizontalScale : 1,
			verticalScale : 1,
			thickness : ellipse.getStrokeWidth(),
			cmWidth : pixelValueTomm(addWidth),
			cmHeight : pixelValueTomm(addHeight),
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0
		}
		
		if(copyGroup){
	    	ellipse.setFill(copyGroup.get(".hatioShape2")[0].getFill());
	    	ellipse.setStroke(copyGroup.get(".hatioShape2")[0].getStroke());
	    	ellipse.setStrokeWidth(copyGroup.get(".hatioShape2")[0].getStrokeWidth());
	    	hatioGroup.setScale(copyGroup.attrs.barcodeMeta.horizontalScale, copyGroup.attrs.barcodeMeta.verticalScale)
	    	hatioGroup.rotate(copyGroup.attrs.barcodeMeta.rotation/90 * Math.PI/2);
	    	hatioGroup.attrs.barcodeMeta.horizontalScale = copyGroup.attrs.barcodeMeta.horizontalScale;
	    	hatioGroup.attrs.barcodeMeta.verticalScale = copyGroup.attrs.barcodeMeta.verticalScale;
	    	hatioGroup.attrs.barcodeMeta.thickness = ellipse.getStrokeWidth();
	    	hatioGroup.attrs.barcodeMeta.rotation = copyGroup.attrs.barcodeMeta.rotation;
	    }
	}
	regEventsHatioGroup(hatioGroup);
	selectHatioShape(hatioGroup, true);
	propertyRender(hatioGroup);
}

function addHorzLine(group, addX, addY, addWidth, addHeight, copyGroup){
	var hatioGroup = group;
	if(!hatioGroup){
		hatioGroup = new Kinetic.Group({
	      	x: addX,
	        y: addY,
	        width: addWidth,
	        height: addHeight,
	      	draggable: true
	    });
		layer.add(hatioGroup);
		
		var rectangle = new Kinetic.Rect({
	        width: addWidth,
	        height: addHeight,
	        name : 'hatioShape',
	        fill: '#ffffff',
	        stroke: '#ffffff',
	        strokeWidth: 1,
	        opacity: 0,
	        draggable: false
	    });
	    hatioGroup.add(rectangle);
	    
		var line = new Kinetic.Line({
	  		points: [0, 0, addWidth, 0],
	        name : 'hatioShape2',
	        stroke: '#000000',
	        strokeWidth: 1,
	        draggable: false
	    });
	    hatioGroup.add(line);
	    hatioGroup.attrs.myZIndex = layer.getChildren().length-1;
	    hatioGroup.attrs.shapeType = 'HorzLine';
	    hatioGroup.attrs.barcodeMeta = {
			horizontalScale : 1,
			verticalScale : 1,
			thickness : line.getStrokeWidth(),
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0
		}
		
		if(copyGroup){
	    	line.setStrokeWidth(copyGroup.get(".hatioShape2")[0].getStrokeWidth());
	    	hatioGroup.setScale(copyGroup.attrs.barcodeMeta.horizontalScale, copyGroup.attrs.barcodeMeta.verticalScale)
	    	hatioGroup.rotate(copyGroup.attrs.barcodeMeta.rotation/90 * Math.PI/2);
	    	hatioGroup.attrs.barcodeMeta.horizontalScale = copyGroup.attrs.barcodeMeta.horizontalScale;
	    	hatioGroup.attrs.barcodeMeta.verticalScale = copyGroup.attrs.barcodeMeta.verticalScale;
	    	hatioGroup.attrs.barcodeMeta.thickness = line.getStrokeWidth();
	    	hatioGroup.attrs.barcodeMeta.rotation = copyGroup.attrs.barcodeMeta.rotation;
	    }
	}
	regEventsHatioGroup(hatioGroup);
	selectHatioShape(hatioGroup, true);
	propertyRender(hatioGroup);
}

function addVertLine(group, addX, addY, addWidth, addHeight, copyGroup){
	var hatioGroup = group;
	if(!hatioGroup){
		hatioGroup = new Kinetic.Group({
	      	x: addX,
	        y: addY,
	        width: addWidth,
	        height: addHeight,
	      	draggable: true
	    });
		layer.add(hatioGroup);
		
		var rectangle = new Kinetic.Rect({
	        width: addWidth,
	        height: addHeight,
	        name : 'hatioShape',
	        fill: '#ffffff',
	        stroke: '#ffffff',
	        strokeWidth: 1,
	        opacity: 0,
	        draggable: false
	    });
	    hatioGroup.add(rectangle);
	    
		var line = new Kinetic.Line({
	  		points: [0, 0, 0, addHeight],
	        name : 'hatioShape2',
	        stroke: '#000000',
	        strokeWidth: 1,
	        draggable: false
	    });
	    hatioGroup.add(line);
	    hatioGroup.attrs.myZIndex = layer.getChildren().length-1;
	    hatioGroup.attrs.shapeType = 'VertLine';
	    hatioGroup.attrs.barcodeMeta = {
			horizontalScale : 1,
			verticalScale : 1,
			thickness : line.getStrokeWidth(),
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0
		}
		
		if(copyGroup){
	    	line.setStrokeWidth(copyGroup.get(".hatioShape2")[0].getStrokeWidth());
	    	hatioGroup.setScale(copyGroup.attrs.barcodeMeta.horizontalScale, copyGroup.attrs.barcodeMeta.verticalScale)
	    	hatioGroup.rotate(copyGroup.attrs.barcodeMeta.rotation/90 * Math.PI/2);
	    	hatioGroup.attrs.barcodeMeta.horizontalScale = copyGroup.attrs.barcodeMeta.horizontalScale;
	    	hatioGroup.attrs.barcodeMeta.verticalScale = copyGroup.attrs.barcodeMeta.verticalScale;
	    	hatioGroup.attrs.barcodeMeta.thickness = line.getStrokeWidth();
	    	hatioGroup.attrs.barcodeMeta.rotation = copyGroup.attrs.barcodeMeta.rotation;
	    }
	}
	regEventsHatioGroup(hatioGroup);
	selectHatioShape(hatioGroup, true);
	propertyRender(hatioGroup);
}

function addTextShape(group, addX, addY, addWidth, addHeight, copyGroup){
	var hatioGroup = group;
	if(!hatioGroup){
		hatioGroup = new Kinetic.Group({
	      	x: addX,
	        y: addY,
	        width: addWidth,
	        height: addHeight,
	      	draggable: true
	    });
		layer.add(hatioGroup);
		
		var text = new Kinetic.Text({
	        name : 'hatioShape',
	        text: 'Simple Text',
	        fontSize: 20,
	        fontFamily: 'Calibri',
	        fill: '#fffff',
	        draggable: false
	    });
	    hatioGroup.add(text);
	    hatioGroup.attrs.myZIndex = layer.getChildren().length-1;
	    hatioGroup.attrs.shapeType = 'TextShape';
	    hatioGroup.attrs.barcodeMeta = {
	    	data : text.getText(),
	    	fontSize : text.getFontSize(),
			horizontalScale : 1,
			verticalScale : 1,
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0
		}
		
		if(copyGroup){
	    	text.setText(copyGroup.get(".hatioShape")[0].getText());
	    	text.setFontSize(copyGroup.attrs.barcodeMeta.fontSize)
	    	hatioGroup.setScale(copyGroup.attrs.barcodeMeta.horizontalScale, copyGroup.attrs.barcodeMeta.verticalScale)
	    	hatioGroup.rotate(copyGroup.attrs.barcodeMeta.rotation/90 * Math.PI/2);
	    	hatioGroup.attrs.barcodeMeta.fontSize = copyGroup.attrs.barcodeMeta.fontSize;
	    	hatioGroup.attrs.barcodeMeta.horizontalScale = copyGroup.attrs.barcodeMeta.horizontalScale;
	    	hatioGroup.attrs.barcodeMeta.verticalScale = copyGroup.attrs.barcodeMeta.verticalScale;
	    	hatioGroup.attrs.barcodeMeta.rotation = copyGroup.attrs.barcodeMeta.rotation;
	    }
	}
	regEventsHatioGroup(hatioGroup);
	selectHatioShape(hatioGroup, true);
	propertyRender(hatioGroup);
}

function addBarcodeShape(imgData, barcodeMeta, group, img, addX, addY, addWidth, addHeight, copyGroup){
	var imageObj = new Image();
	var hatioGroup = group;
	var barcodeImage = img;
	if(!hatioGroup){
		hatioGroup = new Kinetic.Group({
	      	x: addX ? addX : stage.getWidth() / 2 - canvas.width/2,
	        y: addY ? addY : stage.getHeight() / 2 - canvas.height/2 ,
	        width: addWidth ? addWidth : canvas.width,
	        height: addHeight ? addHeight : canvas.height,
	      	draggable: true
	    });
		layer.add(hatioGroup);
		
		barcodeImage = new Kinetic.Image({
	        image: imageObj,
	        width: addWidth ? addWidth : canvas.width,
	        height: addHeight ? addHeight : canvas.height,
	        name : 'hatioShape'
	    });
	    hatioGroup.add(barcodeImage);
	    hatioGroup.attrs.barcodeMeta = barcodeMeta;
    	
    	hatioGroup.attrs.myZIndex = layer.getChildren().length-1;
    	hatioGroup.attrs.shapeType = 'BarcodeShape';
	}else{
		barcodeImage.setImage(imageObj);
	}
	
	if(copyGroup){
    	hatioGroup.setScale(copyGroup.attrs.barcodeMeta.horizontalScale, copyGroup.attrs.barcodeMeta.verticalScale)
    	hatioGroup.rotate(copyGroup.attrs.barcodeMeta.rotation/90 * Math.PI/2);
    	hatioGroup.attrs.barcodeMeta.horizontalScale = copyGroup.attrs.barcodeMeta.horizontalScale;
    	hatioGroup.attrs.barcodeMeta.verticalScale = copyGroup.attrs.barcodeMeta.verticalScale;
    	hatioGroup.attrs.barcodeMeta.rotation = copyGroup.attrs.barcodeMeta.rotation;
    }
	
    regEventsHatioGroup(hatioGroup);
  	
    barcodeImage.attrs.imgData = imgData;
	imageObj.src = imgData;
	imageObj.onload = function(){layer.draw();}
	selectHatioShape(hatioGroup, true);
	propertyRender(hatioGroup);
}

function regEventsHatioGroup(hatioGroup){
	hatioGroup.on('mousedown', function(evt){
		if(this.getDraggable()){
	    	shapeDownX = evt.layerX;
		    shapeDownY = evt.layerY;
		    for(var i=0; i<currentShapes.length; i++){
		    	currentShapes[i].oldX = currentShapes[i].getX();
		    	currentShapes[i].oldY = currentShapes[i].getY();
		    }
	    	selectHatioShape(this, true);
	    	propertyRender(this);
	    	evt.cancelBubble = true;       //for IE
			if(evt.stopPropagation){
			  evt.stopPropagation();
			}
			//var hatioShape = this.get(".hatioShape")[0];
			//alert(img.attrs.barcodeType + ", " + img.attrs.barcodeText);
		}
  	});
  	
  	hatioGroup.on('dragmove', function(evt){
  		var dx = evt.layerX - shapeDownX;
  	  	var dy = evt.layerY - shapeDownY;
  		for(var i=0; i<currentShapes.length; i++){
			if(this!=currentShapes[i]){
				currentShapes[i].setX(currentShapes[i].oldX + dx);
				currentShapes[i].setY(currentShapes[i].oldY + dy);
				layer.draw();
			}
		}
  	});
  	hatioGroup.on("dragend", function() {
    	//this.setZIndex(this.attrs.myZIndex);
  		comeBackZIndex();
    	layer.draw();
    	hatioGroupRevised();
    });
}


function selectHatioShape(hatioGroup, oldRemoveable, selfTry){
	var addAble = true;
	for(var i=0; i<currentShapes.length; i++){
		if(hatioGroup==currentShapes[i]){
			addAble = false;
		}
	}
	if(addAble || selfTry){
		if(oldRemoveable){
			unSelectHatioShapes(selfTry);
		}
		var hatioShape = hatioGroup.get(".hatioShape")[0];
		
		addAnchor(hatioGroup, hatioShape.getX(), hatioShape.getY(), "topLeft");
    	addAnchor(hatioGroup, hatioShape.getWidth()+hatioShape.getX(), hatioShape.getY(), "topRight");
    	addAnchor(hatioGroup, hatioShape.getWidth()+hatioShape.getX(), hatioShape.getHeight()+hatioShape.getY(), "bottomRight");
    	addAnchor(hatioGroup, hatioShape.getX(), hatioShape.getHeight()+hatioShape.getY(), "bottomLeft");
    	addAnchor(hatioGroup, hatioShape.getWidth()/2+hatioShape.getX(), hatioShape.getY(), "topCenter");
    	addAnchor(hatioGroup, hatioShape.getWidth()/2+hatioShape.getX(), hatioShape.getHeight()+hatioShape.getY(), "bottomCenter");
    	addAnchor(hatioGroup, hatioShape.getX(), hatioShape.getHeight()/2+hatioShape.getY(), "middleLeft");
    	addAnchor(hatioGroup, hatioShape.getWidth()+hatioShape.getX(), hatioShape.getHeight()/2+hatioShape.getY(), "middleRight");
    	
    	currentShapes.push(hatioGroup);
	}
	layer.draw();
}

function selectHatioShapeAll(){
	unSelectHatioShapes();
	var children = layer.getChildren();
	children.forEach(function(obj, i, a) {
		if(obj instanceof Kinetic.Group && obj.get(".hatioShape")){
			selectHatioShape(obj, false);
		}
	});
}

function unSelectHatioShapes(selfTry){
	if(!selfTry)
		propertyRender(null);
	for(var i=0; i<currentShapes.length; i++){
		//currentShapes[i].setZIndex(currentShapes[i].attrs.myZIndex);
		currentShapes[i].get(".topLeft")[0].remove();
  		currentShapes[i].get(".topRight")[0].remove();
  		currentShapes[i].get(".bottomRight")[0].remove();
  		currentShapes[i].get(".bottomLeft")[0].remove();
  		currentShapes[i].get(".topCenter")[0].remove();
  		currentShapes[i].get(".bottomCenter")[0].remove();
  		currentShapes[i].get(".middleLeft")[0].remove();
  		currentShapes[i].get(".middleRight")[0].remove();
  		
  		currentShapes[i].get(".topLeft")[0] = null;
  		currentShapes[i].get(".topRight")[0] = null;
  		currentShapes[i].get(".bottomRight")[0] = null;
  		currentShapes[i].get(".bottomLeft")[0] = null;
  		currentShapes[i].get(".topCenter")[0] = null;
  		currentShapes[i].get(".bottomCenter")[0] = null;
  		currentShapes[i].get(".middleLeft")[0] = null;
  		currentShapes[i].get(".middleRight")[0] = null;
  		
  		delete currentShapes[i].get(".topLeft");
  		delete currentShapes[i].get(".topRight");
  		delete currentShapes[i].get(".bottomRight");
  		delete currentShapes[i].get(".bottomLeft");
  		delete currentShapes[i].get(".topCenter");
  		delete currentShapes[i].get(".bottomCenter");
  		delete currentShapes[i].get(".middleLeft");
  		delete currentShapes[i].get(".middleRight");
	
    }
    comeBackZIndex();
    currentShapes = [];
    contentBoxUnSelection();
    layer.draw();
}

function addAnchor(group, x, y, name) {
	var visible = true;
	var draggble = true;
	if(group.attrs.shapeType == 'BarcodeShape'){
		draggble = false;
	}
	if(group.attrs.shapeType=='HorzLine'){
		visible = false;
		if(name == 'topLeft'){
			visible = true;
		}else if(name == 'topRight'){
			visible = true;
		}
	}else if(group.attrs.shapeType=='VertLine'){
		visible = false;
		if(name == 'topLeft'){
			visible = true;
		}else if(name == 'bottomLeft'){
			visible = true;
		}
	}
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Kinetic.Ellipse({
      x: x,
      y: y,
      fill: '#E1C2C2',
	  stroke: '#B36666',
      strokeWidth: 2/group.getScale().x,
      strokeHeight: 2/group.getScale().y,
      radius: {
      	x: 4/group.getScale().x,
      	y: 4/group.getScale().y
      },
      name: name,
      draggable: draggble,
      visible: visible
    });

    anchor.on("dragmove", function() {
      if(group.attrs.shapeType=='HorzLine'){
      	horzLineResize(group, this);
      }else if(group.attrs.shapeType=='VertLine'){
      	vertLineResize(group, this);
      }else if(group.attrs.shapeType=='TextShape'){
      	
      }else{
      	shapeResize(group, this, true);
      }
      layer.draw();
    });
    anchor.on("mousedown touchstart", function(evt) {
      group.setDraggable(false);
      this.moveToTop();
      evt.cancelBubble = true;       //for IE
		if(evt.stopPropagation){
		  evt.stopPropagation();
		}
    });
    anchor.on("dragend", function() {
      group.setDraggable(true);
      layer.draw();
      hatioGroupRevised();
    });
    anchor.on("mouseover", function() {
      this.oldX = this.getX();
      this.oldY = this.getY();
      resizeMode = true;
      var layer = this.getLayer();
      document.body.style.cursor = "pointer";
      this.setStrokeWidth(4/group.getScale().x);
      //this.setStrokeHeight(4/group.getScale().y);
      layer.draw();
    });
    anchor.on("mouseout", function() {
      resizeMode = false;
      var layer = this.getLayer();
      document.body.style.cursor = "default";
      this.setStrokeWidth(2);
      layer.draw();
    });
    group.add(anchor);
}

function shapeResize(group, activeAnchor, associated) {
	var diffX;
	var diffY;
	if(associated){
		diffX = activeAnchor.getX()-activeAnchor.oldX;
		diffY = activeAnchor.getY()-activeAnchor.oldY;
	}
    var topLeft = group.get(".topLeft")[0];
    var topRight = group.get(".topRight")[0];
    var bottomRight = group.get(".bottomRight")[0];
    var bottomLeft = group.get(".bottomLeft")[0];
    var topCenter = group.get(".topCenter")[0];
    var bottomCenter = group.get(".bottomCenter")[0];
    var middleLeft = group.get(".middleLeft")[0];
    var middleRight = group.get(".middleRight")[0];
    var hatioShape = group.get(".hatioShape")[0];
    var hatioShape2 = group.get(".hatioShape2")[0];

    switch (activeAnchor.getName()) {
      case "topLeft":
      	topLeft = activeAnchor;
        topRight.attrs.y = activeAnchor.attrs.y;
        bottomLeft.attrs.x = activeAnchor.attrs.x;
        break;
      case "topRight":
      	topRight = activeAnchor;
        topLeft.attrs.y = activeAnchor.attrs.y;
        bottomRight.attrs.x = activeAnchor.attrs.x;
        break;
      case "bottomRight":
      	bottomRight = activeAnchor;
        bottomLeft.attrs.y = activeAnchor.attrs.y;
        topRight.attrs.x = activeAnchor.attrs.x;
        break;
      case "bottomLeft":
      	bottomLeft = activeAnchor;
        bottomRight.attrs.y = activeAnchor.attrs.y;
        topLeft.attrs.x = activeAnchor.attrs.x;
        break;
      case "topCenter":
      	topCenter = activeAnchor;
      	topLeft.attrs.y = activeAnchor.attrs.y;
        break;
      case "bottomCenter":
      	bottomCenter = activeAnchor;
        bottomLeft.attrs.y = activeAnchor.attrs.y;
        break;
      case "middleLeft":
      	middleLeft = activeAnchor;
        topLeft.attrs.x = activeAnchor.attrs.x;
        break;
      case "middleRight":
      	middleRight = activeAnchor;
        topRight.attrs.x = activeAnchor.attrs.x;
        break;
    }

    var width = topRight.attrs.x - topLeft.attrs.x;
    var height = bottomLeft.attrs.y - topLeft.attrs.y;
    
    hatioShape.setPosition(topLeft.attrs.x, topLeft.attrs.y);
    if(hatioShape2){
    	hatioShape2.setPosition(topLeft.attrs.x+width/2, topLeft.attrs.y+height/2);	
    }
    activeAnchor.oldX = activeAnchor.getX();
    activeAnchor.oldY = activeAnchor.getY();

    if(width && height) {
      hatioShape.setSize(width, height);
      if(hatioShape2){
    	hatioShape2.setSize(width, height);
      }
      topLeft.setPosition(hatioShape.getX(), hatioShape.getY());
      topRight.setPosition(hatioShape.getX()+hatioShape.getWidth(), hatioShape.getY());
      bottomLeft.setPosition(hatioShape.getX(), hatioShape.getY()+hatioShape.getHeight());
      bottomRight.setPosition(hatioShape.getX()+hatioShape.getWidth(), hatioShape.getY()+hatioShape.getHeight());
      topCenter.setPosition(hatioShape.getWidth()/2+hatioShape.getX(), hatioShape.getY());
      bottomCenter.setPosition(hatioShape.getWidth()/2+hatioShape.getX(), hatioShape.getHeight()+hatioShape.getY());
      middleLeft.setPosition(hatioShape.getX(), hatioShape.getHeight()/2+hatioShape.getY());
      middleRight.setPosition(hatioShape.getWidth()+hatioShape.getX(), hatioShape.getHeight()/2+hatioShape.getY());
    }
    group.getLayer().draw();
    if(associated){
    	for(var i=0; i<currentShapes.length; i++){
	    	if(currentShapes[i]!=group){
	    		if(currentShapes[i].get(".topLeft").length>0){
	    			var currGroup = currentShapes[i];
	    			var currActiveAnchor = currentShapes[i].get("." + activeAnchor.getName())[0];
	    			if(currGroup.attrs.shapeType!='HorzLine' && currGroup.attrs.shapeType!='VertLine' && currGroup.attrs.shapeType!='TextShape' && currGroup.attrs.shapeType!='BarcodeShape'){
	    				currActiveAnchor.setPosition(currActiveAnchor.getX()+diffX, currActiveAnchor.getY()+diffY);
	    				shapeResize(currGroup, currActiveAnchor, false);
	    			}
	    		}
	    	}
	    }
    }
}

function horzLineResize(group, activeAnchor){
	var topLeft = group.get(".topLeft")[0];
    var topRight = group.get(".topRight")[0];
    var hatioShape = group.get(".hatioShape")[0];
    var hatioShape2 = group.get(".hatioShape2")[0];
    
    activeAnchor.setPosition(activeAnchor.getX(), activeAnchor.oldY);
    switch (activeAnchor.getName()) {
      case "topLeft":
      	topLeft = activeAnchor;
        break;
      case "topRight":
      	topRight = activeAnchor;
        break;
    }
    
    hatioShape.setPosition(topLeft.attrs.x, topLeft.attrs.y);
    hatioShape.setWidth(topRight.attrs.x - topLeft.attrs.x);
    hatioShape2.setPoints([0, 0, topRight.attrs.x-topLeft.attrs.x, 0]);
    hatioShape2.setPosition(topLeft.attrs.x, topLeft.attrs.y);
}

function vertLineResize(group, activeAnchor){
	var topLeft = group.get(".topLeft")[0];
    var bottomLeft = group.get(".bottomLeft")[0];
    var hatioShape = group.get(".hatioShape")[0];
    var hatioShape2 = group.get(".hatioShape2")[0];
    
    activeAnchor.setPosition(activeAnchor.oldX, activeAnchor.getY());
    switch (activeAnchor.getName()) {
      case "topLeft":
      	topLeft = activeAnchor;
        break;
      case "bottomLeft":
      	bottomLeft = activeAnchor;
        break;
    }
    hatioShape.setPosition(topLeft.attrs.x, topLeft.attrs.y);
    hatioShape.setHeight(bottomLeft.attrs.y - topLeft.attrs.y);
    hatioShape2.setPoints([0, 0, 0, bottomLeft.attrs.y - topLeft.attrs.y]);
    hatioShape2.setPosition(topLeft.attrs.x, topLeft.attrs.y);
}

function layerScale(){
	var scale = layer.getScale();
	scale.x = scale.x + 0.1;
	scale.y = scale.y + 0.1;
	layer.setScale(scale);
	layer.draw();
}

function save(){
	rulerLayer.remove();
	rulerLayer = null;
	delete rulerLayer;
	addLalyer.remove();
	addLalyer = null;
	delete addLalyer;
	unSelectHatioShapes();
	stage.draw();
	var json = stage.toJSON();
	console.log(json);
	makeRuler();
	addLalyer = new Kinetic.Layer({id:'addLayer'});
   	stage.add(addLalyer);
   	stage.draw();
}
function load(){
	stageLoad(testData);
}

function contentBoxSelection(){
	contentBoxAddAnchor(contentBox.getX(), contentBox.getY(), "contentTopLeft");
    contentBoxAddAnchor(contentBox.getWidth()+contentBox.getX(), contentBox.getY(), "contentTopRight");
    contentBoxAddAnchor(contentBox.getWidth()+contentBox.getX(), contentBox.getHeight()+contentBox.getY(), "contentBottomRight");
    contentBoxAddAnchor(contentBox.getX(), contentBox.getHeight()+contentBox.getY(), "contentBottomLeft");
    contentBoxAddAnchor(contentBox.getWidth()/2+contentBox.getX(), contentBox.getY(), "contentTopCenter");
    contentBoxAddAnchor(contentBox.getWidth()/2+contentBox.getX(), contentBox.getHeight()+contentBox.getY(), "contentBottomCenter");
    contentBoxAddAnchor(contentBox.getX(), contentBox.getHeight()/2+contentBox.getY(), "contentMiddleLeft");
    contentBoxAddAnchor(contentBox.getWidth()+contentBox.getX(), contentBox.getHeight()/2+contentBox.getY(), "contentMiddleRight");
}

function contentBoxUnSelection(){
	if(layer.get(".contentTopLeft").length>0){
		layer.get(".contentTopLeft")[0].remove();
  		layer.get(".contentTopRight")[0].remove();
  		layer.get(".contentBottomRight")[0].remove();
  		layer.get(".contentBottomLeft")[0].remove();
  		layer.get(".contentTopCenter")[0].remove();
  		layer.get(".contentBottomCenter")[0].remove();
  		layer.get(".contentMiddleLeft")[0].remove();
  		layer.get(".contentMiddleRight")[0].remove();
  		
  		layer.get(".contentTopLeft")[0] = null;
  		layer.get(".contentTopRight")[0] = null;
  		layer.get(".contentBottomRight")[0] = null;
  		layer.get(".contentBottomLeft")[0] = null;
  		layer.get(".contentTopCenter")[0] = null;
  		layer.get(".contentBottomCenter")[0] = null;
  		layer.get(".contentMiddleLeft")[0] = null;
  		layer.get(".contentMiddleRight")[0] = null;
  		
  		delete layer.get(".contentTopLeft");
  		delete layer.get(".contentTopRight");
  		delete layer.get(".contentBottomRight");
  		delete layer.get(".contentBottomLeft");
  		delete layer.get(".contentTopCenter");
  		delete layer.get(".contentBottomCenter");
  		delete layer.get(".contentMiddleLeft");
  		delete layer.get(".contentMiddleRight");
    }
    layer.draw();
}

function contentBoxResizeOnOff(){
	propertyRender(null);
	if(layer.get(".contentTopLeft").length>0){
		contentBoxUnSelection();
	}else{
		unSelectHatioShapes();
		contentBoxSelection();
	}
}

function contentBoxAddAnchor(x, y, name) {
	var stage = contentBox.getStage();
    var layer = contentBox.getLayer();

    var anchor = new Kinetic.Circle({
      x: x,
      y: y,
      fill: '#E1C2C2',
	  stroke: '#B36666',
      strokeWidth: 2,
      radius: 4,
      name: name,
      draggable: true,
      visible: true
    });

    anchor.on("dragmove", function() {
      contentBoxResize(this);
      layer.draw();
    });
    anchor.on("mousedown touchstart", function(evt) {
      this.moveToTop();
      evt.cancelBubble = true;       //for IE
		if(evt.stopPropagation){
		  evt.stopPropagation();
		}
    });
    anchor.on("dragend", function() {
      layer.draw();
      paperRevised();
    });
    // add hover styling
    anchor.on("mouseover", function() {
      resizeMode = true;
      var layer = this.getLayer();
      document.body.style.cursor = "pointer";
      this.setStrokeWidth(4);
      layer.draw();
    });
    anchor.on("mouseout", function() {
      resizeMode = false;
      var layer = this.getLayer();
      document.body.style.cursor = "default";
      this.setStrokeWidth(2);
      layer.draw();
    });
    layer.add(anchor);
    layer.draw();
}

function contentBoxResize(activeAnchor){
	var topLeft = layer.get(".contentTopLeft")[0];
    var topRight = layer.get(".contentTopRight")[0];
    var bottomRight = layer.get(".contentBottomRight")[0];
    var bottomLeft = layer.get(".contentBottomLeft")[0];
    var topCenter = layer.get(".contentTopCenter")[0];
    var bottomCenter = layer.get(".contentBottomCenter")[0];
    var middleLeft = layer.get(".contentMiddleLeft")[0];
    var middleRight = layer.get(".contentMiddleRight")[0];

    // update anchor positions
    switch (activeAnchor.getName()) {
      case "contentTopLeft":
      	topLeft = activeAnchor;
        topRight.attrs.y = activeAnchor.attrs.y;
        bottomLeft.attrs.x = activeAnchor.attrs.x;
        break;
      case "contentTopRight":
      	topRight = activeAnchor;
        topLeft.attrs.y = activeAnchor.attrs.y;
        bottomRight.attrs.x = activeAnchor.attrs.x;
        break;
      case "contentBottomRight":
      	bottomRight = activeAnchor;
        bottomLeft.attrs.y = activeAnchor.attrs.y;
        topRight.attrs.x = activeAnchor.attrs.x;
        break;
      case "contentBottomLeft":
      	bottomLeft = activeAnchor;
        bottomRight.attrs.y = activeAnchor.attrs.y;
        topLeft.attrs.x = activeAnchor.attrs.x;
        break;
      case "contentTopCenter":
      	topCenter = activeAnchor;
      	topLeft.attrs.y = activeAnchor.attrs.y;
        break;
      case "contentBottomCenter":
      	bottomCenter = activeAnchor;
        bottomLeft.attrs.y = activeAnchor.attrs.y;
        break;
      case "contentMiddleLeft":
      	middleLeft = activeAnchor;
        topLeft.attrs.x = activeAnchor.attrs.x;
        break;
      case "contentMiddleRight":
      	middleRight = activeAnchor;
        topRight.attrs.x = activeAnchor.attrs.x;
        break;
    }

    var width = topRight.attrs.x - topLeft.attrs.x;
    var height = bottomLeft.attrs.y - topLeft.attrs.y;
    if(width && height) {
      contentBox.setSize(width, height);
      contentBox.setPosition(stage.getWidth()/2-contentBox.getWidth()/2, stage.getHeight()/2-contentBox.getHeight()/2);
      topLeft.setPosition(contentBox.getX(), contentBox.getY());
      topRight.setPosition(contentBox.getX()+contentBox.getWidth(), contentBox.getY());
      bottomLeft.setPosition(contentBox.getX(), contentBox.getY()+contentBox.getHeight());
      bottomRight.setPosition(contentBox.getX()+contentBox.getWidth(), contentBox.getY()+contentBox.getHeight());
      topCenter.setPosition(contentBox.getWidth()/2+contentBox.getX(), contentBox.getY());
      bottomCenter.setPosition(contentBox.getWidth()/2+contentBox.getX(), contentBox.getHeight()+contentBox.getY());
      middleLeft.setPosition(contentBox.getX(), contentBox.getHeight()/2+contentBox.getY());
      middleRight.setPosition(contentBox.getWidth()+contentBox.getX(), contentBox.getHeight()/2+contentBox.getY());
    }
    layer.draw();
    
    horRulerContent.setWidth(contentBox.getWidth());
    horRulerContent.setX(contentBox.getX());
    verRulerContent.setHeight(contentBox.getHeight());
    verRulerContent.setY(contentBox.getY());
    rulerLayer.draw();
}

function addShapeReady(shapeType){
	addShapeType = shapeType;
	document.body.style.cursor = "Crosshair";
	addShapeMode = true;
	var children = layer.getChildren();
  	for(var i=2; i<children.length; i++){
  		children[i].setDraggable(false);
  	}
}

function addShapeCancel(){
	addShapeMode = false;
	addShapeHorLine.remove();
	addShapeVerLine.remove();
	addShapeHorLine = null;
	addShapeVerLine = null;
	delete addShapeHorLine;
	delete addShapeVerLine;
	addLalyer.draw();
	document.body.style.cursor = "default";
}

function removeShape(thiness){
	var delZIndex = [];
	if(currentShapes){
		for(var i=0; i<currentShapes.length; i++){
			delZIndex.push(currentShapes[i].attrs.myZIndex);
			currentShapes[i].remove();
			if(thiness){
				currentShapes[i] = null;
	  			delete currentShapes[i];	
			}
		}
		currentShapes = [];
		layer.draw();
	}
	myZindexAdjust(delZIndex);
	propertyRender(null);
}

function makeRuler(){
	try{
		rulerLayer.remove();
		rulerLayer = null;
		delete rulerLayer;
	}catch(e){}
	rulerLayer = new Kinetic.Layer({id:'rulerLayer'});
	horRulerBox = new Kinetic.Rect({
	    width: $('#container').width(),
		height: 14,
		fill: '#eeeeed',
		stroke: '#eeeeed',
		strokeWidth: 0,
		name: 'horRulerBox',
	    draggable: false
	});
	rulerLayer.add(horRulerBox);
    horRulerContent = new Kinetic.Rect({
	    width: contentBox.getWidth(),
		height: 14,
		x: contentBox.getX(),
		fill: '#C0FAC7',
		stroke: '#C0FAC7',
		strokeWidth: 0,
		name: 'horRulerContent',
	    draggable: false
	});
	rulerLayer.add(horRulerContent);
	
	horRuler = makeHorRuler();
	rulerLayer.add(horRuler);
	
	horRulerPoint = new Kinetic.Line({
  		points: [0, 0, 0, 15],
        stroke: '#ff0000',
        strokeWidth: 2,
        opacity: 1,
        draggable: false
    });
    rulerLayer.add(horRulerPoint);
    
	verRulerBox = new Kinetic.Rect({
	    width: 14,
	    y:14,
	    height: $('#container').height(),
		fill: '#eeeeed',
		stroke: '#eeeeed',
		strokeWidth: 1,
		name: 'verRulerBox',
	    draggable: false
	});
	rulerLayer.add(verRulerBox);
	verRulerContent = new Kinetic.Rect({
	    width: 14,
		height: contentBox.getHeight(),
		y: contentBox.getY(),
		fill: '#C0FAC7',
		stroke: '#C0FAC7',
		strokeWidth: 0,
		name: 'verRulerContent',
	    draggable: false
	});
	rulerLayer.add(verRulerContent);
	
	verRuler = makeVerRuler();
	rulerLayer.add(verRuler);
	
	verRulerPoint = new Kinetic.Line({
  		points: [0, 0, 15, 0],
        stroke: '#ff0000',
        strokeWidth: 2,
        opacity: 1,
        draggable: false
    });
	rulerLayer.add(verRulerPoint);
	stage.add(rulerLayer)
}

function makeHorRuler(){
	var shape = new Kinetic.Shape({
        drawFunc: function(canvas) {
          var context = canvas.getContext();
          var startX = contentBox.getX();
          var plusWidth = stage.getWidth() - startX;
          var plusCount = Math.ceil(plusWidth/mmPixel);
          context.beginPath();
          context.moveTo(startX, 0);
          for(var i=0; i<plusCount; i++){
          	if(i%10 == 0){
          		context.moveTo(startX + i*mmPixel, 0);
          		context.lineTo(startX + i*mmPixel, 15);
          		context.fillText(i/10+'', startX + i*mmPixel + 2, 11 , 12);
          	}else if(i%5 == 0){
          		context.moveTo(startX + i*mmPixel, 9);
          		context.lineTo(startX + i*mmPixel, 15);
          	}else{
          		context.moveTo(startX + i*mmPixel, 12);
          		context.lineTo(startX + i*mmPixel, 15);
          	}
          }
          var minusWidth = startX;
          var minusCount = Math.floor(minusWidth/mmPixel);
          context.moveTo(startX, 0);
          for(var j=1; j<minusCount; j++){
          	if(startX - j*mmPixel < 15){
          		break;
          	}
          	if(j%10 == 0){
          		context.moveTo(startX - j*mmPixel, 0);
          		context.lineTo(startX - j*mmPixel, 15);
          		context.fillText('-'+j/10, startX - j*mmPixel + 2, 11, 12);
          	}else if(j%5 == 0){
          		context.moveTo(startX - j*mmPixel, 9);
          		context.lineTo(startX - j*mmPixel, 15);
          	}else{
          		context.moveTo(startX - j*mmPixel, 12);
          		context.lineTo(startX - j*mmPixel, 15);
          	}
          }
          context.closePath();
          canvas.fillStroke(this);
        },
        fill: '#FAF602',
        stroke: '#0000ff',
        strokeWidth: 0.5,
        x: 0
   });
   return shape;
}

function makeVerRuler(){
	var shape = new Kinetic.Shape({
        drawFunc: function(canvas) {
          var context = canvas.getContext();
          var startY = contentBox.getY();
          var plusHeight = stage.getHeight() - startY;
          var plusCount = Math.ceil(plusHeight/mmPixel);
          context.beginPath();
          context.moveTo(0, startY);
          for(var i=0; i<plusCount; i++){
          	if(i%10 == 0){
          		context.moveTo(0, startY + i*mmPixel);
          		context.lineTo(15, startY + i*mmPixel);
          		context.fillText(i/10+'', 1, startY + i*mmPixel + 12, 12)
          	}else if(i%5 == 0){
          		context.moveTo(9, startY + i*mmPixel);
          		context.lineTo(15, startY + i*mmPixel);
          	}else{
          		context.moveTo(12, startY + i*mmPixel);
          		context.lineTo(15, startY + i*mmPixel);
          	}
          }
          var minusHeight = startY;
          var minusCount = Math.floor(minusHeight/mmPixel);
          context.moveTo(0, startY);
          for(var j=1; j<minusCount; j++){
          	if(startY - j*mmPixel < 15){
          		break;
          	}
          	if(j%10 == 0){
          		context.moveTo(0, startY - j*mmPixel);
          		context.lineTo(15, startY - j*mmPixel);
          		context.fillText('-'+j/10, 1, startY - j*mmPixel + 12, 12);
          	}else if(j%5 == 0){
          		context.moveTo(9, startY - j*mmPixel);
          		context.lineTo(15, startY - j*mmPixel);
          	}else{
          		context.moveTo(12, startY - j*mmPixel);
          		context.lineTo(15, startY - j*mmPixel);
          	}
          }
          context.closePath();
          canvas.fillStroke(this);
        },
        fill: '#FAF602',
        stroke: '#0000ff',
        strokeWidth: 0.5,
        x: 0
   });
   return shape;
}

function pixelTomm(pixel, axis){
	var result;
	if(axis == 'x'){
		result = (pixel-contentBox.getX())/mmPixel/10;
	}else{
		result = (pixel-contentBox.getY())/mmPixel/10;
	}
	return Math.round(result*10000)/10000;
}

function pixelValueTomm(value){
	var result = value/mmPixel/10; 
	return Math.round(result*10000)/10000;
}

function mmlValueToPixel(value){
	var result = value*mmPixel*10; 
	return result;
}

function bwipRender(addX, addY, addWidth, addHeight) {
	var elt = symdesc[$('#symbol')[0].selectedIndex];
	var text = $('#symtext').val().replace(/^\s+/,'').replace(/\s+$/,'');
	var altx; //= $('#symaltx').val().replace(/^\s+/,'').replace(/\s+$/,'');
	var opts = $('#symopts').val().replace(/^\s+/,'').replace(/\s+$/,'');

	var bw = new BWIPJS;

	// Convert the options to a dictionary object, so we can pass alttext with
	// spaces.
	var tmp = opts.split(' '); 
	opts = {};
	for (var i = 0; i < tmp.length; i++) {
		if (!tmp[i])
			continue;
		var eq = tmp[i].indexOf('=');
		if (eq == -1)
			opts[tmp[i]] = bw.value(true);
		else
			opts[tmp[i].substr(0, eq)] = bw.value(tmp[i].substr(eq+1));
	}

	// Add the alternate text
	if (altx)
		opts.alttext = bw.value(altx);

	// Add any hard-coded options required to fix problems in the javascript
	// emulation. 
	opts.inkspread = bw.value(0);
	if (needyoffset[elt.sym] && !opts.textxalign && !opts.textyalign &&
			!opts.alttext && opts.textyoffset === undefined)
		opts.textyoffset = bw.value(-10);

//	var rot  = 'N';
//	var rots = [ 'rotL', 'rotR', 'rotI' ];
//	for (var i = 0; i < rots.length; i++) {
//		if (document.getElementById(rots[i]).checked) {
//			rot = rots[i].charAt(3);
//			break;
//		}
//	}

	bw.bitmap(new Bitmap);
	
	//var sclW = parseInt(document.getElementById('scaleW').value, 10) || 2;
	//var sclH = parseInt(document.getElementById('scaleH').value, 10) || 2;
	//bw.scale(sclW,sclH);
	bw.scale(1,1);

	bw.push(text);
	bw.push(opts);

	try {
		bw.call(elt.sym);
		//bw.bitmap().show('canvas', rot);
		bw.bitmap().show('canvas', 'N');
		var canvas = document.getElementById("canvas");
		var img    = canvas.toDataURL("image/png");
		addWidth = canvas.width;
		addHeight = canvas.height;
		
		var barcodeMeta = {
			barcodeType : elt.sym,
			data : text,
			barcodeParamter : '',
			horizontalScale : 1,
			verticalScale : 1,
			field : '',
			printInterpretaionLine : '',
			printInterPretaionParameters : '',
			cmWidth : pixelValueTomm(addWidth),
			cmHeight : pixelValueTomm(addHeight),
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0,
			opts : opts
		}
		
		addBarcodeShape(img, barcodeMeta, null, null, addX, addY, addWidth, addHeight);
	} catch(e) {
		var s = '';
		if (e.fileName)
			s += e.fileName + ' ';
		if (e.lineNumber)
			s += '[line ' + e.lineNumber + '] ';
		alert(s + (s ? ': ' : '') + e.message);
	}
}

function bwipRenderOnlyImg(addX, addY, addWidth, addHeight, elt, text, opts, rot) {
	var bw = new BWIPJS;
	var opts = $('#symopts').val().replace(/^\s+/,'').replace(/\s+$/,'');
	var tmp = opts.split(' '); 
	opts = {};
	for (var i = 0; i < tmp.length; i++) {
		if (!tmp[i])
			continue;
		var eq = tmp[i].indexOf('=');
		if (eq == -1)
			opts[tmp[i]] = bw.value(true);
		else
			opts[tmp[i].substr(0, eq)] = bw.value(tmp[i].substr(eq+1));
	}

	opts.inkspread = bw.value(0);
	if (needyoffset[elt] && !opts.textxalign && !opts.textyalign &&
			!opts.alttext && opts.textyoffset === undefined)
		opts.textyoffset = bw.value(-10);

	bw.bitmap(new Bitmap);
	
	//var sclW = parseInt(document.getElementById('scaleW').value, 10) || 2;
	//var sclH = parseInt(document.getElementById('scaleH').value, 10) || 2;
	//bw.scale(sclW,sclH);
	bw.scale(1,1);

	bw.push(text);
	bw.push(opts);

	try {
		bw.call(elt);
		bw.bitmap().show('canvas', rot);
		var canvas = document.getElementById("canvas");
		var img    = canvas.toDataURL("image/png");
		addWidth = canvas.width;
		addHeight = canvas.height;
		
		var barcodeMeta = {
			barcodeType : elt,
			data : text,
			barcodeParamter : '',
			horizontalScale : 1,
			verticalScale : 1,
			field : '',
			printInterpretaionLine : '',
			printInterPretaionParameters : '',
			cmWidth : pixelValueTomm(addWidth),
			cmHeight : pixelValueTomm(addHeight),
			cmX : pixelValueTomm(addX-contentBox.getX()),
			cmY : pixelValueTomm(addY-contentBox.getY()),
			rotation : 0,
			opts : opts,
			imgData : img,
			addWidth : addWidth,
			addHeight : addHeight
		}
		return barcodeMeta;
	} catch(e) {
		var s = '';
		if (e.fileName)
			s += e.fileName + ' ';
		if (e.lineNumber)
			s += '[line ' + e.lineNumber + '] ';
		alert(s + (s ? ': ' : '') + e.message);
	}
}

function scrollMove(){
//	stage.setX(-100);
//	stage.setY(-100);
//	stage.draw();
}


/*-------------------------------copy, paste, cut start----------------------------------*/
var copyShapes;
var cutMode = false;
function copyShape(){
	copyShapes = [];
	for(var i=0; i<currentShapes.length; i++){
		copyShapes.push(currentShapes[i]);
	}
}

function pasteShape(){
	for(var i=0; i<copyShapes.length; i++){
		switch (copyShapes[i].attrs.shapeType) {
  			case "BarcodeShape":
  				var img = copyShapes[i].get(".hatioShape")[0];
  				var copyBarcodeMeta = {};
  				for(var key in copyShapes[i].attrs.barcodeMeta){
  					copyBarcodeMeta[key] = copyShapes[i].attrs.barcodeMeta[key];
  				}
  				addBarcodeShape(img.attrs.imgData, copyBarcodeMeta, null, null, copyShapes[i].getX()+16, copyShapes[i].getY()+16, copyShapes[i].getWidth(), copyShapes[i].getHeight(), copyShapes[i]);
  				break;
  			case "RectangleShape":
  				addRectangleShape(null, copyShapes[i].getX()+16, copyShapes[i].getY()+16, copyShapes[i].getWidth(), copyShapes[i].getHeight(), copyShapes[i]);
  				break;
  			case "EllipseShape":
  				addEllipseShape(null, copyShapes[i].getX()+16, copyShapes[i].getY()+16, copyShapes[i].getWidth(), copyShapes[i].getHeight(), copyShapes[i]);
  				break;
  			case "HorzLine":
  				addHorzLine(null, copyShapes[i].getX()+16, copyShapes[i].getY()+16, copyShapes[i].getWidth(), copyShapes[i].getHeight()+15, copyShapes[i]);
  				break;
  			case "VertLine":
  				addVertLine(null, copyShapes[i].getX()+16, copyShapes[i].getY()+16, copyShapes[i].getWidth()+15, copyShapes[i].getHeight(), copyShapes[i]);
  				break;
  			case "TextShape":
  				addTextShape(null, copyShapes[i].getX()+16, copyShapes[i].getY()+16, copyShapes[i].getWidth(), copyShapes[i].getHeight(), copyShapes[i]);
  				break;
  		}	
	}
	if(cutMode){
		for(var i=0; i<copyShapes.length; i++){
			copyShapes[i] = null;
			delete copyShapes[i]
		}
		cutMode = false;
	}
	copyShapes = [];
	hatioGroupRevised();
}

function cutShape(){
	cutMode = true;
	copyShape();
	removeShape(true)
}
/*-------------------------------copy, paste, cut end------------------------------------*/


/*-------------------------------zIndex start----------------------------------*/
function comeBackZIndex(){
	 var children = layer.getChildren();
	 var newArr = [];
	 
	 children.forEach(function(obj, i, a) {
	 	newArr.push(obj);
	 });

	 newArr.forEach(function(obj, i, a) {
		if(obj.attrs.myZIndex){
	 		obj.setZIndex(obj.attrs.myZIndex);
	 		layer.draw();
		}
	 });
}

function myZindexAdjust(delZIndex){
	var layerChildren = layer.getChildren();
	for(var i=0; i<delZIndex.length; i++){
		for(var k=0; k<layerChildren.length; k++){
			if(layerChildren[k].attrs.myZIndex){
				if(layerChildren[k].attrs.myZIndex > delZIndex[i]){
					layerChildren[k].attrs.myZIndex = layerChildren[k].attrs.myZIndex - 1;
				}
			}
		}
	}
}

function orderZIndex(){
	 var children = layer.getChildren();
  	 for(var i=0; i<children.length; i++){
  	 	if(children[i].attrs.myZIndex){
  	 		console.log("--> " + children[i].getZIndex());
  	 		children[i].attrs.myZIndex = children[i].getZIndex();
  	 	}
  	 }
}

function topZIndex(){
	if(currentShapes.length==1){
		currentShapes[0].moveToTop();
	}
	layer.draw();
	orderZIndex();
}

function bottomZIndex(){
	if(currentShapes.length==1){
		currentShapes[0].moveToBottom();
		currentShapes[0].moveUp();
		currentShapes[0].moveUp();
	}
	layer.draw();
	orderZIndex();
}

function upZIndex(){
	if(currentShapes.length==1){
		if(currentShapes[0].attrs.myZIndex==layer.getChildren().length-1){
			return;
		}
		currentShapes[0].setZIndex(currentShapes[0].attrs.myZIndex+1);
	}
	layer.draw();
	orderZIndex();
}

function downZIndex(){
	if(currentShapes.length==1){
		if(currentShapes[0].attrs.myZIndex==2){
			return;
		}
		currentShapes[0].setZIndex(currentShapes[0].attrs.myZIndex-1);
	}
	layer.draw();
	orderZIndex();
}
/*-------------------------------zIndex end-----------------------------------*/


/*-------------------------------align start----------------------------------*/
function leftAlign(){
	var baseX = 999999;
	for(var i=0; i<currentShapes.length; i++){
		if(baseX>currentShapes[i].getX()){
			baseX = currentShapes[i].getX();
		}
	}
	for(var k=0; k<currentShapes.length; k++){
		currentShapes[k].setX(baseX);
	}
	layer.draw();
	hatioGroupRevised();
}

function centerAlign(){
	var baseX=0;
	for(var i=0; i<currentShapes.length; i++){
		baseX = baseX + (currentShapes[i].getX()+currentShapes[i].getWidth()/2);
	}
	baseX = baseX/currentShapes.length;
	for(var k=0; k<currentShapes.length; k++){
		currentShapes[k].setX(baseX-currentShapes[k].getWidth()/2);
	}
	layer.draw();
	hatioGroupRevised();
}

function rightAlign(){
	var baseX = 0;
	for(var i=0; i<currentShapes.length; i++){
		if(baseX<currentShapes[i].getX()+currentShapes[i].getWidth()){
			baseX = currentShapes[i].getX()+currentShapes[i].getWidth();
		}
	}
	for(var k=0; k<currentShapes.length; k++){
		currentShapes[k].setX(baseX - currentShapes[k].getWidth());
	}
	layer.draw();
	hatioGroupRevised();
}

function topAlign(){
	var baseY = 999999;
	for(var i=0; i<currentShapes.length; i++){
		if(baseY>currentShapes[i].getY()){
			baseY = currentShapes[i].getY();
		}
	}
	for(var k=0; k<currentShapes.length; k++){
		currentShapes[k].setY(baseY);
	}
	layer.draw();
	hatioGroupRevised();
}

function middleAlign(){
	var baseY=0;
	for(var i=0; i<currentShapes.length; i++){
		baseY = baseY + (currentShapes[i].getY()+currentShapes[i].getHeight()/2);
	}
	baseY = baseY/currentShapes.length;
	for(var k=0; k<currentShapes.length; k++){
		currentShapes[k].setY(baseY-currentShapes[k].getHeight()/2);
	}
	layer.draw();
	hatioGroupRevised();
}

function bottomAlign(){
	var baseY = 0;
	for(var i=0; i<currentShapes.length; i++){
		if(baseY<currentShapes[i].getY()+currentShapes[i].getHeight()){
			baseY = currentShapes[i].getY()+currentShapes[i].getHeight();
		}
	}
	for(var k=0; k<currentShapes.length; k++){
		currentShapes[k].setY(baseY - currentShapes[k].getHeight());
	}
	layer.draw();
	hatioGroupRevised();
}
/*-------------------------------align end----------------------------------*/


/*-------------------------------property start----------------------------------*/
var editHatioGroup
function propertyRender(hatioGroup){
	if(hatioGroup){
		editHatioGroup = hatioGroup;
		if(hatioGroup.attrs && hatioGroup.attrs.shapeType=='BarcodeShape'){
			$("#tools_bottom").html(bracodePropertyEditor);
			$("#propertyDiv #barcodeType").val(hatioGroup.attrs.barcodeMeta.barcodeType);
			$("#propertyDiv #data").val(hatioGroup.attrs.barcodeMeta.data);
			$("#propertyDiv #barcodeParamter").val(hatioGroup.attrs.barcodeMeta.barcodeParamter);
			$("#propertyDiv #field").val(hatioGroup.attrs.barcodeMeta.field);
			$("#propertyDiv #printInterpretaionLine").val(hatioGroup.attrs.barcodeMeta.printInterpretaionLine);
			$("#propertyDiv #printInterPretaionParameters").val(hatioGroup.attrs.barcodeMeta.printInterPretaionParameters);
			$('#propertyDiv input[name=printInterpretaionLine]').filter("input[value="+hatioGroup.attrs.barcodeMeta.printInterpretaionLine+"]").attr("checked", "checked");
			$("#propertyDiv #cmWidth").val(hatioGroup.attrs.barcodeMeta.cmWidth);
			$("#propertyDiv #cmHeight").val(hatioGroup.attrs.barcodeMeta.cmHeight);
			$("#propertyDiv #thickness").val(hatioGroup.attrs.barcodeMeta.thickness);
		}else if(hatioGroup.attrs && (hatioGroup.attrs.shapeType=='RectangleShape' || hatioGroup.attrs.shapeType=='EllipseShape')){
			$("#tools_bottom").html(ploygonPropertyEditor);
			$("#propertyDiv #cmWidth").val(hatioGroup.attrs.barcodeMeta.cmWidth);
			$("#propertyDiv #cmHeight").val(hatioGroup.attrs.barcodeMeta.cmHeight);
			$("#propertyDiv #thickness").val(hatioGroup.attrs.barcodeMeta.thickness);
		}else if(hatioGroup.attrs && (hatioGroup.attrs.shapeType=='HorzLine' || hatioGroup.attrs.shapeType=='VertLine')){
			$("#tools_bottom").html(linePropertyEditor);
			$("#propertyDiv #thickness").val(hatioGroup.attrs.barcodeMeta.thickness);
		}else if(hatioGroup.attrs && hatioGroup.attrs.shapeType=='TextShape'){
			$("#tools_bottom").html(textPropertyEditor);
			$("#propertyDiv #data").val(hatioGroup.attrs.barcodeMeta.data);
			$("#propertyDiv #fontSize").val(hatioGroup.attrs.barcodeMeta.fontSize);
		}
		$("#propertyDiv #horizontalScale").val(hatioGroup.attrs.barcodeMeta.horizontalScale);
		$("#propertyDiv #verticalScale").val(hatioGroup.attrs.barcodeMeta.verticalScale);
		$("#propertyDiv #cmX").val(hatioGroup.attrs.barcodeMeta.cmX);
		$("#propertyDiv #cmY").val(hatioGroup.attrs.barcodeMeta.cmY);
		$('#propertyDiv input[name=rotation]').filter("[value="+hatioGroup.attrs.barcodeMeta.rotation+"]").attr("checked", "checked");
		$('#propertyDiv').children().bind('change',shapePropertyChange);
	}else{
		$("#tools_bottom").html(paperPropertyEditor);
		$('#propertyDiv input[name=dpi]').filter("input[value="+contentBox.attrs.barcodeMeta.dpi+"]").attr("checked", "checked");
		$("#propertyDiv #labelWidth").val(contentBox.attrs.barcodeMeta.labelWidth);
		$("#propertyDiv #labelHeight").val(contentBox.attrs.barcodeMeta.labelHeight);
		$('#propertyDiv input[name=rotated]').filter("input[value="+contentBox.attrs.barcodeMeta.rotated+"]").attr("checked", "checked");
		$('#propertyDiv').children().bind('change',paperPropertyChange);
		editHatioGroup = null;
	}
}

function shapePropertyChange(event){
	if(event.target.name){
		editHatioGroup.attrs.barcodeMeta[event.target.name] = event.target.value;
	}else{
		editHatioGroup.attrs.barcodeMeta[event.target.id] = event.target.value;
	}
	
	if(event.target.id && event.target.id=='horizontalScale'){
		editHatioGroup.setScale(editHatioGroup.attrs.barcodeMeta.horizontalScale, editHatioGroup.getScale().y);
		selectHatioShape(editHatioGroup, true, true);
		layer.draw();
		hatioGroupRevised();
	}
	
	if(event.target.id && event.target.id=='verticalScale'){
		editHatioGroup.setScale(editHatioGroup.getScale().x, editHatioGroup.attrs.barcodeMeta.verticalScale);
		selectHatioShape(editHatioGroup, true, true);
		layer.draw();
		hatioGroupRevised();
	}
	
	if(event.target.id && event.target.id=='data'){
		if(editHatioGroup.attrs.shapeType=='BarcodeShape'){
			var addX = editHatioGroup.getX();
			var addY = editHatioGroup.getY();
			var addWidth = editHatioGroup.getWidth();
			var addHeight = editHatioGroup.getHeight();
			var elt = editHatioGroup.attrs.barcodeMeta.barcodeType;
			var text = editHatioGroup.attrs.barcodeMeta.data;
			var opts = editHatioGroup.attrs.barcodeMeta.opts;
			var rot = 'N';
			
			var barcodeMeta = bwipRenderOnlyImg(addX, addY, addWidth, addHeight, elt, text, opts, rot);
			var barcodeImage = editHatioGroup.get(".hatioShape")[0];
			
			editHatioGroup.setSize(barcodeMeta.addWidth, barcodeMeta.addHeight);
			var imageObj = barcodeImage.getImage();
	    	barcodeImage.attrs.imgData = barcodeMeta.imgData;
	    	barcodeImage.setSize(barcodeMeta.addWidth, barcodeMeta.addHeight);
			imageObj.src = barcodeMeta.imgData;
			imageObj.onload = function(){selectHatioShape(editHatioGroup, true, true); layer.draw();}
		}else if(editHatioGroup.attrs.shapeType=='TextShape'){
			var text = editHatioGroup.get(".hatioShape")[0];
			text.setText(editHatioGroup.attrs.barcodeMeta.data);
			layer.draw();
			selectHatioShape(editHatioGroup, true, true);
		}
		
		hatioGroupRevised();
	}
	
	if(event.target.name && event.target.name=='rotation'){
		var degree;
		if(editHatioGroup.attrs.barcodeMeta.oldRotation){
			degree = editHatioGroup.attrs.barcodeMeta.rotation - editHatioGroup.attrs.barcodeMeta.oldRotation;
		}else{
			degree = editHatioGroup.attrs.barcodeMeta.rotation
		}
		editHatioGroup.attrs.barcodeMeta.oldRotation = editHatioGroup.attrs.barcodeMeta.rotation;
		editHatioGroup.rotate(degree/90 * Math.PI/2);
		layer.draw();
	}
	
	if(event.target.id && (event.target.id=='cmWidth' || event.target.id=='cmHeight')){
		var hatioShape = editHatioGroup.get(".hatioShape")[0];
		var hatioShape2 = editHatioGroup.get(".hatioShape2")[0];
		var reWidth = mmlValueToPixel(editHatioGroup.attrs.barcodeMeta.cmWidth);
		var reHeight = mmlValueToPixel(editHatioGroup.attrs.barcodeMeta.cmHeight);
		editHatioGroup.setSize(reWidth, reHeight);
		hatioShape.setSize(reWidth, reHeight);
		if(hatioShape2){
			hatioShape2.setSize(reWidth, reHeight);
			if(editHatioGroup.attrs.shapeType=='EllipseShape'){
				hatioShape2.setPosition(reWidth/2, reHeight/2);		
			}
		}
		selectHatioShape(editHatioGroup, true, true);
		layer.draw();
	}
	
	if(event.target.id && (event.target.id=='cmX' || event.target.id=='cmY')){
		var reX = mmlValueToPixel(editHatioGroup.attrs.barcodeMeta.cmX) + contentBox.getX();
		var reY = mmlValueToPixel(editHatioGroup.attrs.barcodeMeta.cmY) + contentBox.getY();
		editHatioGroup.setPosition(reX, reY);
		selectHatioShape(editHatioGroup, true, true);
		layer.draw();
	}
	
	if(event.target.id && event.target.id=='thickness'){
		var hatioShape = editHatioGroup.get(".hatioShape")[0];
		var hatioShape2 = editHatioGroup.get(".hatioShape2")[0];
		if(hatioShape2){
			hatioShape2.setStrokeWidth(editHatioGroup.attrs.barcodeMeta.thickness);
		}else{
			hatioShape.setStrokeWidth(editHatioGroup.attrs.barcodeMeta.thickness);
		}
		
		layer.draw();
	}
	
	if(event.target.id && event.target.id=='fontSize'){
		var hatioShape = editHatioGroup.get(".hatioShape")[0];
		hatioShape.setFontSize(editHatioGroup.attrs.barcodeMeta.fontSize);
		selectHatioShape(editHatioGroup, true, true);
		layer.draw();
	}
}

function hatioGroupRevised(){
	for(var i=0; i<currentShapes.length; i++){
		var hatioGroup = currentShapes[i];
		if(hatioGroup){
			try{
				var afWidth;
				var afHeight;
				var hatioShape = hatioGroup.get(".hatioShape")[0];
				var hatioShape2 = hatioGroup.get(".hatioShape2")[0];
				if(hatioShape2){
	    			afWidth = hatioShape2.getWidth();
	    			afHeight = hatioShape2.getHeight();
	    		}else{
	    			afWidth = hatioShape.getWidth();
	    			afHeight = hatioShape.getHeight();
	    		}
	    		
				hatioGroup.attrs.barcodeMeta.cmWidth = pixelValueTomm(afWidth * hatioGroup.getScale().x);
				hatioGroup.attrs.barcodeMeta.cmHeight = pixelValueTomm(afHeight * hatioGroup.getScale().y);
				hatioGroup.attrs.barcodeMeta.cmX = pixelValueTomm(hatioGroup.getX()-contentBox.getX());
				hatioGroup.attrs.barcodeMeta.cmY = pixelValueTomm(hatioGroup.getY()-contentBox.getY());
				if(hatioGroup==editHatioGroup){
					$("#propertyDiv #cmWidth").val(hatioGroup.attrs.barcodeMeta.cmWidth);
					$("#propertyDiv #cmHeight").val(hatioGroup.attrs.barcodeMeta.cmHeight);
					$("#propertyDiv #cmX").val(hatioGroup.attrs.barcodeMeta.cmX);
					$("#propertyDiv #cmY").val(hatioGroup.attrs.barcodeMeta.cmY);	
				}
			}catch(e){
				
			}
		}
	}
}

function paperPropertyChange(event){
	if(event.target.name){
		contentBox.attrs.barcodeMeta[event.target.name] = event.target.value;
	}else{
		contentBox.attrs.barcodeMeta[event.target.id] = event.target.value;
	}
	if(event.target.id && (event.target.id=='labelWidth' || event.target.id=='labelHeight')){
		var afWidth = mmlValueToPixel(contentBox.attrs.barcodeMeta.labelWidth);
		var afHeight = mmlValueToPixel(contentBox.attrs.barcodeMeta.labelHeight);
		contentBox.setSize(afWidth, afHeight);
		contentBox.setPosition(stage.getWidth()/2-afWidth/2, stage.getHeight()/2-afHeight/2);
		contentBoxUnSelection();
		contentBoxSelection();
		layer.draw();
		horRulerContent.setWidth(contentBox.getWidth());
	    horRulerContent.setX(contentBox.getX());
	    verRulerContent.setHeight(contentBox.getHeight());
	    verRulerContent.setY(contentBox.getY());
	    rulerLayer.draw();
	}
}

function paperRevised(){
	contentBox.attrs.barcodeMeta.labelWidth = pixelValueTomm(contentBox.getWidth());
	contentBox.attrs.barcodeMeta.labelHeight = pixelValueTomm(contentBox.getHeight());
	$("#propertyDiv #labelWidth").val(contentBox.attrs.barcodeMeta.labelWidth);
	$("#propertyDiv #labelHeight").val(contentBox.attrs.barcodeMeta.labelHeight);
}

var bracodePropertyEditor = '<div id="propertyDiv"> '+
							'<table border=0 cellpading=0 cellspacing=0><tr> '+
							'	<td> '+
							'		<table border=0 cellpading=0 cellspacing=0> '+
							'			<tr><th>BarcodeType<td><input id="barcodeType" type="text" style="width:63ex" readonly></td></th></tr> '+
							'			<tr><th>Barcode Paramter<td><input id="barcodeParamter" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>HorizontalScale<td><input id="horizontalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>VerticalScale<td><input id="verticalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Data<td><input id="data" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Field<td><input id="field" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Print Interpretaion Line</th> '+
							'				<td> '+
							'					<label for="rotN_k"><input type="radio" name="printInterpretaionLine" value="0" id="printInterpretaionLine0" checked>0</label> '+
							'					<label for="rotR_k"><input type="radio" name="printInterpretaionLine" value="1" id="printInterpretaionLine1">1</label> '+
							'					<label for="rotL_k"><input type="radio" name="printInterpretaionLine" value="2" id="printInterpretaionLine2">2 </label> '+
							'				</td> '+
							'			</tr> '+
							'			<tr><th>Print InterPretaion Parameters<td><input id="printInterPretaionParameters" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Width<td><input id="cmWidth" type="text" style="width:63ex" readonly></td></th></tr> '+
							'			<tr><th>Height<td><input id="cmHeight" type="text" style="width:63ex" readonly></td></th></tr> '+
							'			<tr><th>X Pos<td><input id="cmX" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Y Pos<td><input id="cmY" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th width="30%">Rotation</th> '+
							'				<td> '+
							'					<label for="rotN_k"><input type="radio" name="rotation" value="0" id="rotation0" checked>0 </label> '+
							'					<label for="rotR_k"><input type="radio" name="rotation" value="90" id="rotation90">90 </label> '+
							'					<label for="rotL_k"><input type="radio" name="rotation" value="180" id="rotation180">180 </label> '+
							'					<label for="rotI_k"><input type="radio" name="rotation" value="270" id="rotation270">270 </label> '+
							'				</td> '+
							'			</tr> '+
							'		</table> '+
							'</table> '+
						    '</div>';
						    
var ploygonPropertyEditor = '<div id="propertyDiv"> '+
							'<table border=0 cellpading=0 cellspacing=0><tr> '+
							'	<td> '+
							'		<table border=0 cellpading=0 cellspacing=0> '+
							'			<tr><th>HorizontalScale<td><input id="horizontalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>VerticalScale<td><input id="verticalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Thickness<td><input id="thickness" type="number" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Width<td><input id="cmWidth" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Height<td><input id="cmHeight" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>X Pos<td><input id="cmX" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Y Pos<td><input id="cmY" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th width="30%">Rotation</th> '+
							'				<td> '+
							'					<label for="rotN_k"><input type="radio" name="rotation" value="0" id="rotation0" checked>0 </label> '+
							'					<label for="rotR_k"><input type="radio" name="rotation" value="90" id="rotation90">90 </label> '+
							'					<label for="rotL_k"><input type="radio" name="rotation" value="180" id="rotation180">180 </label> '+
							'					<label for="rotI_k"><input type="radio" name="rotation" value="270" id="rotation270">270 </label> '+
							'				</td> '+
							'			</tr> '+
							'		</table> '+
							'</table> '+
						    '</div>';
						    
var linePropertyEditor =    '<div id="propertyDiv"> '+
							'<table border=0 cellpading=0 cellspacing=0><tr> '+
							'	<td> '+
							'		<table border=0 cellpading=0 cellspacing=0> '+
							'			<tr><th>HorizontalScale<td><input id="horizontalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>VerticalScale<td><input id="verticalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Thickness<td><input id="thickness" type="number" style="width:63ex"></td></th></tr> '+
							'			<tr><th>X Pos<td><input id="cmX" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Y Pos<td><input id="cmY" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th width="30%">Rotation</th> '+
							'				<td> '+
							'					<label for="rotN_k"><input type="radio" name="rotation" value="0" id="rotation0" checked>0 </label> '+
							'					<label for="rotR_k"><input type="radio" name="rotation" value="90" id="rotation90">90 </label> '+
							'					<label for="rotL_k"><input type="radio" name="rotation" value="180" id="rotation180">180 </label> '+
							'					<label for="rotI_k"><input type="radio" name="rotation" value="270" id="rotation270">270 </label> '+
							'				</td> '+
							'			</tr> '+
							'		</table> '+
							'</table> '+
						    '</div>';
						    
var textPropertyEditor =    '<div id="propertyDiv"> '+
							'<table border=0 cellpading=0 cellspacing=0><tr> '+
							'	<td> '+
							'		<table border=0 cellpading=0 cellspacing=0> '+
							'			<tr><th>Data<td><input id="data" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Font Size<td><input id="fontSize" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>HorizontalScale<td><input id="horizontalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>VerticalScale<td><input id="verticalScale" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>X Pos<td><input id="cmX" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Y Pos<td><input id="cmY" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th width="30%">Rotation</th> '+
							'				<td> '+
							'					<label for="rotN_k"><input type="radio" name="rotation" value="0" id="rotation0" checked>0 </label> '+
							'					<label for="rotR_k"><input type="radio" name="rotation" value="90" id="rotation90">90 </label> '+
							'					<label for="rotL_k"><input type="radio" name="rotation" value="180" id="rotation180">180 </label> '+
							'					<label for="rotI_k"><input type="radio" name="rotation" value="270" id="rotation270">270 </label> '+
							'				</td> '+
							'			</tr> '+
							'		</table> '+
							'</table> '+
						    '</div>';
						    
var paperPropertyEditor =   '<div id="propertyDiv"> '+
							'<table border=0 cellpading=0 cellspacing=0><tr> '+
							'	<td> '+
							'		<table border=0 cellpading=0 cellspacing=0> '+
							'			<tr><th width="30%">DPI</th> '+
							'				<td> '+
							'					<label><input type="radio" name="dpi" value="200" id="dpi200" checked>200 </label> '+
							'					<label><input type="radio" name="dpi" value="300" id="dpi300">300 </label> '+
							'					<label><input type="radio" name="dpi" value="600" id="dpi600">600 </label> '+
							'				</td> '+
							'			</tr> '+
							'			<tr><th>Lable Width<td><input id="labelWidth" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Lable Height<td><input id="labelHeight" type="text" style="width:63ex"></td></th></tr> '+
							'			<tr><th>Lable Unit<td><input id="labelUnit" type="text" style="width:63ex" value="cm" readonly></td></th></tr> '+
							'			<tr><th width="30%">Rotated</th> '+
							'				<td> '+
							'					<label><input type="radio" name="rotated" value="true" id="rotatedTrue" checked>true </label> '+
							'					<label><input type="radio" name="rotated" value="false" id="rotatedFalse">false </label> '+
							'				</td> '+
							'			</tr> '+
							'		</table> '+
							'</table> '+
						    '</div>';
/*-------------------------------property end----------------------------------*/
