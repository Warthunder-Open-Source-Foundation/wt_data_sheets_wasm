use crate::console_log;
use crate::utils::nation_prefix::{is_nation, NATION_PREFIXES};
use crate::BOMBS;
use crate::{get_document, BOMB_MAP};
use lazy_static::lazy_static;
use std::sync::Arc;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;
use wt_datamine_extractor_lib::bombs::bombs::Bomb;

lazy_static! {
    static ref APP_STATE: Arc<Mutex<AppState>> = { Arc::new(Mutex::new(AppState::new())) };
}

struct AppState {
    total_tnt: f64,
    nation_filter: Option<String>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            total_tnt: 0.0,
            nation_filter: None,
        }
    }
}

#[wasm_bindgen]
pub fn render_bombs(nation_filter: &str) {
    let state = APP_STATE.lock().unwrap();
    let document = get_document();
    let table = document.get_element_by_id("tbody").unwrap();
    table.set_inner_html("");

    let mut local_sorted = BOMBS.clone();
    local_sorted.sort_by_key(|bomb| bomb.explosive_mass.round() as u32);
    local_sorted.reverse();

    for bomb in local_sorted.iter() {
        // Filters out nukes and other outliers
        if bomb.explosive_equiv <= 1.0 {
            continue;
        }

        if nation_filter != "none" {
            if nation_filter == "other" {
                if is_nation(&bomb.name).is_some() {
                    continue;
                }
            } else {
                if let Some(item) = is_nation(&bomb.name) {
                    if item.0 != nation_filter {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }

        let row = document.create_element("tr").unwrap();

        let new_field = |content: &str, classes: Option<Vec<(&str, &str)>>| {
            let item = document.create_element("td").unwrap();
            item.set_inner_html(&content);
            if let Some(attrs) = classes {
                for attr in attrs {
                    item.set_attribute(attr.0, attr.1);
                }
            }
            row.append_child(&item);
        };

        row.set_attribute("name", &bomb.name);
        new_field(&bomb.name, None);
        new_field(&bomb.explosive_type.clone(), None);
        new_field(&bomb.explosive_mass.to_string(), None);
        new_field(&bomb.explosive_equiv.to_string(), None);
        new_field(&bomb.weight.to_string(), None);
        new_field(
            &format!("{:.2}", &bomb.explosive_equiv / &bomb.weight),
            None,
        );
        new_field("+", Some(vec![("class", "add_btn"), ("name", &bomb.name)]));

        table.append_child(&row);
    }
}

#[wasm_bindgen]
pub fn render_calc(bomb: &str) {
    let mut state = APP_STATE.lock().unwrap();
    let document = get_document();

    let bomb: &Bomb = BOMB_MAP.get(bomb).unwrap();
    state.total_tnt += bomb.explosive_equiv;
    document
        .get_element_by_id("total_tnt")
        .unwrap()
        .set_inner_html(&format!("{} kg", state.total_tnt));
}

#[wasm_bindgen]
pub fn render_nations() {
    let document = get_document();
    let select = document.get_element_by_id("nation_select").unwrap();

    let option = document.create_element("option").unwrap();
    option.set_inner_html("None");
    option.set_attribute("value", "none");
    select.append_child(&option);

    let option = document.create_element("option").unwrap();
    option.set_inner_html("Other");
    option.set_attribute("value", "other");
    select.append_child(&option);

    for prefix in NATION_PREFIXES {
        let option = document.create_element("option").unwrap();
        option.set_inner_html(prefix.1);
        option.set_attribute("value", prefix.0);
        select.append_child(&option);
    }
}
