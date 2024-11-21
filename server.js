import pkg from 'json-server';
const { create, router: jsonServerRouter, defaults, bodyParser } = pkg;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// console.log(create, router, defaults);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = create();
const router = jsonServerRouter(join(__dirname, 'db.json'));
const middlewares = defaults();

// Добавляем timestamp к логам
server.use(bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    switch (req.path) {
      case '/logs':
      case '/accounts':
      case '/gifts':
        req.body.createdAt = new Date().toISOString();
        req.body.updatedAt = new Date().toISOString();
        break;
      case '/twoFactorAuth':
        req.body.createdAt = new Date().toISOString();
        break;
    }
  }
  next();
});

// Добавляем кастомные маршруты
server.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/accounts/authenticated') {
    const db = router.db;
    const authenticatedAccounts = db.get('accounts')
      .filter({ isAuthenticated: true })
      .value();
    res.json(authenticatedAccounts);
    return;
  }
  next();
});

// Добавляем валидацию
server.use((req, res, next) => {
  if (req.method === 'POST') {
    switch (req.path) {
      case '/accounts':
        if (!req.body.login || !req.body.password || !req.body.region) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }
        break;
      case '/gifts':
        if (!req.body.title || !req.body.link || typeof req.body.price !== 'number') {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }
        break;
      case '/twoFactorAuth':
        if (!req.body.accountId || !req.body.sharedSecret) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }
        break;
    }
  }
  next();
});

// Добавляем сортировку по умолчанию
server.use((req, res, next) => {
  if (req.method === 'GET') {
    switch (req.path) {
      case '/logs':
        if (!req.query._sort) {
          req.query._sort = 'timestamp';
          req.query._order = 'desc';
        }
        break;
      case '/accounts':
      case '/gifts':
        if (!req.query._sort) {
          req.query._sort = 'createdAt';
          req.query._order = 'desc';
        }
        break;
    }
  }
  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.JSON_SERVER_PORT || 3001;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

// Обработка ошибок
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
}); 