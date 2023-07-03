import { HTTPError } from '../helpers/errors';
import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { handleErrors } from '../helpers/errors';
import { IMemoryDB } from '../database/inMemoryDatabase';

export const deleteUsers = async (
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

    userDB.delete(correctUserId);

    res.statusCode = 204;
    res.end();
  } catch (error) {
    handleErrors(error, res);
  }
};
