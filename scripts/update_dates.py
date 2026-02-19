import os
import re
import datetime
from pathlib import Path

# Configuration
POSTS_DIR = Path('src/posts')
START_DATE = datetime.date(2025, 10, 1)
END_DATE = datetime.date(2026, 2, 10)

def get_chapter_number(filename):
    match = re.search(r'chapter(\d+)', filename)
    if match:
        return int(match.group(1))
    return float('inf')  # Non-chapter files go to the end or are ignored

def main():
    # 1. Get all chapter files
    files = [f for f in os.listdir(POSTS_DIR) if f.startswith('chapter') and f.endswith('.md')]
    
    # 2. Sort by chapter number
    files.sort(key=get_chapter_number)
    
    total_files = len(files)
    if total_files == 0:
        print("No chapter files found.")
        return

    print(f"Found {total_files} chapter files.")
    
    # 3. Calculate date interval
    total_days = (END_DATE - START_DATE).days
    interval = total_days / (total_files - 1) if total_files > 1 else 0
    
    print(f"Date range: {START_DATE} to {END_DATE} ({total_days} days)")
    print(f"Interval: {interval:.2f} days")

    # 4. Update files
    for i, filename in enumerate(files):
        # Calculate new date
        days_to_add = int(interval * i)
        new_date = START_DATE + datetime.timedelta(days=days_to_add)
        new_date_str = new_date.isoformat()
        
        file_path = POSTS_DIR / filename
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Regex to replace date in frontmatter
        # Assumes format: date: "YYYY-MM-DD" or date: YYYY-MM-DD
        new_content = re.sub(
            r'^date:\s*["\']?(\d{4}-\d{2}-\d{2})["\']?',
            f'date: "{new_date_str}"',
            content,
            flags=re.MULTILINE
        )
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename} to {new_date_str}")
        else:
            print(f"Skipped {filename} (no change or date not found)")

if __name__ == "__main__":
    main()
