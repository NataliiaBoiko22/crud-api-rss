import { HTTPError } from "../helpers/errors";
import { UserId } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { validate as uuidValidate } from "uuid";

import { IMemoryDB } from "../database/inMemoryDatabase";

export const getUsers = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId,
  userDB: IMemoryDB
): Promise<unknown> => {
  try {
    if (!userId) {
      const users = userDB.getAll();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
      return;
    }

    const correctUserId = userId as string;

    if (!uuidValidate(correctUserId))
      throw new HTTPError(`UserId ${correctUserId} is invalid. Not uuid.`, 400);

    const user = userDB.get(correctUserId);

    if (user === null) {
      throw new HTTPError(`User with id ${correctUserId} doesn't exist.`, 404);
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    if (error instanceof HTTPError) {
      res.writeHead(error.statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    } else if (error instanceof Error && error.message.includes("UserId")) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: error.message,
        })
      );
    } else if (
      error instanceof Error &&
      error.message.includes("User with id")
    ) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
};
