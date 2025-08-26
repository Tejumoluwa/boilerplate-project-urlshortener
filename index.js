require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
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
  return urlDatabase.find(item => item.short_url === parseInt(url) || item.original_url === url);
}

app.post('/api/shorturl', (req, res) => {
  let longUrl = req.body.url;

  dns.lookup(new URL(longUrl).hostname, (err, address) => {
    if (err){
      res.json({ error: 'invalid url' });
    } else {
      const existing = findUrl(longUrl);
      if (!existing) {
        const shortUrl = urlDatabase.length + 1;
        urlDatabase.push({ original_url: longUrl, short_url: shortUrl });
    } else {
      res.json(existing);
  }}})
})

app.get('/api/shorturl/:short_url', (req, res) => {
  const reqshortUrl = req.params.short_url;
  const originalUrl = findUrl(reqshortUrl);
  if (originalUrl){
    res.redirect(originalUrl.original_url);
  }else{
    res.json({error: "Short URL not found"});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
