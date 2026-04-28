import os

def generate_tree(startpath):
    # The folders we want to hide from the LLM
    ignore_dirs = {'venv', 'node_modules', '.git', '__pycache__', '.pytest_cache'}
    
    for root, dirs, files in os.walk(startpath):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * level
        
        # Print the current directory
        if level == 0:
            print(f"{os.path.basename(os.path.abspath(startpath))}/")
        else:
            print(f"{indent}├── {os.path.basename(root)}/")
            
        # Print the files within
        subindent = '│   ' * (level + 1)
        for f in files:
            # Optional: skip hidden files like .env to keep it clean
            if not f.startswith('.'): 
                print(f"{subindent}├── {f}")

if __name__ == "__main__":
    generate_tree('.')