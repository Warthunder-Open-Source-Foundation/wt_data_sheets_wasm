use std::iter::Sum;
use std::ops::Add;
use crate::console_log;

#[derive(Debug, Clone)]
pub struct Average<V: Sized + Add + Copy> {
	last: Vec<V>,
	// Target length where to result in averages
	len: usize,
}

impl <V: Add + Sum + Copy>Average<V>
	where f64: Sum<V>
{
	pub fn new(len: usize) -> Self {
		Self {
			last: Vec::new(),
			len
		}
	}
	pub fn get_avg(&self) -> f64 {
		self.last.iter().map(|x|*x).sum::<f64>() / self.len as f64
	}
	pub fn insert(&mut self, item: V) {
		self.last.push(item);
		let to_wipe = self.last.len().saturating_sub(self.len);
		for _ in 0..to_wipe {
			self.last.remove(0);
		}
	}
}