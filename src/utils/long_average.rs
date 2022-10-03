use std::iter::Sum;
use std::ops::Add;

#[derive(Debug, Clone)]
pub struct LongAverage<T: Sized + Add + Copy + 'static + Sum + PartialOrd> {
	vals: Vec<T>,
}

impl<T: Sized + Add + Copy + 'static + Sum + PartialOrd> LongAverage<T> where f64: Sum<T>, f64: From<T> {
	pub fn new() -> Self {
		Self {
			vals: Vec::new(),
		}
	}
	pub fn push(&mut self, value: T) {
		self.vals.push(value);
	}
	pub fn append(&mut self, mut values: Vec<T>) {
		self.vals.append(&mut values)
	}
	pub fn take_avg(&self, n: usize) -> f64 {
		let idx = self.vals.len().saturating_sub(n);
		return if idx != 0 {
			self.vals[idx..].iter().map(|x| *x).sum::<f64>() / n as f64
		} else {
			0.0
		};
	}
	/// Returns n recent values, substituting with when less values than n are present
	pub fn take_n(&self, n: usize, substitute: Option<T>) -> Vec<T> {
		let mut base = vec![];

		if self.vals.len() < n {
			if let Some(sub) = substitute {
				base.extend_from_slice(&vec![sub; n - self.vals.len()]);
			}
			base.extend_from_slice(&self.vals);
		} else {
			base.extend_from_slice(&self.vals[n..]);
		}
		base
	}

	pub fn max(&self) -> T {
		*self.vals.iter().max_by(|a,b|(f64::from(**a)).total_cmp(&f64::from(**b))).expect("Total CMP never fails!")
	}
}

// #[test]
// fn test_average_singular() {
// 	let mut avg = LongAverage::new();
// 	let vec: Vec<f64> = vec![0;30].iter().enumerate().map(|(idx, _)|idx as f64).collect();
// 	println!("{:?}", vec.clone());
// 	avg.append(vec);
// 	println!("{}", avg.take_avg(2));
// }
