// Based on Exhibit 1 of Publication 1220
function processNameControlCandidate(value) {
  value = value.toUpperCase();
  value = value.replaceAll(/[^A-Z0-9 -]/g, " ");
  if (value.startsWith("-") || value.startsWith(" ")) {
    value = value.value.substring(1);
  }
  value = value.substring(0, 4);
  return value;
}

function nameControlCorporation(value) {
  value = value.toUpperCase();
  let words = value.split(" ");
  if (words.length >= 3 && words[0] === "THE") {
    words = words.slice(1);
  }
  value = words.join("");
  return processNameControlCandidate(value);
}

function nameControlIndividualByLastName(value) {
  return processNameControlCandidate(value);
}

// let OPERATION_MAP = {
//   nameControlCorporation,
//   nameControlIndividualByLastName,
// };
let OPERATION_MAP = {};

const TRecord = [
  { type: "const", value: "T" },
  { type: "string", field: "paymentYear", width: 4 },
  { type: "bool", field: "priorYearIndicator", trueValue: "P", width: 1 },
  { type: "string", field: "transmitterTin", pad: "", width: 9 },
  { type: "string", field: "transmitterControlCode", width: 5 },
  { type: "blank", width: 7 },
  { type: "bool", field: "testFileIndicator", trueValue: "T", width: 1 },
  { type: "bool", field: "foreignEntityIndicator", trueValue: "1", width: 1 },
  { type: "string", field: "transmitterName", width: 40 },
  { type: "string", continuedFrom: "transmitterName", width: 40 },
  { type: "string", field: "companyName", width: 40 },
  { type: "string", continuedFrom: "companyName", width: 40 },
  { type: "string", field: "companyMailingAddress", width: 40 },
  { type: "string", field: "companyCity", width: 40 },
  { type: "string", field: "companyState", width: 2 },
  { type: "string", field: "companyZipCode", width: 9 },
  { type: "blank", width: 15 },
  {
    type: "string",
    field: "totalNumberOfPayees",
    width: 8,
    pad: "0",
    align: "right",
  },
  { type: "string", field: "contactName", width: 40 },
  { type: "string", field: "contactTelephone", width: 15 },
  { type: "string", field: "contactEmail", casing: "preserve", width: 50 },
  { type: "blank", width: 91 },
  { type: "recordSequenceNumber", width: 8 },
  { type: "blank", width: 10 },
  { type: "string", field: "vendorIndicator", width: 1 },
  { type: "string", field: "vendorName", width: 40 },
  { type: "string", field: "vendorMailingAddress", width: 40 },
  { type: "string", field: "vendorCity", width: 40 },
  { type: "string", field: "vendorState", width: 2 },
  { type: "string", field: "vendorZipCode", width: 9 },
  { type: "string", field: "vendorContactName", width: 40 },
  { type: "string", field: "vendorTelephone", width: 15 },
  { type: "blank", width: 35 },
  {
    type: "bool",
    field: "vendorForeignEntityIndicator",
    trueValue: "1",
    width: "1",
  },
  { type: "blank", width: 8 },
  { type: "endOfRecord" },
];

const ARecord = [
  { type: "const", value: "A" },
  { type: "string", field: "paymentYear", width: 4 },
  {
    type: "bool",
    field: "isCombinedFederalStateFilingProgram",
    trueValue: "1",
    width: 1,
  },
  { type: "blank", width: 5 },
  { type: "string", field: "issuerTin", pad: "", width: 9 },
  // {
  //   type: "string",
  //   field: "firstIssuerNameLine",
  //   operation: "nameControlCorporation",
  //   width: 4,
  // },
  { type: "string", field: "issuerNameControl", width: 4 },
  { type: "bool", field: "lastFilingIndicator", trueValue: "1", width: 1 },
  { type: "string", field: "typeOfReturn", width: 2 },
  { type: "string", field: "amountCodes", width: 18 },
  { type: "blank", width: 6 },
  { type: "bool", field: "foreignEntityIndicator", trueValue: "1", width: 1 },
  { type: "string", field: "firstIssuerNameLine", width: 40 },
  { type: "string", continuedFrom: "firstIssuerNameLine", width: 40 },
  // { type: "string", field: "secondIssuerNameLine", width: 40 },
  {
    type: "bool",
    field: "transferAgentIndicator",
    trueValue: "1",
    falseValue: "0",
    width: 1,
  },
  { type: "string", field: "issuerShippingAddress", width: 40 },
  { type: "string", field: "issuerCity", width: 40 },
  { type: "string", field: "issuerState", width: 2 },
  { type: "string", field: "issuerZipCode", width: 9 },
  { type: "string", field: "issuerTelephone", width: 15 },
  { type: "blank", width: 260 },
  { type: "recordSequenceNumber", width: 8 },
  { type: "blank", width: 241 },
  { type: "endOfRecord" },
];

const BRecord = [
  { type: "const", value: "B" },
  { type: "string", field: "paymentYear", width: 4 },
  { type: "string", field: "correctedReturnIndicator", width: 1 },
  // {
  //   type: "string",
  //   field: "payeeLastName",
  //   operation: "nameControlIndividualByLastName",
  //   width: 4,
  // },
  { type: "string", field: "nameControl", width: 4 },
  { type: "string", field: "typeOfTin", width: 1 },
  { type: "string", field: "payeeTin", pad: "", width: 9 },
  { type: "string", field: "payeeAccountNumber", width: 20 },
  { type: "string", field: "issuerOfficeCode", width: 4 },
  { type: "blank", width: 10 },
  {
    type: "string",
    field: "paymentAmount1",
    width: 12,
    numeric: true,
    sumIn: "controlAmount1",
  },
  {
    type: "string",
    field: "paymentAmount2",
    width: 12,
    numeric: true,
    sumIn: "controlAmount2",
  },
  {
    type: "string",
    field: "paymentAmount3",
    width: 12,
    numeric: true,
    sumIn: "controlAmount3",
  },
  {
    type: "string",
    field: "paymentAmount4",
    width: 12,
    numeric: true,
    sumIn: "controlAmount4",
  },
  {
    type: "string",
    field: "paymentAmount5",
    width: 12,
    numeric: true,
    sumIn: "controlAmount5",
  },
  {
    type: "string",
    field: "paymentAmount6",
    width: 12,
    numeric: true,
    sumIn: "controlAmount6",
  },
  {
    type: "string",
    field: "paymentAmount7",
    width: 12,
    numeric: true,
    sumIn: "controlAmount7",
  },
  {
    type: "string",
    field: "paymentAmount8",
    width: 12,
    numeric: true,
    sumIn: "controlAmount8",
  },
  {
    type: "string",
    field: "paymentAmount9",
    width: 12,
    numeric: true,
    sumIn: "controlAmount9",
  },
  {
    type: "string",
    field: "paymentAmountA",
    width: 12,
    numeric: true,
    sumIn: "controlAmountA",
  },
  {
    type: "string",
    field: "paymentAmountB",
    width: 12,
    numeric: true,
    sumIn: "controlAmountB",
  },
  {
    type: "string",
    field: "paymentAmountC",
    width: 12,
    numeric: true,
    sumIn: "controlAmountC",
  },
  {
    type: "string",
    field: "paymentAmountD",
    width: 12,
    numeric: true,
    sumIn: "controlAmountD",
  },
  {
    type: "string",
    field: "paymentAmountE",
    width: 12,
    numeric: true,
    sumIn: "controlAmountE",
  },
  {
    type: "string",
    field: "paymentAmountF",
    width: 12,
    numeric: true,
    sumIn: "controlAmountF",
  },
  {
    type: "string",
    field: "paymentAmountG",
    width: 12,
    numeric: true,
    sumIn: "controlAmountG",
  },
  {
    type: "string",
    field: "paymentAmountH",
    width: 12,
    numeric: true,
    sumIn: "controlAmountH",
  },
  {
    type: "string",
    field: "paymentAmountJ",
    width: 12,
    numeric: true,
    sumIn: "controlAmountJ",
  },
  { type: "blank", width: 16 },
  { type: "bool", field: "foreignCountryIndicator", trueValue: "1", width: 1 },
  { type: "string", field: "firstPayeeNameLine", width: 40 },
  { type: "string", field: "secondPayeeNameLine", width: 40 },
  { type: "string", field: "payeeMailingAddress", width: 40 },
  { type: "blank", width: 40 },
  { type: "string", field: "payeeCity", width: 40 },
  { type: "string", field: "payeeState", width: 2 },
  { type: "string", field: "payeeZipCode", width: 9 },
  { type: "blank", width: 1 },
  { type: "recordSequenceNumber", width: 8 },
  { type: "blank", width: 36 },
  // This is 1098 specific
  { type: "string", field: "mortgageOriginationDate", width: 8 },
  {
    type: "bool",
    field: "propertySecuringMortgageIndicator",
    trueValue: "1",
    width: 1,
  },
  { type: "string", field: "propertyAddress", width: 39 },
  { type: "string", field: "other", width: 39 },
  { type: "blank", width: 39 },
  {
    type: "string",
    field: "numberOfMortgagedProperties",
    width: 4,
    numeric: true,
  },
  { type: "string", field: "specialDataEntries", width: 49 },
  { type: "string", field: "mortgageAcquistionDate", width: 8 },
  { type: "blank", width: 18 },
  { type: "endOfRecord" },
];

const CRecord = [
  { type: "const", value: "C" },
  { type: "string", field: "count", width: 8, numeric: true },
  { type: "blank", width: 6 },
  { type: "string", field: "controlAmount1", width: 18, numeric: true },
  { type: "string", field: "controlAmount2", width: 18, numeric: true },
  { type: "string", field: "controlAmount3", width: 18, numeric: true },
  { type: "string", field: "controlAmount4", width: 18, numeric: true },
  { type: "string", field: "controlAmount5", width: 18, numeric: true },
  { type: "string", field: "controlAmount6", width: 18, numeric: true },
  { type: "string", field: "controlAmount7", width: 18, numeric: true },
  { type: "string", field: "controlAmount8", width: 18, numeric: true },
  { type: "string", field: "controlAmount9", width: 18, numeric: true },
  { type: "string", field: "controlAmountA", width: 18, numeric: true },
  { type: "string", field: "controlAmountB", width: 18, numeric: true },
  { type: "string", field: "controlAmountC", width: 18, numeric: true },
  { type: "string", field: "controlAmountD", width: 18, numeric: true },
  { type: "string", field: "controlAmountE", width: 18, numeric: true },
  { type: "string", field: "controlAmountF", width: 18, numeric: true },
  { type: "string", field: "controlAmountG", width: 18, numeric: true },
  { type: "string", field: "controlAmountH", width: 18, numeric: true },
  { type: "string", field: "controlAmountJ", width: 18, numeric: true },
  { type: "blank", width: 160 },
  { type: "recordSequenceNumber", width: 8 },
  { type: "blank", width: 241 },
  { type: "endOfRecord" },
];

// this whole record is a hack
const FRecord = [
  { type: "const", value: "F" },
  { type: "const", value: 1, numeric: true, width: 8 },
  { type: "blank", pad: "0", width: 21 },
  { type: "blank", width: 19 },
  { type: "string", field: "count", numeric: true, width: 8 },
  { type: "blank", width: 442 },
  { type: "recordSequenceNumber", width: 8 },
  { type: "blank", width: 241 },
  { type: "endOfRecord" },
];

const Document = [
  { type: "record", reference: TRecord, field: "transmitter" },
  { type: "record", reference: ARecord, field: "issuer" },
  {
    type: "forEach",
    field: "payees",
    do: [{ type: "record", reference: BRecord }],
  },
  {
    type: "record",
    reference: CRecord,
    useAggregateRecord: true,
  },
  {
    type: "record",
    reference: FRecord,
    useAggregateRecord: true,
  },
];

function generateFire(data, documentStructure) {
  let output = "";
  let recordSequenceNumber = 0;

  function internalProcess(data, structure, aggregateRecord) {
    let forEachAggregateRecord;
    let continuations = {};
    for (const item of structure) {
      if (item.type === "record") {
        recordSequenceNumber++;
        recordSize = 0;
        internalProcess(
          item.useAggregateRecord
            ? forEachAggregateRecord
            : item.field
            ? data[item.field]
            : data,
          item.reference,
          aggregateRecord
        );
        if (recordSize !== 750) {
          console.warn("incorrect record size: " + recordSize);
        }
        continue;
      }
      if (item.type === "forEach") {
        forEachAggregateRecord = { count: 0 };
        for (const entity of data[item.field]) {
          internalProcess(entity, item.do, forEachAggregateRecord);
          forEachAggregateRecord.count++;
        }
        continue;
      }

      let value;
      let pad = item.pad;
      let align = item.align;
      let width = item.width;
      let isPresent = true;
      let casing = item.casing ?? "upper";
      let operation = item.operation ?? null;
      if (item.type === "const") {
        value = item.value;
        width ??= item.value.length;
      } else if (item.type === "blank") {
        value = "";
      } else if (item.type === "string") {
        if (item.continuedFrom) {
          isPresent = item.continuedFrom in continuations;
          value = continuations[item.continuedFrom];
        } else {
          isPresent = data[item.field] !== undefined;
          value = data[item.field] ?? "";
        }
      } else if (item.type === "bool") {
        isPresent = data[item.field] !== undefined;
        value = data[item.field] ? item.trueValue ?? "" : item.falseValue ?? "";
      } else if (item.type === "recordSequenceNumber") {
        value = "" + recordSequenceNumber;
        pad = "0";
        align = "right";
      } else if (item.type === "endOfRecord") {
        value = "\r\n";
        width = 2;
      } else {
        throw new Error("invalid type: " + item.type);
      }

      width ??= 0;

      if (isPresent && item.numeric) {
        pad ??= "0";
        align ??= "right";
        value = value.toString();
      } else {
        pad ??= " ";
        align ??= "left";
      }

      if (isPresent && item.sumIn) {
        aggregateRecord[item.sumIn] ??= 0;
        aggregateRecord[item.sumIn] += +value;
      }

      if (value.length < width) {
        if (pad.length !== 1) throw new Error("invalid padding");
        if (align === "left") {
          while (value.length < width) {
            value += pad;
          }
        } else if (align === "right") {
          const storedValue = value;
          value = "";
          while (value.length + storedValue.length < width) {
            value += pad;
          }
          value += storedValue;
        } else {
          throw new Error("invalid align");
        }
      }

      if (value.length > width) {
        value = value.substring(0, width);
      }

      if (isPresent) continuations[item.field] = value.substring(width);

      if (operation !== null) {
        if (!(operation in OPERATION_MAP)) {
          throw new Error('invalid operation: "' + operation + '"');
        }
        let operationFunc = OPERATION_MAP[operation];
        value = operationFunc(value);
      }

      if (casing === "upper") {
        value = value.toUpperCase();
      } else if (casing === "preserve") {
        // do nothing
      } else {
        throw new Error("invalid casing");
      }

      recordSize += value.length;
      output += value;
    }

    for (let [key, value] of Object.entries(continuations)) {
      if (value.length > 0) {
        console.warn("field truncated: " + key);
      }
    }
  }

  internalProcess(data, documentStructure);

  return output;
}

module.exports = {
  generateFire,
  Document,
};
