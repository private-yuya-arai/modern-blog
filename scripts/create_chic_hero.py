from PIL import Image, ImageDraw

def create_gradient_png(path, color1, color2, size=(1920, 1080)):
    base = Image.new('RGB', size, color1)
    top = Image.new('RGB', size, color2)
    mask = Image.new('L', size)
    mask_data = []
    for y in range(size[1]):
        mask_data.extend([int(255 * (y / size[1]))] * size[0])
    mask.putdata(mask_data)
    
    base.paste(top, (0, 0), mask)
    base.save(path)
    print(f"Created {path}")

# Chic Morning: Light Cream to Soft Peach
create_gradient_png('public/images/hero_morning.png', (255, 251, 235), (254, 215, 170))
# Chic Day: Soft Sky Blue to Crisp White
create_gradient_png('public/images/hero_day.png', (224, 242, 254), (255, 255, 255))
# Chic Night: Deep Navy to Charcoal
create_gradient_png('public/images/hero_night.png', (15, 23, 42), (30, 41, 59))
