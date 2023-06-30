import http, { IncomingMessage, ServerResponse } from "http";
import { InMemoryDB } from "../database/inMemoryDatabase";
import { UserId } from "../models/models";
import { getHandle } from "../handlers/endpoints";
import { handleErrors } from "../helpers/errors";
const PORT = process.env.PORT || 4000;

export const runServer = (userDB: InMemoryDB) => {
  const server = http.createServer(
    (request: IncomingMessage, response: ServerResponse) => {
      const { url, method } = request;

      try {
        const urlArray = (url as string).split("/").filter((item) => item);
        const handle = getHandle(method, urlArray, url, response);
        const userId: UserId = urlArray[2];
        handle(request, response, userId, userDB).catch((error: unknown) =>
          handleErrors(error as Error, response)
        );
      } catch (error) {
        handleErrors(error as Error, response);
      }
    }
  );

  server.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT} http://localhost:${PORT}/`);
  });

  server.on("error", (error) => {
    console.log("Error http server", error);
  });
  return server;
};
