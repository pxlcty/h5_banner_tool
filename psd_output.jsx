

//app.activeDocument = app.documents[0]
mockup = app.documents[0]

app.activeDocument = mockup

// Pops open a dialog for the user to set the output folder ::
var outputFolder = Folder.selectDialog("Select a folder for the output files");

var outputProcess = generateOutput(mockup, outputFolder)


function generateOutput(file_ref, folderLocation){


	var layerCount = file_ref.layers.length;
	//alert("layer count is " + layerCount);

	// set all layers to invisible
	for (i = 0; i < layerCount; i++)
	{
		file_ref.layers[i].visible = false;
	}
	var fauxLayerCount = 1;

	for (i = (layerCount - 1); i > -1; i--) {
//	for (i = 0; i < layerCount; i++) {
		// saving current state
		var lockedHistoryState = file_ref.activeHistoryState;

		file_ref.activeLayer = file_ref.layers[i];
		file_ref.layers[i].visible = true;

		//setCurrentLayerSelection Ton's of 'here be dragonzes'::
			var idChnl = charIDToTypeID( "Chnl" );

			var actionSelect = new ActionReference();
			actionSelect.putProperty( idChnl, charIDToTypeID( "fsel" ) );

			var actionTransparent = new ActionReference();
			actionTransparent.putEnumerated( idChnl, idChnl, charIDToTypeID( "Trsp" ) );

			var actionDesc = new ActionDescriptor();
			actionDesc.putReference( charIDToTypeID( "null" ), actionSelect );
			actionDesc.putReference( charIDToTypeID( "T   " ), actionTransparent );

			executeAction( charIDToTypeID( "setd" ), actionDesc, DialogModes.NO );

		// end of current selection script


		function getPositionLayer( lyr ){// layerObject, Number, Number
		     // get the layer bounds
		     var layerBounds = lyr.bounds;
		     // get top left position
		     var layerX = layerBounds[0].value;
		     var layerY = layerBounds[1].value;
		     var x_y = layerX + "_" + layerY;
		     return x_y;
		     alert ("we have " + layerX + " & " + layerY);

		     // the difference between where layer needs to be and is now
		     //var deltaX = x-layerX;
		     //var deltaY = y-layerY;
		     // move the layer into position
		     //lyr.translate (deltaX, deltaY);
		}

		var xy_coords = getPositionLayer(file_ref.activeLayer);



			// cropping image before saving export file
			file_ref.crop(file_ref.selection.bounds);


			var saveLocation = folderLocation + "/";
		    //var saveLocation = "/Users/michael/imageCutter_temp/";
		    var sfw_filename = file_ref.layers[i].name;

		    sfw_filename = sfw_filename.replace(/ /g, "_"); // replaces spaces in layername with underscore
		    sfw_filename = sfw_filename.replace(/&/g, "n"); 
		    
		    


		    //alert( "layer count is " + layerCount)
		    if( fauxLayerCount < 10 ) {
		    	sfw_filename = "0" + fauxLayerCount + "_" + xy_coords + "_" + sfw_filename;
		    } else {
		    	sfw_filename = fauxLayerCount + "_" + xy_coords + "_" + sfw_filename;
		    	//sfw_filename = fauxLayerCount + "_" + sfw_filename;
		    }

		    fauxLayerCount ++;

		    var fileInstanceName = saveLocation + sfw_filename;
		    var fileInstance = File(fileInstanceName)
		    var jpgCompression = 60

		    var findJpeg = ".jpg";
		    if(file_ref.layers[i].name.indexOf(".jpg") >= 0 )
		    {
			//alert("layer name force JPEG : " + file_ref.layers[i].name);
			//var swf_filename.slice(0, -4);
			SaveForWebJpeg(fileInstance, jpgCompression);
		} else {
			SaveForWebPNG(fileInstance);
			//alert("it's a PNG " + file_ref.layers[i].name)
		}
		// reverting state to before image crop :

		file_ref.activeHistoryState = lockedHistoryState;
		file_ref.layers[i].visible = false;

		}



}

function SaveForWebPNG(saveFile) {
	pngSaveOptions = new PNGSaveOptions();
	pngSaveOptions.interlaced = false;
	activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}


function SaveForWebJpeg(saveFile,jpegQuality) {
	var sfwOptions = new ExportOptionsSaveForWeb();
   sfwOptions.format = SaveDocumentType.JPEG;
   sfwOptions.includeProfile = false;
   sfwOptions.interlaced = 0;
   sfwOptions.optimized = true;
   sfwOptions.quality = jpegQuality; //0-100
	activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);
}
