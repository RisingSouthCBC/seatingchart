# Seating Chart

A quick and easy website for creating and managing seating charts.

## Features

- 🎯 **Simple Interface**: Easy-to-use drag-and-drop functionality
- 📐 **Customizable Grid**: Adjust rows and columns to fit your needs (1-20 each)
- 👥 **Person Management**: Add people and assign them to seats
- 🔄 **Drag & Drop**: Drag people from the unassigned list to seats, or between seats
- 💾 **Save & Load**: Export and import seating arrangements as JSON files
- 🔁 **Auto-Save**: Automatically saves your work to browser local storage
- 📱 **Mobile Friendly**: Responsive design works on all devices

## How to Use

### Getting Started

1. Open `index.html` in your web browser
2. The default grid is 5x5, but you can adjust it to your needs

### Adding People

1. Type a name in the "Name" field
2. Click "Add Person" or press Enter
3. The person will appear in the "Unassigned People" section

### Assigning Seats

- **Drag and drop** a person from the unassigned list to any empty seat
- **Double-click** on an occupied seat to remove the person (they return to unassigned)
- **Drag between seats** to swap or move people around

### Grid Management

- Adjust the number of rows and columns using the number inputs
- Click "Update Grid" to apply changes
- Warning: Reducing the grid size may move people to the unassigned list

### Saving Your Work

- **Auto-save**: Your chart is automatically saved to your browser's local storage
- **Manual save**: Click "Save Chart" to download as a JSON file
- **Load**: Click "Load Chart" to restore a previously saved arrangement

### Clearing

- Click "Clear All" to remove all seat assignments (moves everyone to unassigned)

## Quick Start

Simply open `index.html` in your browser - no installation or build process required!

```bash
# Clone the repository
git clone https://github.com/RisingSouthCBC/seatingchart.git

# Navigate to the directory
cd seatingchart

# Open in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

## Technology

- Pure HTML, CSS, and JavaScript
- No dependencies or frameworks required
- Works in all modern web browsers

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Open source - feel free to use and modify as needed.