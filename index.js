const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI =
  "mongodb+srv://url";
const user = {
  nane: String,
  lastname: String,
};

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = await client.db("users");

  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const me = Object.create(user);
  me.name = event.queryStringParameters.name;
  me.lastname = event.queryStringParameters.lastname;

  const db = await connectToDatabase();
  const result = await db
    .collection("customers")
    .insertOne(me);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  return response;
};
