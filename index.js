// Global require's
const inquirer = require('inquirer');
const cTable = require('console.table');
const fs = require('fs');
const helpers = require('./helpers/readAndAppend');
const readFromFile = require('./helpers/readFromFile');
loadingPage()

function loadingPage() {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*       Truepill pharmacy         *")
  console.log("*                                 *")
  console.log("***********************************")
  menu();
};

// An array of objects detailing questions for user input
async function menu() {
  inquirer.prompt([
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
}


async function addMedication(medicine) {
  // read current db
  var formulary = await readFromFile('./db/formulary.json').then((data) => {
    if (data.length > 2) {
      return JSON.parse(data)
    }
    else {
      return []
    }
  })

  var existsInFormulary = formulary.filter(function (el) {
    return el.name.toLowerCase() == medicine.name.toLowerCase()
  })

  if (existsInFormulary.length === 0) {
    console.log("Not in Formulary")
  }
  else {

    var parsedData = await readFromFile('./db/stock.json').then((data) => {
      if (data.length > 2) {
        return JSON.parse(data)
      }
      else {
        return [medicine]
      }
    })

    var existingMedicine = parsedData.filter(function (el) {
      return el.name.toLowerCase() === medicine.name.toLowerCase()
    })

    if (existingMedicine.length === 0) {
      parsedData.push(medicine)
      helpers.writeToFile('./db/stock.json', parsedData)
    }
    else {
      let index = parsedData.indexOf(existingMedicine)
      parsedData.splice(index, 1)


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



      // write parsedData array back to db file
      helpers.writeToFile('./db/stock.json', parsedData)
    }

  }

}

async function viewMedicationNames() {
  console.log(`\n`);
  await readFromFile('./db/formulary.json').then((data) => {
    if (data.length > 2) {
      console.table(JSON.parse(data))
    }
    else {
      console.log("Nothing in Formulary")
    }
  })
  menu()

}

async function viewStockAndQuantities() {
  console.log(`\n`);
  await readFromFile('./db/stock.json').then((data) => {
    if (data.length > 2) {
      console.table(JSON.parse(data))
    }
    else {
      console.log("Nothing in Stock")
    }
  })
  menu()

}

async function medicineQuestions() {
  const question = inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: "would you like to add to the formulary or add/update stock?",
      choices: [
        "Formulary",
        "Stock",
        "Quit"
      ],
    }
  ])
    // switch statement to select choice to be executed
    .then((response) => {
      switch (response.action) {
        case "Formulary":
          formularyQuestions()
          break;
        case "Stock":
          stockQuestions();
          break;
        case "Quit":
          break;
        default:
      }
    });

}

async function stockQuestions() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the name of the medication?",
        name: 'name',
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

async function formularyQuestions() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the name of the medication?",
        name: 'name',
      }
    ])
    .then((data) => {
      addFormulary(data)
      console.log("This medication has been added")
    })
}

async function addFormulary(medicine) {
  var parsedData = await readFromFile('./db/formulary.json').then((data) => {
    if (data.length > 2) {
      return JSON.parse(data)
    }
    else {
      return [medicine]
    }
  })

  var existingMedicine = parsedData.filter(function (el) {
    return el.name.toLowerCase() == medicine.name.toLowerCase()
  })

  if (existingMedicine.length === 0) {
    parsedData.push(medicine)
  }
  else {
    console.log("Already exisits")
  }
  helpers.writeToFile('./db/formulary.json', parsedData)

}
