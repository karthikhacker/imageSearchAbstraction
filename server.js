const express = require('express');
const mongoose = require('mongoose');
const Term = require('./models/time');
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://karthik.hacker:hacker24@ds263639.mlab.com:63639/imagesearchengine' || 'mongodb://localhost:27017/imagesearch',(err) => {
   if(err){
     console.log(err);
   }else{
     console.log('mongodb connected.');
   }
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
//get images
app.get('/api/imagesearch/:term',(req,res) => {
  var term = req.params.term;
  var newTerm = new Term({
     term:term
  });
  newTerm.save((err,data) => {
    if(err) throw err;
    let url = `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${term}`;
    if (req.query.offset) {
        url += `&count=${req.query.offset}`
     }

     fetch(url,{
       'headers':{
          method : 'GET',
          'Ocp-Apim-Subscription-Key' : '388d643dc2844f55b83d50f2ceb3dde4',
           hostname : 'https://api.cognitive.microsoft.com'
       }
     })
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then(function(data) {
        const bingImage = [];
        for(i = 0; i < 10; i++){
          bingImage.push({
            url: data.value[i].webSearchUrl,
            name: data.value[i].name,
            thumbnail: data.value[i].thumbnailUrl,
            context: data.value[i].hostPageDisplayUrl
          })
        }
       res.json(bingImage);
    });

  });
});

//recent searchs
app.get('/api/recentsearch',(req,res) => {
  Term.find({},(err,data) => {
    if(err) throw err;
    res.json(data);
  });
});

//server
app.listen(port, () => {
  console.log('App running at port ', port);
});
