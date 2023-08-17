// Molly 🧙‍♀️ helps you keep your Svelte project neat and tidy! ✨

const os = require("os");
const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ANSI color codes 🎨
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  teal: "\x1b[36m\x1b[1m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

// Witty Haikus about the joy of tidying up 📜
const haikus = [
  `With each file removed 📂,
The codebase breathes freely 💨,
Joy sparks in tidiness ✨.`,
  `Unused files depart 🚀,
Space clears for new creations 🎨,
Tidy project’s heart ❤️.`,
  `A sweep of the broom 🧹,
Code finds new clarity 🌈,
Tidying brings bloom 🌸.`,
  `Messy code, no more 🚫,
Tidying magic restores 🎩,
Joy in each closed door 🚪.`,
  `Freed from unused weight 🏋️,
The project finds its rhythm 🎵,
Tidying is great 😊.`,
];

// Function to move unused files to _unused directory
const moveUnusedFiles = (unusedFiles) => {
  // create _unused directory if it does not exist
  if (!fs.existsSync("_unused")) {
    fs.mkdirSync("_unused");
  }

  const platform = os.platform();
  let undoFileName;
  let undoFileHeader;

  switch (platform) {
    case "win32":
      undoFileName = "_undo.bat";
      undoFileHeader = "@echo off\r\n";
      break;
    case "darwin":
    case "linux":
      undoFileName = "_undo.sh";
      undoFileHeader = "#!/bin/sh\n";
      break;
    default:
      console.error(`Unknown platform: ${platform}`);
      process.exit(1);
  }

  fs.writeFileSync(undoFileName, undoFileHeader, "utf8");

  for (const file of unusedFiles) {
    let targetFile = file;
    let sourceFile = file;

    // If it's an index.svelte file, get the parent directory
    if (path.basename(file) === "index.svelte") {
      targetFile = path.dirname(file);
    }

    // Move the file or directory to _unused
    fs.renameSync(sourceFile, path.join("_unused", path.basename(targetFile)));
    console.log(
      `${colors.red}Moved "${sourceFile}" to "_unused/"${colors.reset}`
    );

    // for (const file of unusedFiles) {
    //   // move the file to _unused directory
    //   fs.renameSync(file, path.join("_unused", path.basename(file)));
    //   console.log(`${colors.red}Moved "${file}" to "_unused/"${colors.reset}`);

    // Write the undo command
    let undoCommand;
    switch (platform) {
      case "win32":
        undoCommand = `move "_unused\\${path.basename(
          targetFile
        )}" "${sourceFile}"\r\n`;
        break;
      case "darwin":
      case "linux":
        undoCommand = `mv "_unused/${path.basename(
          targetFile
        )}" "${sourceFile}"\n`;
        break;
      default:
        console.error(`Unknown platform: ${platform}`);
        process.exit(1);
    }
    fs.appendFileSync(undoFileName, undoCommand, "utf8");
  }

  // Add a line to the script to delete itself
  const deleteSelfCommand =
    platform === "win32" ? 'del "%~f0"\r\n' : 'rm -- "$0"\n';
  fs.appendFileSync(undoFileName, deleteSelfCommand, "utf8");

  // Set file permissions to 755 if on macOS or Linux to make it executable
  if (platform !== "win32") {
    fs.chmodSync(undoFileName, "755");
  }

  // Display a random witty haiku after moving the files
  console.log(
    "\n" +
      colors.yellow +
      haikus[Math.floor(Math.random() * haikus.length)] +
      colors.reset
  );

  console.log("\n");
  console.log(`To undo, run ${colors.green}${undoFileName}${colors.reset} 🔄`);
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

function findSvelteFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      // Recurse into subdirectories
      results = results.concat(findSvelteFiles(file));
    } else if (path.extname(file) === ".svelte") {
      results.push(file);
    }
  });

  return results;
}

function searchFile(filename, dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat && stat.isDirectory()) {
      if (searchFile(filename, filepath)) return true;
    } else if (filepath.endsWith(".js") || filepath.endsWith(".svelte")) {
      const content = fs.readFileSync(filepath, "utf-8");

      // Look for both the filename and the "index" pattern
      if (content.includes(filename) || content.includes(`/${filename}`))
        return true;
    }
  }

  return false;
}

// Beginning of the script

console.log(
  "\n" +
    colors.teal +
    `Molly 🧹 is scanning the src folder recursively to find all .svelte files. 🔎` +
    colors.reset +
    "\n"
);
console.log(
  colors.green +
    "•" +
    colors.reset +
    " means the .svelte file is imported in another file. 💼"
);
console.log(
  colors.red +
    "×" +
    colors.reset +
    " means the .svelte file is not imported and can be moved from src to _unused. 🗑️\n"
);

let unusedFiles = [];

// Get the list of all .svelte files and loop over them correctly
//
// DEPRECATED: This method does not work if run on Windows doesn’t natively have UNIX find command
// const files = execSync('find src -type f -name "*.svelte"', {
//   encoding: "utf-8",
// }).split("\n");
//
const files = findSvelteFiles("src");

// ... (other imports and variables)

for (const svelteFile of files) {
  // Extract the filename
  let filename = path.basename(svelteFile);
  let componentSearchName = filename;

  // If filename is "index.svelte," use its directory name as the component name
  if (filename === "index.svelte") {
    const directoryName = path.basename(path.dirname(svelteFile));
    componentSearchName = `${directoryName}.svelte`;
  }

  // Skip files starting with '+'
  if (filename.startsWith("+")) {
    // e.g., +page.svelte
    process.stdout.write(colors.green + "•" + colors.reset);
    continue;
  }

  // Search for the filename in all files
  const found = searchFile(componentSearchName, "src");

  // If nothing was found, then the file is unused
  if (!found) {
    process.stdout.write(colors.red + "×" + colors.reset);
    unusedFiles.push(svelteFile);
  } else {
    process.stdout.write(colors.green + "•" + colors.reset);
  }
}

console.log("\n");

// Show summary of unused files 📊
showSummary(unusedFiles);

// If no unused components found, print the message and exit 👌
if (unusedFiles.length === 0) {
  console.log(
    colors.green +
      "No unused components found. 🎉 Already neat and tidy! 🌟" +
      colors.reset
  );
  process.exit(0);
} else {
  // Prompt user "Do you want to move them?" ❓

  readline.question(
    `Do you want to move these ${unusedFiles.length} files from /src to /_unused? 🚚 (y/n) `,
    (answer) => {
      if (answer.toLowerCase() === "y") {
        moveUnusedFiles(unusedFiles);
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
