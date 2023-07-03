import { IUser } from '../models/models';
import { HTTPError } from '../helpers/errors';
import { handleErrors } from '../helpers/errors';
import { getRequestData, checkUserObject } from '../helpers/helper';
import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';

import { IMemoryDB } from '../database/inMemoryDatabase';

export const putUsers = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
  userDB: IMemoryDB,
): Promise<void> => {
  const correctUserId = userId as string;

  try {
    if (!uuidValidate(correctUserId))
      throw new HTTPError(
        `UserId === ${correctUserId} is invalid (not uuid).`,
        400,
      );
    const user = userDB.get(correctUserId);
    if (user === null)
      throw new HTTPError(
        `User with id === ${correctUserId} doesn't exist.`,
        404,
      );
    const userObject = await getRequestData(req);
    const isCorrectUser = checkUserObject(userObject);
    if (!isCorrectUser) {
      throw new HTTPError(`User object does not contain required fields.`, 400);
    }
    const newUser = userDB.update(correctUserId, userObject as IUser);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch (error) {
    handleErrors(error, res);
  }
};
