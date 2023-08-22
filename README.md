# Molly 🧹

Molly helps you tidy up unused Svelte components in your project 🤖 which, some say, [sparks joy](https://dev.to/tom0901/does-your-js-spark-joy-svelte-and-the-future-of-the-web-5c9c) 🌟.

![Molly Waving](molly-tidies.jpg)

Molly (or `lilmolly` on `npm`) is an **npm module** that helps you identify unused Svelte components in your project. Molly will, if you like, move these components from your project’s `src` folder to an `_unused` folder. Finally, if after running Molly you change your mind, just run Molly’s `undo` script, et voilà!—removed files are back where they were.

> “Yes, I know the Svelte compiler tree-shakes your code at build time so that unused components aren’t included in the bundle, but here we are talking about cognitive tidiness—is your `lib/components` folder massive and deeply nested?! Which means less hunting for the right component (`⌘P`… `SmartInput.svelte`, `ImprovedInput.svelte`, `GreatInputText.svelte` 🤔), and, well, a more zen-like developer experience… with rhyming haikus for all of you*s*” — _René the Curious_

Molly gives your beautiful Svelte codebase a breath of fresh air and improves its tidiness.

![Molly](molly-screenshot.jpg)

## Table of contents

- [Molly 🧹](#molly-)
  - [Table of contents](#table-of-contents)
  - [Features 🛠️](#features-️)
  - [Safety notice ⚠️](#safety-notice-️)
  - [Quickstart 🚀](#quickstart-)
    - [Prerequisites 🧩](#prerequisites-)
    - [Installation 💽](#installation-)
    - [Undoing changes ↩️](#undoing-changes-️)
      - [macOS and Linux 🍎](#macos-and-linux-)
      - [Windows 🪟](#windows-)
  - [Example output 📄](#example-output-)
  - [Reporting issues 🐛](#reporting-issues-)
  - [Dedication 🍾](#dedication-)
  - [Contributing 🤝](#contributing-)
  - [License 📜](#license-)

## Features 🛠️

- Scans your project to find all `.svelte` component files (_excluding_ routing-related files such as `+page.svelte`, `+layout.svelte`, `+error.svelte`, etc.) and checks if they are imported anywhere.
- Lists unused Svelte components for easy reference.
- Offers to move the unused components to an `_unused` folder. (When you are confident those files are no longer need in your app, you can delete them. Tip: Add `_unused` to your `.gitignore`.)
- Creates an `_undo` script that, if you run it, moves the files in `_unused` back to their original location in `src`, then deletes itself. ♻️!
- Cross-platform Node.js compatible on macOS, Windows and Linux
- Zero `npm` dependencies—100% Node.js APIs
- Provides a delightful selection of witty haikus about tidying up your project files, which some say, [spark joy](https://www.youtube.com/watch?v=9AvWs2X-bEA).

## Safety notice ⚠️

> Molly does not _delete_ your project’s Svelte components, it only _moves_ unused ones—if you press **y** when prompted—to an `_unused` folder in the project root.

## Quickstart 🚀

### Prerequisites 🧩

Make sure you have Node.js version 14 or later installed on your system.

### Installation 💽

You can install Molly globally or as a dev dependency:

1. **Install Molly** globally or as a dev dependency:

   - ```bash
     npm install --global lilmolly
     ```
   - ```bash
     npm install --save-dev lilmolly
     ```

   There is also a `bash` script version that you can download (`lib/molly.sh`) into your Svelte project app root and make it executable with `chmod +x lilmolly.sh`. Please keep in mind that the `bash` script more limited than the regular JavaScript version—no support for path aliases or `index.svelte` files.

2. **Run Molly**: Navigate to the root of your Svelte or SvelteKit project and run Molly:

   - ```bash
     lilmolly
     ```

3. Or **run Molly with `npx`**:

   - ```bash
     npx lilmolly
     ```

You could also add a script to your `package.json` to run Molly, e.g.

```
"scripts": {
  "check:unused": "lilmolly"
}
```

And then:

```bash
npm run check:unused
```

Molly will scan your project’s `src` folder for `.svelte` files and display their usage status with dots and x’s:

- A `•` means the `.svelte` file is imported in another file.
- An `×` means the `.svelte` file is not imported and can be removed.

1. **Review and Move Unused Components**: After scanning, Molly will display a summary of the unused components and the total `KB` that can be saved if they are moved to the `_unused` folder. If you wish to move the unused components, type `y` when prompted.

2. **Undo the Operation**: If you need to restore components you accidentally moved, run the undo script generated by Molly.

3. **Enjoy a Haiku**: Once the cleanup is done, a delightful, random haiku about tidying up will be displayed. Take a moment to enjoy it and let the joy of tidiness spark joy in _your_ project.

**Note:** Before using Molly, ensure you have a backup of your code or your code is checked into a version control system. Molly moves files but a little precaution can go a long way. Also, contributions for improving the undo functionality across different platforms are welcome!

### Undoing changes ↩️

Each time you run Molly and choose to _move_ unused components out of `src`, an undo script is generated to help you reverse the most recent changes. **Note:** This script is overwritten every time Molly is run, so if you run Molly several times, only the changes from the latest run can be undone using the script.

If you wish to preserve the ability to undo from a particular run, make a backup of the undo script before running Molly again. (💡 You might consider time-stamping the undo file.)

#### macOS and Linux 🍎

An `_undo.sh` bash script is generated. Run the following command to reverse the most recent changes:

```bash
./_undo.sh
```

#### Windows 🪟

An \_undo.bat batch file is generated. Double-click the file or run the following command in your command prompt to reverse the most recent changes:

```bash
./_undo.bat
```

## Example output 📄

```
Molly 🧹 is scanning the src folder recursively to find all `.svelte` files. 🔎

• means the `.svelte` file is imported in another file.
× means the `.svelte` file is not imported and can be removed.

×••••••••••••••••••••••••××•••••••••••••••••••••••••••••••••••×•••••••••••••••••••••••••••••••••••••••••

Unused Svelte file: "src/lib/Test 🧹 Unused 4.svelte" (1.00 KB)
Unused Svelte file: "src/lib/components/inbox/TestUnused.svelte" (1.00 KB)
Unused Svelte file: "src/lib/components/inbox/TestUnused2.svelte" (1.00 KB)
Unused Svelte file: "src/lib/components/inputs/TestUnused 3.svelte" (1.00 KB)

Total KB that will be saved if files are removed: 4.00 KB

Do you want to move these 4 files from /src to /_unused ? (y/n) y
Moved "src/lib/Test 🧹 Unused 4.svelte" to "_unused/"
Moved "src/lib/components/inbox/TestUnused.svelte" to "_unused/"
Moved "src/lib/components/inbox/TestUnused2.svelte" to "_unused/"
Moved "src/lib/components/inputs/TestUnused 3.svelte" to "_unused/"

With each file removed,
The codebase breathes freely,
Joy sparks in tidiness.

To undo, run ./_undo.txt.sh
```

## Reporting issues 🐛

Molly aims to simplify and enhance your Svelte project tidying experience. If you encounter any issues or have suggestions for improvements, we encourage you to report them. Here’s how you can do that:

1. **Check Existing Issues**: Before creating a new issue, please check the [existing issues](https://github.com/renefournier/molly/issues) to see if your problem or suggestion has already been reported. If it has, you can contribute by commenting with additional information.

2. **Create a New Issue**: If your problem or suggestion is not already reported, [create a new issue](https://github.com/renefournier/molly/issues/new). Please provide as much detail as possible so we can understand and reproduce the issue. Useful information includes:

   - The version of Molly you’re using
   - Steps to reproduce the issue
   - The expected and actual outcomes
   - Any relevant error messages

We appreciate your contributions to making Molly better. All issues, questions, and contributions are welcomed!

## Dedication 🍾

This project, and much of my joy in web development, is dedicated to [Rich Harris] (https://twitter.com/Rich_Harris), the creator of Svelte, and his [Team](https://github.com/sveltejs/svelte/graphs/contributors).

Discovering Svelte back in 2019 rekindled my love for web development in a way I did not expect. The tooling and configuration complexity at the time was burdensome to many. Svelte’s elegance—simple syntax, high-performance and intuitive architecture—struck a chord with me and [many others](https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/).

Thank you! 🌟

## Contributing 🤝

Contributions to Molly are welcome! If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

## License 📜

This project is licensed under the [MIT License](LICENSE).

---

_Give Molly a try, and let her help you keep your Svelte project neat and tidy! 🧹_
