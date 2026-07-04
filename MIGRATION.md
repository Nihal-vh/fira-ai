# Migration from Electron to Tauri + Python FastAPI

We have successfully scaffolded the transition from Electron to Tauri.

## Key Changes

1.  **Tauri Integration**: Added `src-tauri` directory with configuration for window management and global shortcuts.
2.  **Python Backend**: Created a `backend/` directory with a FastAPI application and SQLite integration using SQLAlchemy.
3.  **Frontend API Layer**: Added `app/lib/api.ts` to facilitate communication between the Next.js frontend and the Python backend.
4.  **Global Shortcut**: Re-implemented the `CommandOrControl+Space` shortcut in Rust (`src-tauri/src/lib.rs`).
5.  **Development Workflow**: Updated `package.json` to run Next.js and FastAPI concurrently during development.

## Setup Instructions

### 1. Install Rust and System Dependencies
Tauri requires Rust and several system libraries. Run the following to install them:

**System Dependencies (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev build-essential curl wget file libssl-dev
```

**Rust:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
*Note: You may need to restart your terminal after installing Rust.*

### 2. Python Environment
We have installed the necessary dependencies for you. If you need to install them manually again:
```bash
python3 -m pip install --user --break-system-packages -r backend/requirements.txt
```

### 3. Running the App
To start the development environment (Next.js + FastAPI + Tauri):
```bash
npm run tauri:dev
```
If you just want to run the frontend and backend without Tauri:
```bash
npm run dev
```

## Next Steps

- **Sidecar Packaging**: To bundle the Python backend with the Tauri executable for production, you'll need to package the FastAPI app using `pyinstaller` and place the resulting binary in `src-tauri/bin/fira-backend-[target]`.
- **Database Migrations**: Consider using `alembic` for managing SQLite schema changes as the project grows.
- **Remove Electron**: Once you are confident with the Tauri setup, you can remove `main.js` and Electron-related dependencies from `package.json`.

## Architecture Overview

```mermaid
graph TD
    User([User]) <--> TauriWindow[Tauri Window / Next.js]
    TauriWindow <--> FastAPI[FastAPI Backend / Python]
    FastAPI <--> SQLite[(SQLite DB)]
    TauriWindow <--> Rust[Tauri Core / Rust]
    Rust -- Spawns --Sidecar--> FastAPI
```
