# Bad Apple ASCII Art Converter

A Python application that converts videos (particularly the famous "Bad Apple!!" animation) into ASCII art animation that can be played in a browser.

![Bad Apple ASCII Demo](https://github.com/konnn04/reup_ascii_badapple/assets/thumb.png)

## Demo

Check out the live demo: [https://konnn04.github.io/reup_ascii_badapple/](https://konnn04.github.io/reup_ascii_badapple/)

Repository: [https://github.com/konnn04/reup_ascii_badapple](https://github.com/konnn04/reup_ascii_badapple)

## Features

- Converts video files to ASCII art frames
- Customizable resolution and frame rate
- Web-based player with play/pause and color inversion
- Efficient frame rendering

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/konnn04/reup_ascii_badapple.git
   cd reup_ascii_badapple
   ```

2. Install the required dependencies:
   ```
   pip install opencv-python numpy
   ```

## Usage

### Converting a video to ASCII

1. Place your video file in the `assets` folder (default: `video.mp4`)
2. Run the conversion script:
   ```
   python run.py
   ```
3. The ASCII frames will be saved to `ascii_frames.txt`

### Configuration

You can adjust the following parameters in `run.py`:

```python
video_to_ascii(
    "./assets/video.mp4",  # Input video path
    "ascii_frames.txt",    # Output file
    width=130,            # ASCII frame width
    height=60,            # ASCII frame height
    target_fps=60         # Target frame rate
)
```

### Viewing the ASCII Animation

Open `index.html` in your web browser to view the animation. The player provides:

- Play/Pause button
- Color inversion option
- Frame progress display

## How It Works

The converter:
1. Loads each frame from the video
2. Resizes it to the target dimensions
3. Converts to grayscale
4. Maps each pixel's brightness to an ASCII character
5. Saves the frames with metadata to a text file

The web player:
1. Loads the ASCII frames from the text file
2. Renders them at the specified frame rate
3. Provides playback controls

## License

MIT License

## Acknowledgments

- Inspired by the classic "Bad Apple!!" animation
- ASCII art conversion techniques based on common grayscale mapping principles
