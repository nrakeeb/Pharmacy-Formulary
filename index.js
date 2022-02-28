// Global require's
const inquirer = require('inquirer');
const cTable = require('console.table');
const fs = require('fs');
const helpers = require('./helpers/readAndAppend');
const readFromFile = require('./helpers/readFromFile');

const uuid = require('./helpers/uuid');
const util = require('util');

// An array of objects detailing questions for user input
const question = inquirer.prompt([
  {
    name: 'action',
    type: 'list',
    message: "what would you like to do?",
    choices: [
      "Add Medication",
      "View all medication in the formulary",
      "View the all medication in stock and the quantities",
      "Quit"
    ],
  }
])
  // switch statement to select choice to be executed
  .then((response) => {
    switch (response.action) {
      case "Add Medication":
        medicineQuestions();
        break;
      case "View all medication in the formulary":
        viewMedicationNames();
        break;
      case "View the all medication in stock and the quantities":
        viewStockAndQuantities();
        break;
      default:
    }
  });

async function addMedication(medicine) {
  // read current db
  var parsedData = await readFromFile('./db/db.json').then((data) => JSON.parse(data))

  var existingMedicine = parsedData.filter(function (el) {
    return el.name.toLowerCase() == medicine.name.toLowerCase()
  })

  if (!existingMedicine) {
    parsedData.push(medicine)
    // writeToFile
    return
  }

  parsedData.splice(parsedData.findIndex(x => x.name == existingMedicine.name.toLowerCase()))

  var totalPacks = parseInt(medicine.totalPacks) + parseInt(existingMedicine[0].totalPacks)

  // create new object based on user input (medicine parameter)
  var medicine = {
    "name": medicine.name.toLowerCase(),
    "strength": medicine.strength,
    "packSize": medicine.packSize,
    "totalPacks": totalPacks
  }

  // add object to parsedData array
  parsedData.push(medicine)

  console.log(parsedData)

  // write parsedData array back to db file
  // writeToFile()
}

async function viewMedicationNames() {
  var parsedData = await readFromFile('./db/db.json').then((data) => JSON.parse(data))
  console.log(`\n`);
  console.table(parsedData) // display just name probably loop
  console.log(`\n`);
  console.log(`\n`);
}

async function viewStockAndQuantities() {
  var parsedData = await readFromFile('./db/db.json').then((data) => JSON.parse(data))
  console.log(`\n`);
  console.table(parsedData)
  console.log(`\n`);
  console.log(`\n`);
}

async function medicineQuestions() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the name of the medication?",
        name: 'name',
        // validate: addMed => {
        //   if (addMed == !undefined) {
        //     console.log('Please enter a new medication');
        //     return false;
        //   } else {
        //     return true;
        //   }
        // }
      },
      {
        type: 'input',
        message: "What is the strength of the medication?",
        name: 'strength',
      },
      {
        type: 'input',
        message: "What is the pack size of the medication?",
        name: 'packSize',
      },
      {
        type: 'input',
        message: "How many packs would you like to add?",
        name: 'totalPacks',
      }])
    .then((data) => {
      addMedication(data)
    })
}