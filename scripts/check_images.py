import glob
import os
import re

# correct path relative to script execution location
posts_dir = os.path.join('src', 'posts')
public_dir = 'public'

print(f"Checking images in {posts_dir}...")

posts = glob.glob(os.path.join(posts_dir, '*.md'))
missing = []

for p in posts:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
        # Extract image path from frontmatter or markdown image syntax
        # Looking for frontmatter image: "image: /images/..."
        match = re.search(r'^image:\s*["\']?([^"\']+)["\']?', content, re.MULTILINE)
        if match:
            img_path = match.group(1).strip()
            # Remove leading slash if present
            rel_path = img_path.lstrip('/')
            full_path = os.path.join(public_dir, rel_path)
            
            if not os.path.exists(full_path):
                missing.append((p, img_path))
        else:
            print(f"Warning: No image found in frontmatter for {p}")

print(f"\nFound {len(missing)} missing images:")
for p, img in missing:
    print(f"{p} -> {img}")
