const fs = require("fs");

const { generateFire, Document } = require("./form1098");
const { parseCsvWithHeader, convertToPayeesData } = require("./utils");

function readCsv(file) {
  const fileContents = fs.readFileSync(file, "ascii");

  return parseCsvWithHeader(fileContents);
}

function generateData(transmitterFilePath, inputFilePath) {
  // hard-coded file with sensitive data, not committed, TODO remove reference
  const rawData = readCsv(inputFilePath);

  const transmitterData = JSON.parse(fs.readFileSync(transmitterFilePath));

  const payees = convertToPayeesData(
    rawData,
    transmitterData.transmitter.paymentYear
  );

  const data = {
    transmitter: transmitterData.transmitter,
    issuer: transmitterData.issuer,
    payees,
  };

  return data;
}
if (process.argv.length !== 5) {
  console.log(
    `usage: ${process.argv[0]} ${process.argv[1]} <transmitter> <input> <output>`
  );
  return;
}

const transmitterFilePath = process.argv[2];
const inputFilePath = process.argv[3];
const outputFilePath = process.argv[4];

const data = generateData(transmitterFilePath, inputFilePath);

const fireTextContent = generateFire(data, Document);

fs.writeFileSync(outputFilePath, fireTextContent, "ascii");
