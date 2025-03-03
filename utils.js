const Papa = require("papaparse");

function parseCsvWithHeader(contents) {
  const parseResults = Papa.parse(contents, { header: true });

  return parseResults.data;
}

const FIRST_NAME = "Borrower First Name";
const MIDDLE_NAME = "Borrower Middle Name";
const LAST_NAME = "Borrower Last Name";
const GENERATION_CODE = "Generation Code";
const INTEREST_PAID_1098 = "interest-paid-1098";
const SSN = "Borrower SSN";
const MAILING_ADDRESS = "Mailing Address";
const MAILING_CITY = "Mailing City";
const MAILING_STATE = "Mailing State";
const MAILING_ZIP_CODE = "Mailing Zipcode";
const BORROWER_ADDRESS = "Borrower Address";
const BORROWER_CITY = "Borrower City";
const BORROWER_STATE = "Borrower State";
const BORROWER_ZIP_CODE = "Borrower Zipcode";
const AGREEMENT_DATE = "Agreement Date";

function getYearEndColumnName(paymentYearAsString) {
  let paymentYear = +paymentYearAsString;
  if (!Number.isSafeInteger(paymentYear)) {
    throw new Error("invalid payment year " + paymentYearAsString);
  }
  let yearEndToReport = paymentYear - 1;
  return `YE-${yearEndToReport}`;
}

function convertToPayeesData(rawData, paymentYear) {
  let yearEndColumnName = getYearEndColumnName(paymentYear);

  return rawData
    .filter(
      (payee) => payee[INTEREST_PAID_1098]?.trim().toLowerCase() !== "rent"
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

      const propertyAddress = getPayeeField(BORROWER_ADDRESS, true);
      const propertyCity = getPayeeField(BORROWER_CITY, true);
      const propertyState = getPayeeField(BORROWER_STATE, true);
      const propertyZipCode = getPayeeField(BORROWER_ZIP_CODE, true);

      const payeeMailingAddress = getPayeeField(MAILING_ADDRESS, true);
      const payeeCity = getPayeeField(MAILING_CITY, true);
      const payeeState = getPayeeField(MAILING_STATE, true);
      const payeeZipCode = getPayeeField(MAILING_ZIP_CODE, true);

      let propertyAddressIsMailingAddress =
        propertyAddress === payeeMailingAddress &&
        propertyCity === payeeCity &&
        propertyState === payeeState &&
        propertyZipCode === payeeZipCode;

      let propertySecuringMortgage = propertyAddressIsMailingAddress
        ? ""
        : `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyZipCode}`;

      return {
        paymentYear: paymentYear,
        nameControl: getPayeeField(LAST_NAME, true)
          .substring(0, 4)
          .toUpperCase(),
        typeOfTin: "2",
        payeeTin: getPayeeField(SSN, true).replace(/-/g, ""),
        paymentAmount1: formatNumber(INTEREST_PAID_1098, true),
        paymentAmount6: formatNumber(yearEndColumnName, true),
        firstPayeeNameLine: `${getPayeeField(FIRST_NAME, true)} ${getPayeeField(
          MIDDLE_NAME
        )} ${getPayeeField(LAST_NAME, true)} ${getPayeeField(
          GENERATION_CODE
        )}`.replace(/  +/g, " "),
        payeeLastName: getPayeeField(LAST_NAME, true),
        payeeMailingAddress,
        payeeCity,
        payeeState,
        payeeZipCode,
        mortgageOriginationDate: formatDate(AGREEMENT_DATE, true),
        propertySecuringMortgageIndicator: propertyAddressIsMailingAddress,
        propertyAddress: propertySecuringMortgage,
      };
    });
}

module.exports = {
  parseCsvWithHeader,
  convertToPayeesData,
};
