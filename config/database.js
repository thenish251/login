const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://login:VqrCx4onwpq6UqUH@cluster0.qcforxg.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
