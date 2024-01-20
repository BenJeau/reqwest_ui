// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod http;

use std::sync::Arc;
use tauri::async_runtime::Mutex;

use tauri::Manager;
use tauri_specta::ts;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[cfg(target_os = "windows")]
use window_blur::apply_blur;

pub struct Data {
    pub client: reqwest::Client,
    pub options: http::ClientOptions,
}

pub struct State(Arc<Mutex<Option<Data>>>);

fn main() {
    let specta_builder = {
        let specta_builder = ts::builder()
            .commands(tauri_specta::collect_commands![commands::execute_request])
            .config(
                specta::ts::ExportConfig::default()
                    .formatter(specta::ts::prettier)
                    .bigint(specta::ts::BigIntExportBehavior::Number),
            );

        #[cfg(debug_assertions)]
        let specta_builder = specta_builder.path("../src/bindings.ts");

        specta_builder.into_plugin()
    };

    tauri::Builder::default()
        .manage(State(Arc::new(Mutex::new(None))))
        .plugin(specta_builder)
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler!())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
