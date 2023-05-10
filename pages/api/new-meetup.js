// /api/new-meetup
const { MongoClient } = require("mongodb");

const handler = async (req, res) => {
  if (req.method === "POST") {
    const client = await MongoClient.connect(
      "mongodb+srv://kedarvyas02:vq3ynmYQOA25kX3o@kedarvyas.zyajmw7.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(req.body);
    console.log(result);

    client.close();

    res.status(201).json({
      message: "Meetup inserted",
    });
  }
};

export default handler;
