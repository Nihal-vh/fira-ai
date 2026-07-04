use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Spawn Sidecar (FastAPI Backend)
      // Note: In development, make sure the sidecar binary exists in src-tauri/bin
      // or run the python server manually.
      if let Ok(sidecar_command) = app.shell().sidecar("fira-backend") {
          if let Ok((mut rx, _child)) = sidecar_command.spawn() {
              tauri::async_runtime::spawn(async move {
                  while let Some(event) = rx.recv().await {
                      if let CommandEvent::Stdout(line) = event {
                          println!("backend: {}", String::from_utf8_lossy(&line));
                      }
                  }
              });
          }
      }

      // Register Global Shortcut
      let shortcut: Shortcut = "CommandOrControl+Space".parse().unwrap();
      app.global_shortcut().on_shortcut(shortcut, move |app, triggered_shortcut, event| {
          if triggered_shortcut == &shortcut && event.state() == ShortcutState::Pressed {
              if let Some(window) = app.get_webview_window("main") {
                  let is_visible = window.is_visible().unwrap_or(false);
                  if is_visible {
                      window.hide().unwrap();
                  } else {
                      window.show().unwrap();
                      window.set_focus().unwrap();
                  }
              }
          }
      }).unwrap();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
