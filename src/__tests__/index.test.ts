import { InMemoryDB } from "../database/inMemoryDatabase";
import { runServer } from "../server/app";
import request from "supertest";
import { IUser } from "../models/models";

const db = new InMemoryDB();

const server = runServer(db);
const testUser: Omit<IUser, "id"> = {
  username: "Joanna",
  age: 30,
  hobbies: ["piano", "music"],
};
let newUser: IUser;

const app = request(server);

test("Get all records - Empty array is expected", async () => {
  db["_users"] = {};

  const response = await app.get("/api/users");

  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});

test("A new object is created by a POST api/users request (a response containing the newly created record is expected)", async () => {
  const response = await app.post("/api/users").send(testUser);

  expect(response.status).toBe(201);
  expect(response.body).toEqual({ ...testUser, id: response.body.id });
  newUser = response.body;
});

test("Retrieving a created record by ID with a GET api/user/{userId} request (the created record is expected)", async () => {
  const response = await app.get(`/api/users/${newUser.id}`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual(newUser);
});

test("Updating a created record with a PUT api/users/{userId} request (a response containing an updated object with the same id is expected)", async () => {
  const updatedUser = {
    ...newUser,
    age: 35,
    hobbies: ["piano", "music", "reading"],
  };
  const response = await app.put(`/api/users/${newUser.id}`).send(updatedUser);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedUser);
});

test("Deleting the created object by ID with a DELETE api/users/{userId} request (confirmation of successful deletion is expected)", async () => {
  const response = await app.delete(`/api/users/${newUser.id}`);

  expect(response.statusCode).toBe(204);
});

test("Retrieving a deleted object by ID with a GET api/users/{userId} request (expecting that there is no such object)", async () => {
  const response = await app.get(`/api/users/${newUser.id}`);

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    message: `User with id === ${newUser.id} doesn't exist.`,
  });
});

afterAll((done) => {
  server.close(done);
});
