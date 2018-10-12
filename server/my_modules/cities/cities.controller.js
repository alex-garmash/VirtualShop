const express = require('express');
const router = express.Router();
module.exports = router;


const path = require('path');
const fs = require('fs');
const reqPath = path.join(__dirname, '../cities/cities.json');


/*
    api routes
*/

router.get('', getCities);

async function getCities(req,res) {

    //Read JSON from relative path of this file
   await fs.readFile(reqPath , 'utf8', (err,data) =>{
        //Handle Error
        if(!err) {
            //Handle Success
            // Parse Data to JSON
            var jsonObj = JSON.parse(data);
            //console.log(jsonObj);
            //Send back as Response
            res.json(jsonObj);
        }else {
            //Handle Error
            res.json("Error: " + err )
        }
    });
}



