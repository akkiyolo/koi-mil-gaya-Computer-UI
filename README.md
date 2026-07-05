# Jadoo Calling Interface 👽💻
<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/3e560c7b-9ef4-45a9-90b2-9b6d714249d9" />

An interactive, movie-authentic replica of the alien communication interface from the classic Bollywood sci-fi movie *Koi... Mil Gaya*. 

Built entirely with clean, vanilla HTML5, CSS3, and JavaScript—without bloated libraries.

---

## 🌟 Features
* **Isometric 3D Waves**: Custom CSS 3D-transformed wave column grids (`rotateX` / `rotateZ`) that mimic the iconic diamond-shaped alien wave streams.
* **Lissajous Scope**: A canvas-rendered orbital scope displaying a clean, rotating figure-8 trajectory that glows during active signals.
* **Interactive Audio**: Custom MP3 tone mapping matching the classic keys (B, C, D, E, F).
* **Responsive Layout**:
  - **Desktop Mode**: Clean side-by-side quadrants with keyboard shortcuts helper.
  - **Mobile Mode**: Stacked vertical panels with an **on-screen interactive keypad** for phone and touch devices.
* **Alien Transmission Response**: Tap **SPACE** (or *TRANSMIT* on screen) to send your signal sequence and hear the alien response activate the receiving scope.
* **Minimalist CRT Aesthetic**: Clean green-phosphor telemetry text, layout borders, and a startup connection screen.

---

## 🎮 Controls

### Desktop Keyboard
| Key | Action |
| --- | --- |
| **B, C, D, E, F** | Play signal tone, log code, and animate SENDING grid |
| **SPACEBAR** | Transmit active sequence & trigger reactive alien response |
| **ESCAPE** | Clear current sequence |
| **ENTER** | Connect on startup screen |

### Mobile / Tablet Touch
* Tap **anywhere** on the startup screen to initialize.
* Use the **on-screen interactive keypad** at the bottom:
  - **B, C, D, E, F** buttons to play tones.
  - **TRANSMIT** button to send.
  - **CLEAR** button to erase sequence.

---

## 🚀 How to Run
1. Clone or download this repository.
2. Double-click `index.html` to open it directly in any modern browser, or run it through a local development server (like VS Code Live Server).
3. Ensure audio files (`B.mp3` through `F.mp3`) are in the root directory next to `index.html`.
