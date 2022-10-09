
pub const NATION_PREFIXES: &[(&str, &str)] = &[
	("su", "Russia"),
	("de", "Germany"),
	("fr", "France"),
	("us", "USA"),
	("jp", "Japan"),
	("cn", "China"),
	("swd", "Sweden"),
	("uk", "Great Britain"),
	("it", "Italy"),
	("il", "Israel"),
];

pub fn is_nation(prefix: &str) -> Option<(&'static str, &'static str)> {
	for item in NATION_PREFIXES {
		if prefix.starts_with(item.0) {
			return Some(*item)
		}
	}
	None
}