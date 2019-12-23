'use strict';
//const d3 = require("d3");
//const GeoTIFF = require('geotiff');
//paint(5,6,12);
import * as d3 from "d3";
import GeoTIFF from 'geotiff';

export function paint(z, x, y, rangeMin, rangeMax){
  //gdal labels tile differently, so we have to re-calculate them to match mapbox tile
  var z_gdal=6-z;
  var x_gdal=y+1;
      if (z>3 & x_gdal<10) { x_gdal="0"+x_gdal;}
  var y_gdal=x+1;
    if (z>3 & y_gdal<10) { y_gdal="0"+y_gdal;}
   
  //With x,y, and z, we now have a path from which to retrieve the geotiff tile
  var url="https://s3.amazonaws.com/cogs.earthpeel.com/gdaltiles_1km_v8/"+z_gdal+"/BDTICM_M_1km_ll_srs3857c_"+x_gdal+"_"+y_gdal+".tif";
  

  GeoTIFF.fromUrl(url)
    .then( tiff => tiff.getImage() ) 
    .then( tileImage => tileImage.readRasters() )
    .then( tileReadRasters => {
      var tileValues = tileReadRasters[0];// Finally, we have an array of values for each pixel in the geotiff tile
      //QC://console.log(tileValues[12]);
      
      //Compute the range of values. 
      var tileRange=[100000000, 1];
      for (var i=0; i<tileValues.length; i++)
        {
          if(tileValues[i]<1){continue;}//Minimum is limited to 1 because we will use a log color scale in this case
          if (tileValues[i]<tileRange[0]){tileRange[0]=tileValues[i];}
          if (tileValues[i]>tileRange[1]){tileRange[1]=tileValues[i];}
        }
      //QC://console.log(tileRange);

      //Use this range to compute color values for each pixel
      var tileScale= d3.scaleLinear();
      tileScale
        //.domain([Math.log(tileRange[0]), Math.log(tileRange[1])])
        .domain([Math.log(rangeMin), Math.log(rangeMax)])
        .range([0, 1]);

      var tileColor=[];
      for (var i=0; i<tileValues.length; i++) {
        tileColor[i]=d3.interpolateYlGnBu(tileScale(Math.log(tileValues[i])));
      }
      
      //QC://console.log(tileColor[12]);
    
      //Now draw pixels on a canvas
      var displayDiv=document.getElementById('map');
      //var canvas = addChild(displayDiv, 'canvas', 'dsiplay-canvas');
      var canvas = document.createElement('canvas');
      canvas.classList.add('display-canvas');
      displayDiv.appendChild(canvas);
      canvas.width = 512;
      canvas.height = 512;

      const ctx = canvas.getContext('2d');
      const imageData=ctx.createImageData(512,512);
      var k=0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        k=i/4;
        // Modify pixel data. 
        //The color of each pixel is coded based on a color bar and the depth value at that pixel. See the 'color' cell.
        imageData.data[i + 0] = d3.rgb(tileColor[k]).r;  // R value
        imageData.data[i + 1] = d3.rgb(tileColor[k]).g;    // G value
        imageData.data[i + 2] = d3.rgb(tileColor[k]).b;  // B value
        imageData.data[i + 3] = 255;  // A value
      }
      //console.log(imageData[48]);
      ctx.putImageData(imageData,0,0);
      return ctx;

    });
}

