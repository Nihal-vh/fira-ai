# 🌌 Fira AI

[![Tauri v2](https://img.shields.io/badge/Tauri-v2.0-blueviolet?style=flat-square&logo=tauri)](https://tauri.app/)
[![Next.js v16](https://img.shields.io/badge/Next.js-v16.2-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-emerald?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-DB-blue?style=flat-square&logo=sqlite)](https://sqlite.org/)

**Fira AI** is an ultra-premium, cross-platform productivity dashboard and AI workspace companion. Designed with a sleek glassmorphic aesthetic, Fira AI integrates task management, work activity tracking, and a local Gemma-powered AI chatbot inside a fast, lightweight native window. It is built as a hybrid desktop application combining **Next.js (App Router)**, **Tauri 2.0 (Rust)**, and a **Python FastAPI backend** executing SQLite queries.

---

## ✨ Features

- **🧠 Desktop Spotlight Activation**
  Activate or hide Fira instantly from anywhere in your operating system using the **`Cmd/Ctrl + Space`** global hotkey. Fira stays ready to pop in, answer queries, and hide back into the background.
- **🎨 Glassmorphic Interface & Micro-Animations**
  Designed with TailwindCSS v4 and custom hardware-accelerated animations (fade-ups, slide-ins, and active glow effects) placed over a modern dot-grid desktop canvas.
- **🤖 Gemma AI Chat Companion**
  A dedicated right-side chatbot panel powered by Gemma, designed to help you break down objectives, plan workflows, and manage tasks.
- **📋 Task & Tag Manager**
  Organize daily tasks and filter through domains with tag pill markers (`perf`, `design`, `data`, `content`, `devops`, `review`). Complete with interactive checkoff tracking and a linear violet-to-pink gradient progress bar.
- **📊 GitHub-Style Activity Calendar**
  A interactive, scale-on-hover contribution graph showing daily work intensity levels and activity density.

---

## 🏗️ Architecture & Internal Workings

Fira AI operates as a multi-tier system with the frontend, desktop shell, and local backend interacting asynchronously.

```mermaid
graph TD
    User([👤 User]) <--> Frontend[🖼️ Next.js Frontend / React 19]
    Frontend <-->|REST API / HTTP| FastAPI[🐍 FastAPI Backend / Python]
    FastAPI <-->|SQLAlchemy ORM| SQLite[(💾 SQLite Database)]
    Frontend <-->|Tauri APIs / Core Plugins| RustShell[🦀 Tauri Core / Rust Shell]
    RustShell -- Spawns & Monitors --Sidecar--> FastAPI
    RustShell -- Captures System Input --> Hotkey[⌨️ Cmd/Ctrl+Space Shortcut]
```

### How It Works Under the Hood

1. **The Tauri 2.0 Shell (`src-tauri`)**:
   - Spawns the FastAPI backend binary as a Tauri **Sidecar** process (`fira-backend`) during application startup, linking its `stdout` back to Rust logs.
   - Leverages the `tauri_plugin_global_shortcut` plugin to listen for `CommandOrControl+Space`. When triggered, Rust queries the active webview window and toggles its visibility (`hide()` or `show() + set_focus()`).

2. **The FastAPI Backend (`backend/`)**:
   - Serves as the localized database controller. Built with FastAPI and Uvicorn.
   - Implements **SQLAlchemy ORM** connecting to a local `sql_app.db` file (automatically initialized at runtime).
   - Manages user profiles, schedules, database transactions, and data seeding (`/users/` POST and GET routes).

3. **The Next.js Frontend (`app/`)**:
   - The UI is loaded as the primary webview. It features a responsive grid with staggered, animation-delayed lists.
   - Connects to the FastAPI backend using standard HTTP fetch queries routed through a lightweight client layer in `app/lib/api.ts`.
   - Styled using TailwindCSS v4, customized variables in `app/globals.css`, and Lucide React icons.

---

## 📂 Codebase Layout

```
├── app/                  # Next.js frontend pages and layouts
│   ├── globals.css       # Core design system tokens, keyframes, and animations
│   ├── layout.tsx        # Next.js root layout setup
│   ├── page.tsx          # Main Fira AI dashboard UI and chat controller
│   └── lib/
│       └── api.ts        # API wrapper for FastAPI requests
├── backend/              # Local Python backend
│   ├── app/
│   │   └── main.py       # FastAPI application, SQLAlchemy models, and routes
│   └── requirements.txt  # Python package dependencies
├── src-tauri/            # Tauri 2.0 desktop shell configuration
│   ├── src/
│   │   ├── lib.rs        # Rust app builder, sidecar spawner, and global hotkeys
│   │   └── main.rs       # Tauri entry point
│   ├── tauri.conf.json   # Tauri window, sidecar definitions, and build configs
│   └── Cargo.toml        # Rust package manifest
├── package.json          # Node scripts and development workspace config
└── main.js               # Legacy Electron fallback entrypoint
```

---

## 🚀 Getting Started & Setup

### Prerequisites

To build and run Fira AI, you need the following dependencies installed on your system:

- **Node.js** (v18+) & **npm**
- **Python** (3.9+) & `pip`
- **Rust Compiler** (installed via [rustup](https://rustup.rs/))
- **System Webview Packages** (Linux-specific):
  ```bash
  sudo apt update
  sudo apt install -y libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev build-essential curl wget file libssl-dev
  ```

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   cd fira-ai
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Setup your Python virtual environment and dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```

---

## 💻 Running the Application

### 1. Tauri Desktop Mode (Recommended)
This runs the Next.js development server, starts the FastAPI server concurrently, and launches the Tauri native wrapper:
```bash
npm run tauri:dev
```
*Note: Press `Cmd+Space` (macOS) or `Ctrl+Space` (Windows/Linux) to hide or focus the window at any time!*

### 2. Standalone Web Mode
If you prefer running the application in a traditional web browser (`localhost:3000`), run:
```bash
npm run dev
```

### 3. Standalone Backend
To start only the FastAPI server on `http://localhost:8000`:
```bash
npm run backend
```

### 4. Legacy Electron Mode (Optional)
If you want to run the project using the legacy Electron wrapper:
```bash
npm run electron:dev
```

---

## 🛠️ Bundling & Packaging for Production

To create a production build with the Python backend compiled as a sidecar:

1. **Package the Python Backend**: Use PyInstaller to compile `backend/app/main.py` into a single standalone executable.
   ```bash
   # Activate your virtual environment and package
   pip install pyinstaller
   pyinstaller --onefile backend/app/main.py --name fira-backend
   ```
2. **Move binary to Tauri sidecars**: Place the packaged binary in `src-tauri/bin/fira-backend-[target]` (replacing `[target]` with your platform's target triple, e.g., `fira-backend-x86_64-unknown-linux-gnu`).
3. **Build the Desktop App**:
   ```bash
   npm run build
   npm run tauri build
   ```

---

## 📜 License

This project is open-source and available under the MIT License.
