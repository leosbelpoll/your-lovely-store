import { request } from "graphql-request";
import { User } from "../entity/User";
import { startServer } from "../startServer";

let getHost: any;
let conn: any;

beforeAll(async () => {
  let port: number;
  const { app, connection } = await startServer();
  conn = connection;
  const address = app.address();
  if (address !== null && typeof address === "object") port = address.port;
  else throw Error("App address is not an object");
  getHost = () => `http://localhost:${port}`;
});

afterAll(async () => {
  conn.close();
});

const email = "test1@app.com";
const password = "1234";

const mutation = `
    mutation {
        register(email: "${email}", password: "${password}")
    }
`;

test("Register user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ email });
  expect(users.length).toEqual(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
