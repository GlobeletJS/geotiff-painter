'use strict';

import GeoTIFF from 'geotiff';
import * as geotiffPainter from "../../dist/geotiff-painter.bundle.js";

export function paint(z, x, y, rangeMin, rangeMax){
  //gdal labels tile differently, so we have to re-calculate them to match mapbox tile
  var z_gdal=6-z;
  var x_gdal=y+1;
      if (z>3 & x_gdal<10) { x_gdal="0"+x_gdal;}
  var y_gdal=x+1;
    if (z>3 & y_gdal<10) { y_gdal="0"+y_gdal;}
   
  //With x,y, and z, we now have a path from which to retrieve the geotiff tile
  var url="https://s3.amazonaws.com/cogs.earthpeel.com/gdaltiles_1km_v8/"+z_gdal+"/BDTICM_M_1km_ll_srs3857c_"+x_gdal+"_"+y_gdal+".tif";
  
  //Retrieve geotiff, extract values
  GeoTIFF.fromUrl(url)
    .then( tiff => tiff.getImage() ) 
    .then( tileImage => tileImage.readRasters() )
    .then( tileReadRasters => {
      var tileValues = tileReadRasters[0];// Finally, we have an array of values for each pixel in the geotiff tile
      //Call a function to draw geotiff data on a canvas
      return(geotiffPainter.geotiffPainter(tileValues, rangeMin, rangeMax));

    });
}

