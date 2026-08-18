from PIL import Image

def get_dominant_colors(image_path, num_colors=3):
    img = Image.open(image_path)
    img = img.convert("RGB")
    # Resize to speed up processing
    img.thumbnail((100, 100))
    colors = img.getcolors(100 * 100)
    
    # Sort colors by count (frequency)
    sorted_colors = sorted(colors, key=lambda t: t[0], reverse=True)
    
    print("Most frequent colors (RGB):")
    for count, color in sorted_colors[:10]:
        hex_color = "#{:02x}{:02x}{:02x}".format(color[0], color[1], color[2])
        print(f"{hex_color} - Count: {count}")

try:
    get_dominant_colors(r"c:\Users\carlos\OneDrive - Vaal University of Technology\WORK\HoD Duties\Drone Currilum Project\Drone Course - Diploma Level\website\logo.jpeg")
except Exception as e:
    print(f"Error: {e}")
