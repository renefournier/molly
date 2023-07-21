# Molly 🧹

Molly is a helpful script designed to clean up unused Svelte components in your project, giving your codebase a breath of fresh air and enhancing its tidiness. With Molly, you can easily identify and remove Svelte components that are no longer imported in your project, freeing up valuable space and promoting better code organization.

![Molly](https://github.com/renefournier/molly/blob/main/molly-screenshot.png)

## Features

- Scans your project to find all .svelte files and checks if they are imported in any other files.
- Identifies and lists unused Svelte components for easy reference.
- Offers an option to move the unused components to the `_unused` directory in your project's root.
- Provides a delightful selection of witty haikus about the joy of tidying up after moving the files.

## How to Use

1. Clone this repository to your local machine or download the `molly.sh` file directly.
2. Make sure the script has execution permissions: `chmod +x molly.sh`
3. Run Molly by executing the script: `./molly.sh`
4. The script will scan your project's `src` folder for .svelte files and indicate their usage status with dots and x's:
   - A dot `.` means the .svelte file is imported in another file.
   - An x `x` means the .svelte file is not imported and can be removed.
5. Molly will display a summary of the unused files and the total KB that can be saved if they are removed.
6. If you're ready to clean up your project, run Molly with the `--clean` option: `./molly.sh --clean`
   - The unused components will be moved to the `_unused` directory in your project's root.
   - A random witty haiku about tidying up will be displayed to brighten your day.

## Example Output

```
Molly 🧹 is scanning the src folder to find all .svelte files.
. means the .svelte file is imported in another file.
x means the .svelte file is not imported and can be removed.

x................x.....x.....x..xxx..x..xx.x.xxxx.xx.......x....x...xx..xx..x.x...xx....xx....x......................................

Unused Svelte file: "src/__original-layout.svelte" (Size: 4KB)
Unused Svelte file: "src/lib/components/ui/ServiceAvailable.svelte" (Size: 4KB)
Unused Svelte file: "src/lib/components/footer/FooterSearch.svelte" (Size: 4KB)
...
Total KB that will be saved if files are removed: 148 KB
Do you want to move these 30 files from /src to /_unused ? (y/n)
```

## Contributing

Contributions to Molly are welcome! If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Give Molly a try, and let her help you keep your Svelte project neat and tidy! 🧹

![Molly Waving](https://github.com/renefournier/molly/blob/main/molly-tidies.png)
