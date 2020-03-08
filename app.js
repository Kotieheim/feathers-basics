const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");

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

const app = express(feathers());

//JSON body parser
app.use(express.json());
// URL-encode params
app.use(express.urlencoded({ extended: true }));
// Host static files from current dirname/folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register an in-memory messgas service
app.use("/messages", new MessageService());
// Register a nicer error handler
// than the default Express one
app.use(express.errorHandler());

// Add any real-time connection the the 'everybody' channel
app.on("connection", connection => {
  app.channel("everybody").join(connection);
});
// Publish all events to the 'everybody' channel
app.publish(data => app.channel("everybody"));

// Start the server
app.listen(3030).on("listening", () => {
  console.log(`Feathers server listening on localhost:3030`);
});

// For good measuure, create a message so
// Our API doesn't appear empty

app.service("messages").create({
  text: "Hello world from the server"
});
