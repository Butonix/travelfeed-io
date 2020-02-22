const express = require('express');
const next = require('next');
const { join } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handleNextRequests = app.getRequestHandler();

const handle = (req, res) => {
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
      res.redirect(`/c`);
    });

    server.get('/topics', (req, res) => {
      res.redirect(`/c`);
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
