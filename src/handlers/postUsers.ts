import { HTTPError } from "../helpers/errors";
import { checkUserObject, getRequestData } from "../helpers/helper";
import { IUser } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { handleErrors } from "../helpers/errors";
import { IMemoryDB } from "../database/inMemoryDatabase";

export const postUsers = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
  userDB: IMemoryDB
): Promise<void> => {
  try {
    const userObject = await getRequestData(req);
    const isCorrectUser = checkUserObject(userObject);
    if (!isCorrectUser) {
      throw new HTTPError(`User object does not contain required fields.`, 400);
    }
    const user = userDB.add(userObject as IUser);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    handleErrors(error, res);
  }
};
