// Molly 🧙‍♀️ helps you keep your Svelte project neat and tidy! ✨

const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to safely escape strings for use in regular expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Attempt to load svelte.config.js, handle error if not found
let svelteConfig = {};
try {
  // Assume svelte.config.js is in the current working directory or project root
  const configPath = path.resolve(process.cwd(), "./svelte.config.js");
  if (fs.existsSync(configPath)) {
    svelteConfig = require(configPath); // require needs a relative or absolute path
  } else {
    // console.log("svelte.config.js not found, proceeding without aliases."); // Optional: inform user
  }
} catch (e) {
  // console.error("Error loading svelte.config.js:", e.message); // Optional: inform user
}

let aliases = {};
if (
  svelteConfig &&
  svelteConfig.kit &&
  svelteConfig.kit.vite &&
  svelteConfig.kit.vite.resolve &&
  svelteConfig.kit.vite.resolve.alias
) {
  aliases = svelteConfig.kit.vite.resolve.alias;
}

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
  try {
    if (!fs.existsSync("_unused")) {
      fs.mkdirSync("_unused");
    }
  } catch (e) {
    console.error(`${colors.red}Error creating _unused directory: ${e.message}${colors.reset}`);
    process.exit(1);
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

  try {
    fs.writeFileSync(undoFileName, undoFileHeader, "utf8");
  } catch (e) {
    console.error(`${colors.red}Error writing undo script header: ${e.message}${colors.reset}`);
    process.exit(1);
  }

  for (const file of unusedFiles) {
    let sourcePathToMove = file; // Path of the file or directory to move
    let destinationBasename = path.basename(file); // Name of the item in the _unused directory
    let originalLocationToRestore = file; // Original full path for the undo script

    // If it's an index.svelte file, we move its parent directory
    if (path.basename(file) === "index.svelte") {
      sourcePathToMove = path.dirname(file); // e.g., src/components/MyComponent
      destinationBasename = path.basename(sourcePathToMove); // e.g., MyComponent
      originalLocationToRestore = sourcePathToMove; // The directory itself
    }

    const destinationPathInUnused = path.join("_unused", destinationBasename);

    try {
      fs.renameSync(sourcePathToMove, destinationPathInUnused);
      const itemType = fs.statSync(destinationPathInUnused).isDirectory() ? "directory" : "file";
      console.log(
        `${colors.red}Moved ${itemType} "${sourcePathToMove}" to "${destinationPathInUnused}"${colors.reset}`
      );

      // Write the undo command
      let undoCommand;
      switch (platform) {
        case "win32":
          // For Windows, `move` works for both files and directories.
          // Ensure paths with spaces are quoted.
          undoCommand = `move "${destinationPathInUnused}" "${originalLocationToRestore}"\r\n`;
          break;
        case "darwin":
        case "linux":
          undoCommand = `mv "${destinationPathInUnused}" "${originalLocationToRestore}"\n`;
          break;
        default:
          console.error(`Unknown platform: ${platform}`);
          process.exit(1); // Should not happen if initial check passed
      }
      fs.appendFileSync(undoFileName, undoCommand, "utf8");
    } catch (e) {
      console.error(`${colors.red}Error moving "${sourcePathToMove}": ${e.message}${colors.reset}`);
      // Decide if you want to continue or exit. For now, log and continue.
    }
  }

  // Add a line to the script to delete itself
    const deleteSelfCommand = platform === "win32" ? 'del "%~f0"\r\n' : 'rm -- "$0"\n';
  try {
    fs.appendFileSync(undoFileName, deleteSelfCommand, "utf8");

    // Set file permissions to 755 if on macOS or Linux to make it executable
    if (platform !== "win32") {
      fs.chmodSync(undoFileName, "755");
    }
  } catch (e) {
    console.error(`${colors.red}Error finalizing undo script: ${e.message}${colors.reset}`);
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
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    // console.warn(`${colors.yellow}Warning: Could not read directory ${dir}: ${e.message}${colors.reset}`);
    return false; // Cannot search if directory is unreadable
  }


  for (const file of files) {
    const filepath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filepath);
    } catch (e) {
      // console.warn(`${colors.yellow}Warning: Could not stat file ${filepath}: ${e.message}${colors.reset}`);
      continue; // Skip if file is unstat-able
    }


    if (stat && stat.isDirectory()) {
      if (searchFile(filename, filepath)) return true;
    } else if (filepath.endsWith(".js") || filepath.endsWith(".svelte")) {
      let content;
      try {
        content = fs.readFileSync(filepath, "utf-8");
      } catch (e) {
        // console.warn(`${colors.yellow}Warning: Could not read file ${filepath}: ${e.message}${colors.reset}`);
        continue; // Skip if file is unreadable
      }


      // Safer alias replacement: only within import/require statements
      const importRegex = /(import\s+[^'"`]*?\s*from\s*)(['"`])(.*?)\2|(require\s*\(\s*)(['"`])(.*?)\5\s*\)/g;
      let processedContent = "";
      let lastIndex = 0;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        processedContent += content.substring(lastIndex, match.index);
        const prefix = match[1] || match[4]; // e.g., import ... from or require(
        const quote = match[2] || match[5]; // ', ", or `
        let importPath = match[3] || match[6]; // The actual path string

        for (const aliasKey in aliases) {
          const resolvedAliasPath = aliases[aliasKey];
          if (typeof resolvedAliasPath === 'string') { // Ensure alias value is a string
            if (importPath === aliasKey) { // Exact match: 'alias'
              importPath = resolvedAliasPath;
              break; 
            } else if (importPath.startsWith(aliasKey + "/")) { // Starts with: 'alias/...'
              importPath = resolvedAliasPath + importPath.substring(aliasKey.length);
              break;
            }
          }
        }
        processedContent += prefix + quote + importPath + quote + (match[1] ? "" : ")"); // Reconstruct, add closing ) for require
        lastIndex = importRegex.lastIndex;
      }
      processedContent += content.substring(lastIndex);
      // End of safer alias replacement

      // Look for the component filename in the processed content
      if (processedContent.includes(filename) || processedContent.includes(`/${filename}`))
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
