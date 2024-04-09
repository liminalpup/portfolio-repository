const readline = require('readline');
const readLineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

async function ask(textPrompt) {
  return new Promise((resolve, reject) =>
    readLineInterface.prompt(textPrompt, resolve)
  )
};

