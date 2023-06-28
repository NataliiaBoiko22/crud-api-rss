import { IUser } from "../models/models";
import { getRequestData, checkUserObject } from "../helpers/helper";
import { HTTPError } from "../helpers/errors";
import { IncomingMessage, ServerResponse } from "http";
import { validate as uuidValidate } from "uuid";

import { IMemoryDB } from "../database/inMemoryDatabase";

// export const putUsers = async (
//   req: IncomingMessage,
//   res: ServerResponse,
//   userId: string,
//   userDB: IMemoryDB
// ): Promise<void> => {
//   const correctUserId = userId as string;

//   try {
//     if (!uuidValidate(correctUserId))
//       throw new HTTPError(`UserId ${correctUserId} is invalid. Not uuid.`, 400);

//     const user = userDB.get(correctUserId);
//     if (user === null)
//       throw new HTTPError(`User with id ${correctUserId} doesn't exist.`, 404);

//     const userObject = await getRequestData(req);

//     const isCorrectUser = checkUserObject(userObject);

//     if (!isCorrectUser) {
//       throw new HTTPError(
//         `User object doesn't contain required fields or incorrect field`,
//         400
//       );
//     }

//     const newUser = userDB.update(correctUserId, userObject as IUser);
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify(newUser));
//   } catch (error) {
//     if (error instanceof SyntaxError) {
//       throw new HTTPError("User object is invalid", 400);
//     } else {
//       throw error;
//     }
//   }
// };
export const putUsers = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
  userDB: IMemoryDB
): Promise<void> => {
  const correctUserId = userId as string;

  try {
    if (!uuidValidate(correctUserId))
      throw new HTTPError(`UserId ${correctUserId} is invalid. Not uuid.`, 400);

    const user = userDB.get(correctUserId);
    if (user === null)
      throw new HTTPError(`User with id ${correctUserId} doesn't exist.`, 404);

    const userObject = await getRequestData(req);

    const isCorrectUser = checkUserObject(userObject);

    if (!isCorrectUser) {
      throw new HTTPError(
        `User object doesn't contain required fields or incorrect field`,
        400
      );
    }

    const newUser = userDB.update(correctUserId, userObject as IUser);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
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
