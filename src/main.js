'use strict';

import * as d3 from "d3";

//This function colors pixels on a canvas
//Accepts data values for each pixel(tileValues), min and max range for the color bar(rangeMin and rangeMax)
//Returns a painted canvas
export function geotiffPainter(tileValues, rangeMin, rangeMax){
  
  //Step1: Generate a log scale over the range of values provided
  var tileScale= d3.scaleLinear();
  tileScale
    .domain([Math.log(rangeMin), Math.log(rangeMax)])
    .range([0, 1]);

  //Step2: Determine a color for each geotiff value based on this log scale 
  var tileColor=[];
  for (var i=0; i<tileValues.length; i++) {
    tileColor[i]=d3.interpolateYlGnBu(tileScale(Math.log(tileValues[i])));
  }
  
  //Step3: Color pixels on a canvas
  var displayDiv=document.getElementById('map');
  var canvas=document.createElement('canvas');
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
  ctx.putImageData(imageData,0,0);
  
  //Step4: Return a 512x512 px canvas with each pixel colored based on data value at that pixel (tileValues) and colorbar (rangeMin and rangeMax)
  return ctx;
}
