const download = require("download");

// check EDP file
export const ValidDate = async({ epdUrl }) => {

  await Promise.all(
    download(epdUrl, "dist")
  )
  
};


