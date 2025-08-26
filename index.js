require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

const urlDatabase = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const findUrl = (url) => {
  return urlDatabase.find(item => item.shortUrl === parseInt(url) || item.longUrl === url);
}

app.post('/api/shorturl', (req, res) => {
  let longUrl = req.body.url;
  let shortUrl = urlDatabase.length + 1;
  const existing = findUrl(longUrl);
  if (!existing) {
    urlDatabase.push({ longUrl: longUrl, shortUrl: shortUrl });
    res.json(urlDatabase[urlDatabase.length - 1]);
  } else {
    res.json( existing);
  }
})

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const reqshortUrl = req.params.shortUrl;
  const originalUrl = findUrl(reqshortUrl);
  if (originalUrl){
    res.redirect(originalUrl.longUrl);
  }else{
    res.json({error: "Short URL not found"});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
