def convert_ascii_to_js(input_file, output_file):
    # Đọc file input
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Phân tích metadata và frames
    lines = content.split('\n')
    fps = None
    width = None
    height = None
    frames = []

    line_idx = 0
    
    # Đọc metadata
    if lines[line_idx].startswith('FPS:'):
        fps = float(lines[line_idx][4:])
        line_idx += 1
    
    if lines[line_idx].startswith('WIDTH:'):
        width = int(lines[line_idx][6:])
        line_idx += 1
    
    if lines[line_idx].startswith('HEIGHT:'):
        height = int(lines[line_idx][7:])
        line_idx += 1
    
    # Đọc các frame
    current_frame = ""
    is_collecting_frame = False
    
    while line_idx < len(lines):
        line = lines[line_idx]
        
        if line == "FRAME":
            is_collecting_frame = True
            current_frame = ""
        elif line == "ENDFRAME":
            is_collecting_frame = False
            frames.append(current_frame)
        elif is_collecting_frame:
            current_frame += line + "\n"
        
        line_idx += 1
    
    # Tạo nội dung JavaScript
    js_content = f"""// ascii_frames.js - Generated from ascii_frames.txt
const frameData = {{
  fps: {fps},
  width: {width},
  height: {height},
  frames: [
"""
    
    # Thêm từng frame với định dạng yêu cầu - ĐÃ SỬA
    for i, frame in enumerate(frames):
        if i > 0:
            js_content += ",\n"
        js_content += f"    `{frame}`"
    
    js_content += "\n  ]\n};\n\n"
    js_content += "// Export frameData for use in other files\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
    js_content += "  module.exports = { frameData };\n"
    js_content += "}\n"
    
    # Ghi ra file output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Converted {len(frames)} frames to JavaScript format")
    print(f"Output saved to {output_file}")

if __name__ == "__main__":
    convert_ascii_to_js("ascii_frames.txt", "ascii_frames.js")