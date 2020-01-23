const express = require('express');
const next = require('next');
const { join } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handleNextRequests = app.getRequestHandler();

// https://gist.github.com/henrik/1688572
const euCountries = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
  'GF',
  'GP',
  'MQ',
  'ME',
  'YT',
  'RE',
  'MF',
  'GI',
  'AX',
  'PM',
  'GL',
  'BL',
  'SX',
  'AW',
  'CW',
  'WF',
  'PF',
  'NC',
  'TF',
  'AI',
  'BM',
  'IO',
  'VG',
  'KY',
  'FK',
  'MS',
  'PN',
  'SH',
  'GS',
  'TC',
  'AD',
  'LI',
  'MC',
  'SM',
  'VA',
  'JE',
  'GG',
  'GI',
  'IM',
];

const handle = (req, res) => {
  // Check country code of user IP as supplied by Cloudflare
  const country_code = req.header('CF-IPCountry');
  // Set session cookie for cookie consent for non-EU users to not annoy
  // them with a cookie consent popup that is nor legally required for
  // their country
  if (!euCountries.includes(country_code)) res.cookie('cookie_consent', true);
  handleNextRequests(req, res);
};

const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();
    // https://github.com/zeit/next.js/wiki/Getting-ready-for-production

    server.use(express.static('public'));

    server.get('/service-worker.js', (req, res) => {
      const filePath = join(__dirname, '.next', '/service-worker.js');
      app.serveStatic(req, res, filePath);
    });

    server.get('/:tag/@:author/:permlink', (req, res) => {
      const { author } = req.params;
      const { permlink } = req.params;
      res.redirect(`/@${author}/${permlink}`);
    });

    server.get('/featured', (req, res) => {
      res.redirect(`/`);
    });

    server.get('/tag', (req, res) => {
      res.redirect(`/topics`);
    });

    server.get('/steemfest', (req, res) => {
      res.redirect(`/destinations/thailand/Bangkok`);
    });

    server.get('/created/:tag', (req, res) => {
      const { tag } = req.params;
      res.redirect(`/topics/${tag}`);
    });

    server.get('/trending/:tag', (req, res) => {
      const { tag } = req.params;
      res.redirect(`/topics/${tag}`);
    });

    server.get('/hot/:tag', (req, res) => {
      const { tag } = req.params;
      res.redirect(`/topics/${tag}`);
    });

    server.get('/favorites/:tag', (req, res) => {
      const { tag } = req.params;
      res.redirect(`/topics/${tag}`);
    });

    server.get('/featured/:tag', (req, res) => {
      const { tag } = req.params;
      res.redirect(`/topics/${tag}`);
    });

    server.get('/blog', (req, res) => {
      res.redirect('/@travelfeed');
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      // eslint-disable-next-line no-console
      console.log(`Listening on Port ${port}`);
    });
  })
  .catch(ex => {
    // eslint-disable-next-line no-console
    console.error(ex.stack);
    process.exit(1);
  });
