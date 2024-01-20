use std::time::Instant;

use crate::{
    http::{build_request, Request, Response, ResponseTiming},
    Data, State,
};

#[tauri::command]
#[specta::specta]
pub async fn execute_request(
    state: tauri::State<'_, State>,
    request: Request,
) -> Result<Response, ()> {
    let start = Instant::now();
    let (client, built) = match &state.0.lock().await.as_ref() {
        Some(data) if data.options == request.options => (data.client.clone(), false),
        _ => {
            let client = request.options.build().unwrap();
            (client, true)
        }
    };

    if built {
        *state.0.lock().await = Some(Data {
            client: client.clone(),
            options: request.options.clone(),
        });
    }
    let client_creation = start.elapsed().as_micros();

    let start = Instant::now();
    let reqwest_request = build_request(&client, request.clone()).unwrap();
    let request_creation = start.elapsed().as_micros();

    let start = Instant::now();
    let res = client.execute(reqwest_request).await.unwrap();
    let response = start.elapsed().as_micros();

    let start = Instant::now();
    let status = res.status().as_u16();
    let resulting_url = res.url().to_string();
    let headers = res.headers().clone();
    let remote_addr = res.remote_addr();
    let version = res.version().into();
    let content_length = res.content_length();
    let body = res.text().await.unwrap();
    let text_parsing = start.elapsed().as_micros();

    Ok(Response {
        method: request.method,
        url: resulting_url,
        status,
        content_length: content_length.unwrap_or(body.len() as u64),
        body,
        timing: ResponseTiming {
            client_creation,
            request_creation,
            response,
            text_parsing,
        },
        headers: headers
            .into_iter()
            .map(|(name, value)| {
                (
                    name.map(|a| a.to_string()),
                    value.to_str().unwrap().to_string(),
                )
            })
            .collect::<Vec<(_, _)>>(),
        remote_addr,
        version,
    })
}
