#![feature(proc_macro, wasm_custom_section, wasm_import_module)]
#![feature(use_extern_macros)]
extern crate wasm_bindgen;
extern crate regex;
extern crate serde_json;

use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use regex::Regex;
use std::u64::MAX;


#[wasm_bindgen]
pub fn clusterer_and_rankerer(file_contents: &str) -> String {
  
  let mut file_contents_iterator = file_contents.lines();
  let normalized_city_regex = Regex::new(r"/^[A-Za-z]+$/").unwrap();
  
  let row_titles: Vec<&str> = match file_contents_iterator.next() {
    Some(line) => line.split(',').collect(),
    None => vec![]
  };
  
  let afghan_cities_incidents: HashMap<String, Vec<HashMap<&str, &str>>> = match row_titles.len() {
    0 => HashMap::new(),
    _ => file_contents_iterator
      .map(|line| 
        row_titles
          .iter()
          .zip(line.split(','))
          .map(|(x, y)| (*x, y))
          .collect::<HashMap<&str, &str>>()
      )
      .filter(|incident_record| match incident_record.get("country") {
        Some(country) => *country == "4",
        None => false
      })
      .fold(HashMap::new(), |mut city_incidents, incident_record| match incident_record.get("city") {
        Some(city) => {
          let normalized_city = normalized_city_regex.replace_all(city, "").into_owned().to_lowercase();
          city_incidents
            .entry(normalized_city)
            .or_insert(vec![])
            .push(incident_record.clone());
          return city_incidents;
        },
        None => {
          city_incidents.insert(String::from("unclassified"), vec![]);
          return city_incidents;
        }
      })
  };
  
  let starting_tuplet = (MAX, 0);
  let afghan_city_minmaxincident_pair: (u64, u64) = afghan_cities_incidents
    .iter()
    .filter(|(city, _)| {
      return *city != "unclassified" && *city != "unknown";
    })
    .fold(starting_tuplet, |(least_incidents_sofar, greatest_incidents_sofar), (_, incidents_list)| {
      let current_city_incidents = incidents_list.len() as u64;
      
      let mut true_least_incidents = least_incidents_sofar;
      let mut true_greatest_incidents = greatest_incidents_sofar;
      if current_city_incidents > greatest_incidents_sofar {
        true_greatest_incidents = current_city_incidents;
      }
      if current_city_incidents < least_incidents_sofar {
        true_least_incidents = current_city_incidents;
      }
      
      return (true_least_incidents, true_greatest_incidents);
    });
  if afghan_city_minmaxincident_pair == starting_tuplet {
    return String::from("null");
  }
  
  let mut rank_step_size = (afghan_city_minmaxincident_pair.1 - afghan_city_minmaxincident_pair.0) / 5;
  if rank_step_size == 0 {
    rank_step_size = 1;
  }
  
  let clustered_and_ranked_incidents = afghan_cities_incidents
    .iter()
    .filter(|(city, _)| {
      return *city != "unclassified" && *city != "unknown";
    })
    .map(|(city, incidents_list)| (city.to_owned(), incidents_list.len() as u64 / rank_step_size))
    .collect::<HashMap<String, u64>>();
  
  return match serde_json::to_string(&clustered_and_ranked_incidents) {
    Ok(json) => json,
    Err(_) => String::from("null")
  };
}
