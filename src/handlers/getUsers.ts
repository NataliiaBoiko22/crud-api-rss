import { HTTPError } from '../helpers/errors';
import { UserId } from '../models/models';
import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { handleErrors } from '../helpers/errors';
import { IMemoryDB } from '../database/inMemoryDatabase';

export const getUsers = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId,
  userDB: IMemoryDB,
): Promise<unknown> => {
  try {
    if (!userId) {
      const users = userDB.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
      return;
    }
    const correctUserId = userId as string;
    if (!uuidValidate(correctUserId))
      throw new HTTPError(`UserId ${correctUserId} is invalid. Not uuid.`, 400);
    const user = userDB.get(correctUserId);
    if (user === null) {
      throw new HTTPError(
        `User with id === ${correctUserId} doesn't exist.`,
        404,
      );
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch (error) {
    handleErrors(error, res);
  }
};
