const express = require('express');
const bodyParser= require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use((req, res, next) => {
  var time = new Date().toString();
  console.log(`${req.method} ${req.url} at ${time}`);
  next();
});

app.get('/api/', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`[API]: Listening on port ${PORT}`);
});
