import { InMemoryDB } from "./database/inMemoryDatabase";
import { runServer } from "./app";

const userDB = new InMemoryDB();

export const startApp = (function () {
  runServer(userDB);
})();
