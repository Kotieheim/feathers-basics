const feathers = require("@feathersjs/feathers");
const app = feathers();

class MessageService {
  constructor() {
    this.messages = [];
  }

  async find() {
    // return all messages
    return this.messages;
  }
  async create(data) {
    // new message is merged with a unique
    // ID using the messages length since
    // it changes whenever add one
    const message = {
      id: this.messages.length,
      text: data.text
    };
    // add new message onto initial constructor array

    this.messages.push(message);
    return message;
  }
}

// Register the mssage service on the feathers app
app.use("messages", new MessageService());

// Log every time a new message is made
app.service("messages").on("created", message => {
  console.log("A new message has been created", message);
});

// A function that creates new messages and then
// logs all existing mesages

const main = async () => {
  // Create a new message on our message service
  await app.service("messages").create({
    text: "Hello Feathers"
  });

  await app.service("messages").create({
    text: "Hello again"
  });

  // Find all existing messages
  const messages = await app.service("messages").find();

  console.log("All messages", messages);
};

main();
