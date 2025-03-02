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
const YEAREND_2022 = "YE-2022";
const SSN = "Borrower SSN";
const MAILING_ADDRESS = "Mailing Address";
const MAILING_CITY = "Mailing City";
const MAILING_STATE = "Mailing State";
const MAILING_ZIP_CODE = "Mailing Zipcode";
const AGREEMENT_DATE = "Agreement Date";

function convertToPayeesData(rawData) {
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

      return {
        paymentYear: "2023",
        nameControl: getPayeeField(LAST_NAME, true)
          .substring(0, 4)
          .toUpperCase(),
        typeOfTin: "2",
        payeeTin: getPayeeField(SSN, true).replace(/-/g, ""),
        paymentAmount1: formatNumber(INTEREST_PAID_1098, true),
        paymentAmount6: formatNumber(YEAREND_2022, true),
        firstPayeeNameLine: `${getPayeeField(FIRST_NAME, true)} ${getPayeeField(
          MIDDLE_NAME
        )} ${getPayeeField(LAST_NAME, true)} ${getPayeeField(
          GENERATION_CODE
        )}`.replace(/  +/g, " "),
        payeeLastName: getPayeeField(LAST_NAME, true),
        payeeMailingAddress: getPayeeField(MAILING_ADDRESS, true),
        payeeCity: getPayeeField(MAILING_CITY, true),
        payeeState: getPayeeField(MAILING_STATE, true),
        payeeZipCode: getPayeeField(MAILING_ZIP_CODE, true),
        mortgageOriginationDate: formatDate(AGREEMENT_DATE, true),
      };
    });
}

module.exports = {
  parseCsvWithHeader,
  convertToPayeesData,
};
