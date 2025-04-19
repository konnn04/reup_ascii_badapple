import cv2
import numpy as np
import os
import time

def frame_to_ascii(frame, width=160, height=90, chars="@%#*+=-:. "):
    # Reverse characters so darker pixels get denser characters
    chars = chars[::-1]
    
    # Resize the frame
    resized = cv2.resize(frame, (width, height))
    
    # Convert to grayscale if not already
    if len(resized.shape) == 3:
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    else:
        gray = resized
    
    # Normalize and map pixels to ASCII chars
    ascii_frame = ""
    for row in gray:
        for pixel in row:
            # Đảm bảo pixel nằm trong khoảng [0, 255]
            pixel_value = max(0, min(255, pixel))
            # Tính toán index an toàn hơn - trước tiên chia cho 255
            ratio = pixel_value / 255.0
            char_idx = int(ratio * (len(chars) - 1))
            ascii_frame += chars[char_idx]
        ascii_frame += "\n"
    
    return ascii_frame

def video_to_ascii(video_path, output_path, width=160, height=90, target_fps=30):
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video file: {video_path}")
        return
    
    # Get video properties
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Calculate frame skipping for target FPS
    frame_skip = max(1, round(original_fps / target_fps))
    actual_fps = original_fps / frame_skip
    
    print(f"Original video: {frame_count} frames at {original_fps} FPS")
    print(f"Converting to ASCII at {actual_fps} FPS (target: {target_fps})")
    
    # Process frames
    frame_idx = 0
    processed_count = 0
    start_time = time.time()
    
    with open(output_path, 'w', encoding='utf-8') as f:
        # Write metadata
        f.write(f"FPS:{actual_fps}\n")
        f.write(f"WIDTH:{width}\n")
        f.write(f"HEIGHT:{height}\n")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Process only every nth frame based on frame_skip
            if frame_idx % frame_skip == 0:
                # Convert frame to ASCII
                ascii_frame = frame_to_ascii(frame, width, height)
                
                # Write frame to file with a separator
                f.write("FRAME\n")
                f.write(ascii_frame)
                f.write("ENDFRAME\n")
                
                processed_count += 1
                
                # Display progress
                if processed_count % 10 == 0:
                    elapsed = time.time() - start_time
                    frames_per_sec = processed_count / max(0.001, elapsed)
                    print(f"Processed {processed_count} frames ({frame_idx}/{frame_count}, {frames_per_sec:.2f} fps)")
            
            frame_idx += 1
    
    print(f"Conversion complete! {processed_count} ASCII frames saved.")
    cap.release()

# Usage
if __name__ == "__main__":
    video_to_ascii("./assets/video.mp4", "ascii_frames.txt", width=130, height=60, target_fps=60)