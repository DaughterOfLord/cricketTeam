const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbObject = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbObject,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API-1
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};


app.get("/players/", async (request, response) => {
  const playersArrayList = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY
      player_id;`;
  const playersArray = await db.all(playersArrayList);
  response.send(playersArray);
});

app.get("/players/:playerId/", async (request, response) => {
  const { bookId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      book_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API-2

app.post("/players/", async (request, response) => {
    const playerDetails = request.body;
    const { playerName, jerseyNumber, role } = playerDetails;
    const addPlayerQuery = `INSERT INTO cricket_team (playerName, jerseyNumber, role)
        VALUES (
            '${playerName}',
            '${jerseyNumber}',
            '${role}'
        );`;
    const dbResponse = await db.run(addPlayerQuery);
    const playerId = dbResponse.jerseyNumber;
    response.send({playerId : playerId});
});


module.exports = app;