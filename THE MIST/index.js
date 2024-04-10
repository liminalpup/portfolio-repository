const readline = require('readline');
const readLineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

async function ask(textPrompt) {
  return new Promise((resolve, reject) =>
    readLineInterface.question(textPrompt, resolve)
  )
};

start();
class Location {
  constructor(
    name,
    description,
    availableMoves,
    availableActions,
    availableItems,
    enemies
  ) {
    this.name = name;
    this.description = description;
    this.availableMoves = availableMoves;
    this.availableCommands = availableActions;
    this.availableItems = availableItems;
    this.enemies = enemies;
  }
}

let currentLocation = "bedroom";
let inventory = [];

let firstRoom = new Location(
  "bedroom",
  `It's dark and this bedroom looks like it hasn't been occupied in years. There is a lamp in the far corner and the window on the north side is boarded shut. Cobwebs line the ceiling and dust hangs choking and heavy in the air, stinging your eyes.. \n
  Looks like the only way out is into the hallway.`,
  { n: null, e: "hallway", s: null, w: null },
  ["inspect", "take", "look"],
  { lamp: "It is a normal lamp. Y'know the kind." },
  []
);

let hallway = new Location(
  "hallway",
  `You leave the bedroom and walk out into a long corridor --- seemingly too big for the house that contained it.
  This room wasn't old and decrepit like the bedroom. It was.... interestingly well-maintained.
  Paintings adorn the walls on each side of the corridor. Beautiful ones. To the south, there is a doorway that appears to open up into a living room.\n`,
  { n: null, e: null, s: "living room", w: "bedroom" },
  ["inspect", "take"],
  {
    "oil portrait":
      "The painting seems of another time. An oil portrait of a stately looking man looking rather serious. He seems important. It has to be from a couple centuries ago..",
    "abstract painting":
      "Is... is this a real Rothko? You run your fingers over the paint marks. It's not a print, but it seems too new to be legit. Who can afford a repainted Rothko? Probably someone who has a whole decrepit house and gives all their energy and attention to their pristine art gallery... Who is this guy?"
  },
  []
)

let livingRoom = new Location(
  "living room",
  `You enter the living room. It doesn't look from this century. Cast iron pans and quirky antique signs line the walls. The only area of the room that betrays modernity is a wooden bar complete with a Kegerator, each tap topped with an antique-but-shiny handle. \n
  In the center of the living room, there is a table in the room adorned with a tapestry. On the east side of the room, there is a stone fireplace. To the west, there is a door that leads to the outside.\n`,
  { n: "hallway", e: "fireplace", s: null, w: "front yard" },
  ["take", "inspect"],
  {
    lantern: "It's a cool old lamp. Might be an antique",
    bottle: "It's a small glass bottle. It's in great condition.",
  },
  []
);

let fireplace = new Location(
  "fireplace",
  `The fireplace is made of stone and has a rocking chair in front of it. It looks as if someone was here recently. Embers still glow in the firepit. It is empty.\n
  Above the cobbled stone making up the fireplace's arch sits a rifle. `,
  { n: null, e: null, s: null, w: "living room" },
  ["inspect", "take"],
  {
    rifle:
      "An old Winchester rifle. Looks like it still functions. No ammo, though. Hmm. There's gotta be some around here somewhere...",
  },
  []
);

let frontYard = new Location(
  "front yard",
  `You step outside to the front yard. It is overgrown with weeds. There is a gravel path out to the main dirt road and you are facing west. The weather is gray and ominous. Mist and fog shroud your surroundings in all directions. If you go out to the dirt road and follow it north, it sounds like running water is close.\n `,
  { n: null, e: "living room", s: null, w: "dirt road" },
  [],
  {},
  []
);

let dirtRoad = new Location(
  "dirt road",
  `You walk out onto the dirt road. The fog and mist make it impossible to see in either direction, but the running water sound was coming form the north.\n `,
  { n: "river", e: "living room", s: null, w: null },
  [],
  {},
  []
);

let river = new Location(
  "river",
  `After walking north toward the sound of rushing water for what seems like a mile, you come across a rushing river with a bridge over it. You see a small plaque with an engraving on the bridge. It can probably give you a hint about where you are...\n `,
  { n: null, e: null, s: "dirt road", w: null },
  ["inspect"],
  {
    plaque: `The plaque reads: Henbane River - Holland Valley, Hope County, Montana`,
  },
  []
);

// ! Location Lookup
let locationLookUp = {
  bedroom: firstRoom,
  hallway: hallway,
  'living room': livingRoom,
  fireplace: fireplace,
  "front yard": frontYard,
  "dirt road": dirtRoad,
  river: river,
};

// ! Start Function

async function start() {
  const startMessage = `\n
  The frosty smell of dew on grass indicated the arrival of morning 
  before you even opened your eyes. A splitting headache sits heavy on your temples as you sit up,
  dust yourself off and try to stand.

  The house you are in is unfamiliar to you, and you don’t know how you got here. \n
  To the north, there is a window and it is boarded shut. \n
  To the east, there is the door that leads out into a hallway.. Which way would you like to go?
  \n`;

  const playerAnswer = await ask(startMessage);

  if (playerAnswer === "e") {
    let newLocation = locationLookUp[currentLocation].availableMoves[playerAnswer];
    nextRoom(newLocation);
  } else {
    console.log("You can't go that way! Try again.");
    start();
  }
};

// ! nextRoom function - this takes the newLocation from the Start Fx

logged = false;

async function nextRoom(newLocation) {

  currentLocation = newLocation;
 
  let room = locationLookUp[currentLocation];
  let items = room.availableItems;
  console.log(items)
  let roomDescription = room.description;
  
  console.log(`Your location: ${newLocation}
  ${roomDescription}`);
  
  
  console.log(`ITEMS:`)
  for (let [itemName] of Object.entries(room.availableItems)) {
    console.log(itemName);
  }
  
  
  

  let playerAnswer = await ask(`What would you like to do? \n`);
  let answerArray = playerAnswer.trim().split("");
  let moves = ["n", "s", "e", "w"];

  if (moves.includes(answerArray[0])) {
    moveCommands(answerArray[0]);
  } else if (answerArray.length >= 2) {
    roomActions(answerArray);
  } else {
    console.log("You can't do that!");
    nextRoom(currentLocation);
  }
}

// ! Move commands

function handleInvalidMove() {
console.log("\n   You can't do that! Try again... \n");
        nextRoom(currentLocation);
}
async function moveCommands(moveInput) {
  let room = locationLookUp[currentLocation]; // accesses the current location object from the locationLookUp

  switch (moveInput) { //checks user input (moveInput). 
    case "n":
      if (!room.availableMoves[moveInput]) { //if user input is not valid... 
        handleInvalidMove(); //call handleInvalidMove fx...
        return; //and stop moveCommands fx.
      }
      newArea = room.availableMoves[moveInput]; //otherwise, store the target room as the newArea...
      nextRoom(newArea); // and call the nextRoom fx with the newArea passed into it.
      break;
    case "s":
      if (!room.availableMoves[moveInput]) {
        handleInvalidMove();
        return;
      }
      newArea = room.availableMoves[moveInput];
      nextRoom(newArea);
      break;
    case "e":
      if (!room.availableMoves[moveInput]) {
        handleInvalidMove();
        return;
      }
      newArea = room.availableMoves[moveInput];
      nextRoom(newArea);
      break;
    case "w":
      if (!room.availableMoves[moveInput]) {
        handleInvalidMove();
        return;
      }
      newArea = room.availableMoves[moveInput];
      nextRoom(newArea);
      break;
  }
};

// ? TODO: finish roomActions function
function roomActions(answerArray) {
  let room = locationLookUp[currentLocation];
  let action = answerArray[0];
  let target = answerArray[1];
  let actions = room.availableActions;
  let targets = Object.keys(room.availableItems);

  if (actions && actions.includes(action)) {
    if (targets.includes(target)) {

      switch (action) {
        case "inspect":
          console.log(`You inspect the ${target}. \n
          ${locationLookUp[currentLocation]
              .availableItems[target]}`);
          nextRoom(currentLocation);
          break;
        case "take":
          if (room.availableItems && room.availableItems[target]) {
            console.log('You take the target.')
            inventory.push(target);
            delete room.availableItems[target];
      
          } else {
            console.log("This item cannot be taken");
          }
          nextRoom(currentLocation);
          break;
        default:
          console.log(`Can't perform that action "${action}" on "${target}". Try again..`);
      }
    } else {
      console.log(`${target} is not available to inspect. Try again..`);
      nextRoom(currentLocation);
    }
  } else {
    console.log(`"${action}" is not a valid action in this location. Try again..`);
    nextRoom(currentLocation);
  }
}

function inspectItem(targetItem) { // save current location as 'room'.
    console.log(`You inspect the ${targetItem} \n
                ${room.inventoryItems[targetItem]}\n`
    ); //display "You inspect the {item}" followed by given description of item.
    nextRoom(currentLocation); // call script for current location again.
  }


function takeItem(targetItem) {

  if (room.availableItems && room.availableItems[targetItem]) {
    console.log(`You took the ${targetItem}`);
    inventory.push(targetItem);
    delete room.availableItems[targetItem]
  } else {
    console.log("This item cannot be taken.")
  }
}

function lookAround(target) {
  console.log(room.description[currentLocation]);
}