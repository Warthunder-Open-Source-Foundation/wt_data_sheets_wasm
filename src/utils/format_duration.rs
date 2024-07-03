struct TimeItem<'a> {
    // Regular name
    name: &'a str,
    // Prefix used to pluralize the name
    plural: &'a str,
    // Multiple of seconds required for this item to "exist"
    seconds_mult: u64,
}

impl<'a> TimeItem<'a> {
    fn format_time(&self, seconds: &mut u64) -> Option<String> {
        let ratio = *seconds as f64 / self.seconds_mult as f64;
        let floored = ratio.floor();

        *seconds = *seconds - ratio as u64 * self.seconds_mult;
        if ratio >= 1.0 {
            return if ratio < 2.0 {
                Some(format!("{floored} {}", self.name))
            } else {
                Some(format!("{floored} {}{}", self.name, self.plural))
            };
        }
        None
    }
}

const TIME_ITEMS: &[TimeItem; 5] = &[
    TimeItem {
        name: "year",
        plural: "s",
        seconds_mult: 60 * 60 * 24 * 365,
    },
    TimeItem {
        name: "day",
        plural: "s",
        seconds_mult: 60 * 60 * 24,
    },
    TimeItem {
        name: "hour",
        plural: "s",
        seconds_mult: 60 * 60,
    },
    TimeItem {
        name: "minute",
        plural: "s",
        seconds_mult: 60,
    },
    TimeItem {
        name: "second",
        plural: "s",
        seconds_mult: 1,
    },
];

pub fn format_duration(seconds: u64) -> String {
    if seconds == 0 {
        return "now".to_owned();
    }

    let mut seconds = seconds;
    let mut results = vec![];

    for time_item in TIME_ITEMS {
        if let Some(time_item) = time_item.format_time(&mut seconds) {
            results.push(time_item);
        }
    }

    let mut total = "".to_owned();
    if results.len() == 1 {
        return results[0].clone();
    }

    while results.len() > 2 {
        total.push_str(&format!("{}, ", results[0]));
        results.remove(0);
    }
    format!("{total}{} and {}", results[0], results[1])
}
