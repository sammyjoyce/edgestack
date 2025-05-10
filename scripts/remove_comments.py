import os
import glob
import re

def remove_comments_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()

    # Remove single-line comments (// ...)
    content = re.sub(r'//.*', '', content)
    # Remove multi-line comments (/* ... */)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Remove empty JSX expressions like {} on their own line
    content = re.sub(r'^\s*{\s*}\s*$', '', content, flags=re.MULTILINE)
    # Remove empty lines that might be left after comment/JSX removal
    content = re.sub(r'^\s*$(?:\r\n?|\n)', '', content, flags=re.MULTILINE)


    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(content)

def main():
    project_dir = '/Users/sam/code/lush' # Specify your project directory
    extensions = ('**/*.ts', '**/*.tsx')
    files_to_process = []

    for ext in extensions:
        files_to_process.extend(glob.glob(os.path.join(project_dir, ext), recursive=True))

    for filepath in files_to_process:
        if 'node_modules' not in filepath: # Avoid processing node_modules
            print(f"Processing {filepath}...")
            try:
                remove_comments_from_file(filepath)
                print(f"Successfully removed comments from {filepath}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

    print("Comment removal process completed.")

if __name__ == "__main__":
    main()
