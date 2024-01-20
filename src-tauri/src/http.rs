use reqwest::{self, redirect::Policy, Client};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{collections::HashMap, net::SocketAddr, time::Duration};

pub fn build_request(client: &Client, request: Request) -> reqwest::Result<reqwest::Request> {
    let mut builder = client.request(request.method.into(), request.url);

    if let Some(body) = request.body {
        builder = builder.body(body);
    }

    if let Some(version) = request.options.request_timeout() {
        builder = builder.timeout(version);
    }

    for (key, value) in request.headers {
        builder = builder.header(key, value);
    }

    builder.version(request.options.http_version.into()).build()
}

#[derive(Serialize, Deserialize, Type, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Method {
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Head,
    Options,
}

impl From<Method> for reqwest::Method {
    fn from(value: Method) -> Self {
        match value {
            Method::Get => reqwest::Method::GET,
            Method::Post => reqwest::Method::POST,
            Method::Put => reqwest::Method::PUT,
            Method::Delete => reqwest::Method::DELETE,
            Method::Patch => reqwest::Method::PATCH,
            Method::Head => reqwest::Method::HEAD,
            Method::Options => reqwest::Method::OPTIONS,
        }
    }
}

#[derive(Deserialize, Type, Clone)]
pub struct Request {
    pub method: Method,
    pub url: String,
    pub body: Option<String>,
    pub headers: HashMap<String, String>,
    #[serde(default)]
    pub options: ClientOptions,
}

#[derive(Deserialize, Default, Type, PartialEq, Eq, Clone)]
pub struct ClientOptions {
    #[serde(default = "default_timeout")]
    request_timeout_ms: u64,
    #[serde(default = "default_timeout")]
    connect_timeout_ms: u64,
    #[serde(default)]
    http_version: HttpVersion,
    #[serde(default)]
    accept_invalid_certs: bool,
    #[serde(default)]
    max_redirects: Option<usize>,
    #[serde(default)]
    https_only: bool,
    #[serde(default)]
    proxy: Option<Proxy>,
    #[serde(default = "default_user_agent")]
    user_agent: String,
    #[serde(default)]
    disable_brotli: bool,
    #[serde(default)]
    disable_gzip: bool,
    #[serde(default)]
    disable_deflate: bool,
}

fn default_user_agent() -> String {
    format!("reqwest-ui/{} (http client)", env!("CARGO_PKG_VERSION"))
}

impl ClientOptions {
    pub fn build(&self) -> reqwest::Result<Client> {
        let mut builder = reqwest::ClientBuilder::new()
            .danger_accept_invalid_certs(self.accept_invalid_certs)
            .redirect(self.redirect_policy())
            .https_only(self.https_only)
            .user_agent(self.user_agent.clone())
            .tcp_keepalive(Duration::from_secs(5))
            .http1_title_case_headers();

        if self.http_version == HttpVersion::H2 {
            builder = builder.http2_prior_knowledge().use_rustls_tls();
        }

        if self.disable_brotli {
            builder = builder.no_brotli();
        }

        if self.disable_gzip {
            builder = builder.no_gzip();
        }

        if self.disable_deflate {
            builder = builder.no_deflate();
        }

        if let Some(timeout) = self.connect_timeout() {
            builder = builder.connect_timeout(timeout);
        }

        if let Some(proxy) = &self.proxy {
            builder = builder.proxy(proxy.into());
        }

        builder.build()
    }
}

#[derive(Deserialize, Type, PartialEq, Eq, Clone)]
struct Proxy {
    policy: ProxyPolicy,
    no: Option<String>,
}

#[derive(Deserialize, Type, PartialEq, Eq, Clone)]
#[serde(tag = "type", content = "content")]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
enum ProxyPolicy {
    Http(String),
    Https(String),
    All(String),
}

impl From<&Proxy> for reqwest::Proxy {
    fn from(value: &Proxy) -> Self {
        let mut proxy = match &value.policy {
            ProxyPolicy::Http(url) => reqwest::Proxy::http(url).unwrap(),
            ProxyPolicy::Https(url) => reqwest::Proxy::https(url).unwrap(),
            ProxyPolicy::All(url) => reqwest::Proxy::all(url).unwrap(),
        };
        if let Some(no) = &value.no {
            proxy = proxy.no_proxy(Some(reqwest::NoProxy::from_string(no).unwrap()));
        }
        proxy
    }
}

fn default_timeout() -> u64 {
    5000
}

impl ClientOptions {
    fn request_timeout(&self) -> Option<Duration> {
        if self.request_timeout_ms == 0 {
            None
        } else {
            Some(Duration::from_millis(self.request_timeout_ms))
        }
    }

    fn connect_timeout(&self) -> Option<Duration> {
        if self.connect_timeout_ms == 0 {
            None
        } else {
            Some(Duration::from_millis(self.connect_timeout_ms))
        }
    }

    fn redirect_policy(&self) -> Policy {
        if let Some(max_redirects) = self.max_redirects {
            Policy::limited(max_redirects)
        } else {
            Policy::default()
        }
    }
}

#[derive(Deserialize, serde::Serialize, Default, Type, PartialEq, Eq, Clone)]
pub enum HttpVersion {
    Http09,
    Http10,
    #[default]
    Http11,
    H2,
    H3,
}

impl From<HttpVersion> for reqwest::Version {
    fn from(value: HttpVersion) -> Self {
        match value {
            HttpVersion::Http09 => reqwest::Version::HTTP_09,
            HttpVersion::Http10 => reqwest::Version::HTTP_10,
            HttpVersion::Http11 => reqwest::Version::HTTP_11,
            HttpVersion::H2 => reqwest::Version::HTTP_2,
            HttpVersion::H3 => reqwest::Version::HTTP_3,
        }
    }
}

impl From<reqwest::Version> for HttpVersion {
    fn from(value: reqwest::Version) -> Self {
        match value {
            reqwest::Version::HTTP_09 => HttpVersion::Http09,
            reqwest::Version::HTTP_10 => HttpVersion::Http10,
            reqwest::Version::HTTP_11 => HttpVersion::Http11,
            reqwest::Version::HTTP_2 => HttpVersion::H2,
            reqwest::Version::HTTP_3 => HttpVersion::H3,
            _ => unreachable!("unknown http version"),
        }
    }
}

#[derive(Serialize, Type)]
pub struct ResponseTiming {
    pub client_creation: u128,
    pub request_creation: u128,
    pub response: u128,
    pub text_parsing: u128,
}

#[derive(Serialize, Type)]
pub struct Response {
    pub method: Method,
    pub url: String,
    pub status: u16,
    pub body: String,
    pub timing: ResponseTiming,
    pub headers: Vec<(std::option::Option<String>, String)>,
    pub remote_addr: Option<SocketAddr>,
    pub version: HttpVersion,
    pub content_length: u64,
}
