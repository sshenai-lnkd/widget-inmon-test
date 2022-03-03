const express = require('express');
var bodyParser = require('body-parser')
 
const app = express();
const port = 3000;


app.use(express.static('./'));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log('ATS Simulator running on port 3000');
});