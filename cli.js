const fs = require("fs");
const CSV = require("csv-string");

const { generateFire, Document } = require('./form1098')

function readCsv(file) {
  const fileContents = fs.readFileSync(file, "ascii");

  const csv = CSV.parse(fileContents);

  const headerRow = csv.shift();

  const resultRows = [];
  for (const row of csv) {
    const resultRow = {};
    for (let i = 0; i < headerRow.length; i++) {
      resultRow[headerRow[i]] = row[i];
    }
    resultRows.push(resultRow);
  }
  return resultRows;
}

function generateData(transmitterFilePath, inputFilePath) {
  // hard-coded file with sensitive data, not committed, TODO remove reference
  const rawData = readCsv(inputFilePath);

  const transmitterData = JSON.parse(fs.readFileSync(transmitterFilePath))

  const FIRST_NAME = "Borrower First Name";
  const MIDDLE_NAME = "Borrower Middle Name";
  const LAST_NAME = "Borrower Last Name";
  const GENERATION_CODE = "Generation Code";
  const INTEREST_PAID_1098 = "interest-paid-1098";
  const YEAREND_2022 = "YE-2022";
  const SSN = "Borrower SSN";
  const MAILING_ADDRESS = "Mailing Address";
  const MAILING_CITY = "Mailing City";
  const MAILING_STATE = "Mailing State";
  const MAILING_ZIP_CODE = "Mailing Zipcode";
  const AGREEMENT_DATE = "Agreement Date";

  const data = {
    transmitter: transmitterData.transmitter,
    issuer: transmitterData.issuer,
    payees: rawData
      .filter(
        (payee) => payee[INTEREST_PAID_1098].trim().toLowerCase() !== "rent"
      )
      .filter((payee) => payee[FIRST_NAME])
      .map((payee) => {
        function getPayeeField(fieldName, isRequired) {
          if (payee[fieldName] == null) {
            console.log(payee);
            console.warn("payee missing field " + fieldName);
            throw new Error();
          }
          if (isRequired && payee[fieldName].trim() == "") {
            console.log(payee);
            console.warn(
              "payee required field expected to not be empty: " + fieldName
            );
          }
          return payee[fieldName].trim();
        }

        function formatNumber(fieldName, isRequired) {
          const input = getPayeeField(fieldName, isRequired);
          const value = +(+input * 100).toFixed(0);
          return value;
        }

        function formatDate(fieldName, isRequired) {
          const inputValue = getPayeeField(fieldName, isRequired);
          const date = new Date(inputValue);
          try {
            return date.toISOString().substring(0, 10).replace(/-/g, "");
          } catch (err) {
            console.log(payee);
            throw err;
          }
        }

        return {
          paymentYear: "2023",
          nameControl: getPayeeField(LAST_NAME, true)
            .substring(0, 4)
            .toUpperCase(),
          typeOfTin: "2",
          payeeTin: getPayeeField(SSN, true).replace(/-/g, ""),
          paymentAmount1: formatNumber(INTEREST_PAID_1098, true),
          paymentAmount6: formatNumber(YEAREND_2022, true),
          firstPayeeNameLine: `${getPayeeField(
            FIRST_NAME,
            true
          )} ${getPayeeField(MIDDLE_NAME)} ${getPayeeField(
            LAST_NAME,
            true
          )} ${getPayeeField(GENERATION_CODE)}`.replace(/  +/g, " "),
          payeeMailingAddress: getPayeeField(MAILING_ADDRESS, true),
          payeeCity: getPayeeField(MAILING_CITY, true),
          payeeState: getPayeeField(MAILING_STATE, true),
          payeeZipCode: getPayeeField(MAILING_ZIP_CODE, true),
          mortgageOriginationDate: formatDate(AGREEMENT_DATE, true),
        };
      }),
  };

  return data;
}
if (process.argv.length !== 5) {
    console.log(`usage: ${process.argv[0]} ${process.argv[1]} <transmitter> <input> <output>`)
    return
}

const transmitterFilePath = process.argv[2]
const inputFilePath = process.argv[3]
const outputFilePath = process.argv[4]

const data = generateData(transmitterFilePath, inputFilePath);

const fireTextContent = generateFire(data, Document);

fs.writeFileSync(outputFilePath, fireTextContent, "ascii");
