import os
from PIL import Image

def create_color_image(path, color, size=(1920, 1080)):
    img = Image.new('RGB', size, color)
    img.save(path)
    print(f"Created {path}")

os.makedirs('public/images', exist_ok=True)

create_color_image('public/images/hero_morning.png', (224, 242, 254)) # Light Blue
create_color_image('public/images/hero_day.png', (125, 211, 252))     # Sky Blue
create_color_image('public/images/hero_night.png', (30, 58, 138))     # Dark Blue
