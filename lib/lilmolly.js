// Molly helps you keep your Svelte project neat and tidy!

const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ANSI color codes
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  teal: "\x1b[36m\x1b[1m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

// Witty Haikus about the joy of tidying up
const haikus = [
  `With each file removed,
The codebase breathes freely,
Joy sparks in tidiness.`,
  `Unused files depart,
Space clears for new creations,
Tidy project’s heart.`,
  `A sweep of the broom,
Code finds new clarity,
Tidying brings bloom.`,
  `Messy code, no more,
Tidying magic restores,
Joy in each closed door.`,
  `Freed from unused weight,
The project finds its rhythm,
Tidying is great.`,
];

// Function to move unused files to _unused directory
const moveUnusedFiles = (unusedFiles) => {
  // create _unused directory if it does not exist
  if (!fs.existsSync("_unused")) {
    fs.mkdirSync("_unused");
  }

  // Create or overwrite the _undo.txt.sh file
  fs.writeFileSync("_undo.txt.sh", "#!/bin/bash\n\n", "utf8");

  for (const file of unusedFiles) {
    // move the file to _unused directory
    fs.renameSync(file, path.join("_unused", path.basename(file)));
    console.log(`${colors.red}Moved "${file}" to "_unused/"${colors.reset}`);

    // Write the undo command to _undo.txt.sh
    // Note the use of backslashes to escape the quotes
    fs.appendFileSync(
      "_undo.txt.sh",
      `mv "_unused/${path.basename(file)}" "${file}"\n`,
      "utf8"
    );
  }

  // Add a line to the script to delete itself
  fs.appendFileSync("_undo.txt.sh", 'rm -- "$0"\n', "utf8");

  // Set _undo.txt.sh file permissions to 755 to make it executable
  fs.chmodSync("_undo.txt.sh", "755");

  // Display a random witty haiku after moving the files
  console.log(
    "\n" +
      colors.yellow +
      haikus[Math.floor(Math.random() * haikus.length)] +
      colors.reset
  );
};

// Function to display summary of unused files
const showSummary = (unusedFiles) => {
  let totalKbSaved = 0;
  for (const file of unusedFiles) {
    const stats = fs.statSync(file);
    const fileSizeInBytes = stats.size;
    const fileSizeInKilobytes = fileSizeInBytes / 1024;
    totalKbSaved += fileSizeInKilobytes;
    console.log(
      `${
        colors.red
      }Unused Svelte file: "${file}" (${fileSizeInKilobytes.toFixed(2)} KB)${
        colors.reset
      }`
    );
  }
  console.log(
    "\n" +
      colors.teal +
      `Total KB that will be saved if files are removed: ${totalKbSaved.toFixed(
        2
      )} KB` +
      colors.reset +
      "\n"
  );
};

// Beginning of the script

console.log(
  "\n" +
    colors.teal +
    `Molly 🧹 is scanning the src folder recursively to find all .svelte files.` +
    colors.reset +
    "\n"
);
console.log(
  colors.green +
    "•" +
    colors.reset +
    " means the .svelte file is imported in another file."
);
console.log(
  colors.red +
    "×" +
    colors.reset +
    " means the .svelte file is not imported and can be removed from src.\n"
);

let unusedFiles = [];

// Get the list of all .svelte files and loop over them correctly
const files = execSync('find src -type f -name "*.svelte"', {
  encoding: "utf-8",
}).split("\n");

for (const svelteFile of files) {
  // Extract the filename
  const filename = path.basename(svelteFile);
  // Skip files starting with '+'
  if (filename.startsWith("+")) {
    // e.g., +page.svelte
    process.stdout.write(colors.green + "•" + colors.reset);
    continue;
  }

  // Search for the filename in all files
  let found;
  try {
    found = execSync(`grep -rl "${filename}" src`, { encoding: "utf-8" });
  } catch (err) {
    found = "";
  }

  // If nothing was found, then the file is unused
  if (!found) {
    process.stdout.write(colors.red + "×" + colors.reset);
    unusedFiles.push(svelteFile);
  } else {
    process.stdout.write(colors.green + "•" + colors.reset);
  }
}

console.log("\n");

// Show summary of unused files
showSummary(unusedFiles);

// If no unused components found, print the message and exit
if (unusedFiles.length === 0) {
  console.log(colors.green + "No unused components found." + colors.reset);
  process.exit(0);
} else {
  // Prompt user "Do you want to move them?"

  readline.question(
    `Do you want to move these ${unusedFiles.length} files from /src to /_unused ? (y/n) `,
    (answer) => {
      if (answer.toLowerCase() === "y") {
        moveUnusedFiles(unusedFiles);
        console.log("\n");
        console.log(
          `To undo, run ${colors.green}./_undo.txt.sh${colors.reset}`
        );
      } else {
        console.log(
          "\n" + colors.teal + "Not moving files. Bye! 👋" + "\n" + colors.reset
        );
      }
      readline.close();
      process.exit(0);
    }
  );
}
