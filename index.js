const { generateFire, Document } = require("./form1098");
const { parseCsvWithHeader, convertToPayeesData } = require("./utils");

const dropZoneEl = document.getElementById("drop-zone");
const submitButtonEl = document.getElementById("submit-button");
const transmitterFileEl = document.getElementById("transmitter-file");
const dataFileEl = document.getElementById("data-file")

dropZoneEl.addEventListener("dragenter", (ev) => {
  dropZoneEl.classList.add("active");
});

dropZoneEl.addEventListener("dragleave", (ev) => {
  dropZoneEl.classList.remove("active");
});

dropZoneEl.addEventListener("dragover", (ev) => {
  ev.preventDefault();
});

let csvFile = null;
let transmitterDataFile = null;

const targets = [
  [
    ".csv",
    (text) => {
      csvFile = text;
    },
  ],
  [
    ".json",
    (text) => {
      transmitterDataFile = text;
    },
  ],
];

dropZoneEl.addEventListener("drop", async (ev) => {
  dropZoneEl.classList.remove("active");
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    const promises = [...ev.dataTransfer.items].map(async (item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        const target = targets.find((t) => file.name.endsWith(t[0]))?.[1];
        if (target) {
          const text = await file.text();
          target(text);
        }
      }
    });

    const results = (await Promise.all(promises)).filter((x) => x);

    updateStuff();
  }
});

function updateStuff() {
  if (csvFile != null) {
    dataFileEl.classList.add("uploaded")
  }
  if (transmitterDataFile != null) {
    transmitterFileEl.classList.add("uploaded")
  }
  const showSubmit = csvFile != null && transmitterDataFile != null;
  submitButtonEl.disabled = !showSubmit;
}
updateStuff()

submitButtonEl.addEventListener("click", () => { tryProcess() })

async function tryProcess() {
  if (!csvFile || !transmitterDataFile) return;
  const rawData = parseCsvWithHeader(csvFile);
  const payees = convertToPayeesData(rawData);
  const transmitterData = JSON.parse(transmitterDataFile);

  const data = {
    transmitter: transmitterData.transmitter,
    issuer: transmitterData.issuer,
    payees,
  };

  const fire = generateFire(data, Document);
  const blob = new Blob([fire]);

  const suggestedName = "fire.txt";

  // Show the file save dialog.
  let handle
  try {
    handle = await showSaveFilePicker({
      suggestedName,
    });
  } catch (err) {
    // user may have aborted the request
    return
  }

  // Write the blob to the file.
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
