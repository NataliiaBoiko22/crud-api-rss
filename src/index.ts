import { InMemoryDB } from './database/inMemoryDatabase';
import { runServer } from './server/app';

const userDB = new InMemoryDB();

export const startApp = (function () {
  runServer(userDB);
})();
