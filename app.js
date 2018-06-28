const express = require('express')
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const getGifs = async (query="cats") => {
  try {
    const url = "https://api.giphy.com/v1/gifs/search";
    const response = await axios({
      url,
      method: 'get',
      params: {
        api_key: 'a0PNjGEVofdNdLAo5Xeh0mcNcKea716v',
        q: query,
        limit: 25,
        offset: 0,
        rating: 'G',
        lang: 'en'
      }
    })
    return response.data.data;
  } catch (error) {
    console.log("error: \n");
    console.error(error);
  }
}

// async middleware to be used on async route cb fns
// great because we dont need a try/catch block in async routes
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.get('/', (req, res) => res.render(path.join(__dirname, 'index')));
app.get('/search', (req, res) => res.redirect('/')); // redirect reloads from search post
app.post('/search', asyncMiddleware( async (req, res, next) => {
  // console.log(req.body);
  const data = await getGifs();
  console.log("here's the data \n");
  console.log(data);
  res.status(200).render(path.join(__dirname, 'index'), { data });
}));


app.listen(3000, () => console.log('Example app listening on port 3000!'))
