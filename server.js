const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Decimal } = require("decimal.js");
const CryptoJS = require("crypto-js");
const WebSocket = require("ws");
const cors = require("cors");
const { mongoose } = require("mongoose");
const game = require("./game/gameFunction");
const user = require("./users/user");
const partner = require("./partners/partner");
const admin = require("./admin/admin");
const app = express();
const livebet = require("./users/livebet");
const trans = require("./users/trans");
const history = require("./users/history");
const cron = require("./users/cron");
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "crashfly.com"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
const server = http.createServer(app);
const io = new WebSocket.Server({ server });

async function connect() {
  try {
    const connected = await mongoose.connect(
      "mongodb+srv://ronysarker135:Rony2Sarker@cluster0.vbnhieb.mongodb.net/?retryWrites=true&w=majority"
    );
    if (connected) {
      game.streamCrashF();
      console.log("connected mongo");
      // cron.cryptoPrice();
    }
  } catch (error) {
    console.log("can't connect mongo");
    console.error(error);
  }
}

//admin
app.post("/admin/login", (req, res) => {
  admin.login(req, res);
});
app.post("/admin/user-withdraw", (req, res) => {
  admin.userWithdraw(req, res);
});
//admin end
//partner
app.post("/partner/register", (req, res) => {
  partner.register(req, res);
});
app.post("/partner/login", (req, res) => {
  partner.login(req, res);
});
app.post("/partner/balance", (req, res) => {
  partner.balance(req, res);
});
app.post("/partner/players", (req, res) => {
  partner.players(req, res);
});
app.post("/partner/withdraw", (req, res) => {
  partner.withdraw(req, res);
});
app.post("/partner/withdraw-history", (req, res) => {
  partner.withdrawHistory(req, res);
});
app.post("/partner/password", (req, res) => {
  partner.password(req, res);
});
//partner end

app.post("/register", (req, res) => {
  user.register(req, res);
});
app.post("/password", (req, res) => {
  user.password(req, res);
});
app.post("/login", (req, res) => {
  // console.log(req);
  user.login(req, res);
});
app.post("/balance", (req, res) => {
  user.balance(req, res);
});
app.post("/bet", (req, res) => {
  user.bet(req, res);
});
app.post("/cashout", (req, res) => {
  user.cashout(req, res);
});
app.post("/betlive", (req, res) => {
  livebet.getlivebet(req, res);
});
app.post("/deposit", (req, res) => {
  trans.deposit(req, res);
});
app.post("/withdraw", (req, res) => {
  trans.withdraw(req, res);
});
app.post("/deposit-history", (req, res) => {
  history.deposit(req, res);
});
app.post("/withdraw-history", (req, res) => {
  history.withdraw(req, res);
});
app.post("/game-history", (req, res) => {
  history.game(req, res);
});

app.post("/depositCheck", (req, res) => {
  trans.depositCheck(req, res);
});

io.on("connection", async (socket, req) => {
  // check existing connection and deactivate them
  const userId = parseInt(req.url.split("=")[1]);

  if (game.clients.has(userId)) {
    const ExisitngSocket = game.getWebSocketByUserId(userId);
    ExisitngSocket.close();
    game.clients.delete(game.getUserIdByWebSocket(ExisitngSocket));
  }

  // const prevClientKey = Array.from(game.clients.keys()).pop();
  const assignNumber = game.findMissingNumbers(Array.from(game.clients.keys()));

  // let newClientKey = prevClientKey;
  // if (prevClientKey !== undefined) {
  //   newClientKey++;
  // } else {
  //   newClientKey = 0;
  // }

  game.clients.set(assignNumber, socket);

  //senduserid to connected user only
  game.broadcast({ type: "socketuserId", data: assignNumber }, socket);
  // console.log(Array.from(game.clients.keys()));
  socket.on("close", function close() {
    // Remove the WebSocket connection from the set
    if (game.getUserIdByWebSocket(socket) !== null) {
      game.clients.delete(game.getUserIdByWebSocket(socket));
    }
  });
});
io.on("error", (error) => {
  console.error("Socket.io error:", error);
});
// if (connect()) {
//   game.streamCrashF();
//   // cron.deposit();
// }
connect();

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
