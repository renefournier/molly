#!/bin/bash

# Molly 🧹 helps you clean up unused Svelte components in your project.
# Usage: ./molly.sh

# ANSI color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
TEAL='\033[1;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Witty Haikus about the joy of tidying up
declare -a haikus=(
"With each file removed 📂,
The codebase breathes freely 💨,
Joy sparks in tidiness ✨."
"Unused files depart 🚀,
Space clears for new creations 🎨,
Tidy project’s heart ❤️."
"A sweep of the broom 🧹,
Code finds new clarity 🌈,
Tidying brings bloom 🌸."
"Messy code, no more 🚫,
Tidying magic restores 🎩,
Joy in each closed door 🚪."
"Freed from unused weight 🏋️,
The project finds its rhythm 🎵,
Tidying is great 😊."
)

unused_files=()

# Function to move unused files to _unused directory
move_unused_files() {
    mkdir -p _unused
    echo "#!/bin/bash" > "_undo.sh"
    for file in "${unused_files[@]}"
    do
        mv "$file" "_unused/"
        echo -e "${RED}Moved \"$file\" to \"_unused/\"${NC}"
        printf "mv _unused/%q %q\n" "$(basename "$file")" "$file" >> _undo.sh
    done
    echo 'rm -- "$0"' >> "_undo.sh"
    chmod 755 "_undo.sh"

    # Display a random witty haiku after moving the files
    echo
    random_haiku=${haikus[$((RANDOM % ${#haikus[@]}))]}
    echo -e "${YELLOW}$random_haiku${NC}"
    echo
    echo -e "To undo, run ${GREEN}./_undo.sh${NC} 🔄"
}

# Function to display summary of unused files
show_summary() {
    total_kb_saved=0
    for file in "${unused_files[@]}"
    do
        file_size_kb=$(du -k "$file" | cut -f1)
        total_kb_saved=$((total_kb_saved + file_size_kb))
        echo -e "${RED}Unused Svelte file: \"$file\" (${file_size_kb} KB)${NC}"
    done
    echo
    echo -e "${TEAL}Total KB that will be saved if files are removed: $total_kb_saved KB${NC}"
    echo
}

# Beginning of the script
echo
echo -e "${TEAL}Molly 🧹 is scanning the src folder recursively to find all .svelte files. 🔎${NC}"
echo -e "${GREEN}•${NC} means the .svelte file is imported in another file. 💼"
echo -e "${RED}×${NC} means the .svelte file is not imported and can be moved from src to _unused. 🗑️"
echo


# Get the list of all .svelte files and loop over them correctly
while IFS= read -r -d '' svelte_file
do
    # Extract the filename
    filename=$(basename -- "$svelte_file")

    # Skip files starting with '+'
    if [[ "$filename" == +* ]]
    then
        echo -n -e "${GREEN}•${NC}"
        continue
    fi

    # Search for the filename in all files
    found=$(grep -rl "$filename" src 2> /dev/null)

    # If nothing was found, then the file is unused
    if [[ -z $found ]]
    then
        echo -n -e "${RED}×${NC}"
        unused_files+=("$svelte_file")
    else
        echo -n -e "${GREEN}•${NC}"
    fi
done < <(find src -type f -name "*.svelte" -print0)

# Print a newline after progress dots
echo
echo

# Show summary of unused files
show_summary

# If no unused components found, print the message and exit
if [ ${#unused_files[@]} -eq 0 ]; then
    echo -e "${GREEN}No unused components found.${NC}"
    exit 0
fi

# Print prompt to move files if user confirms
read -p "Do you want to move these ${#unused_files[@]} files from /src to /_unused ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    move_unused_files
    echo
    echo -e "To undo, run ${GREEN}./_undo.sh${NC}"
else
    echo
    echo -e "${TEAL}Not moving files. Bye! 👋${NC}"
    echo
fi
