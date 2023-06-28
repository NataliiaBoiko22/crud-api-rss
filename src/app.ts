import http, { IncomingMessage, ServerResponse } from "http";
import { InMemoryDB } from "./database/inMemoryDatabase";
import { UserId } from "./models/models";

const PORT = process.env.PORT || 4000;

export const runServer = (userDB: InMemoryDB) => {
  const server = http.createServer(
    (request: IncomingMessage, response: ServerResponse) => {
      const { url, method } = request;

      try {
        const urlArray = (url as string).split("/").filter((item) => item);
        const userId: UserId = urlArray[2];
      } catch (error) {
        console.log(error as Error, response);
      }
    }
  );

  server.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT} http://localhost:${PORT}/`);
  });

  server.on("error", (error) => {
    console.log("Error http server", error);
  });
};
