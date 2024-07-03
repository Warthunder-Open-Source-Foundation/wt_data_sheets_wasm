use crate::console_log;
use average::{MeanWithError, Variance};
use std::iter::Sum;
use std::ops::Add;

#[derive(Debug, Clone)]
pub struct Average<V: Sized + Add + Copy + 'static> {
    last: Vec<V>,
    // Target length where to result in averages
    len: usize,
}

impl<V: Add + Sum + Copy> Average<V>
where
    f64: Sum<V>,
    Variance: FromIterator<V>,
{
    pub fn new(len: usize) -> Self {
        Self {
            last: Vec::new(),
            len,
        }
    }
    pub fn get_avg(&self) -> f64 {
        let variance = Variance::from_iter(self.last.iter().map(|x| *x));
        let avg = MeanWithError::from(variance).mean();
        avg / self.last.len() as f64
    }
    pub fn insert(&mut self, item: V) {
        // Prefills empty average with first value to prevent under-averaging
        if self.last.len() == 0 {
            self.last = vec![item; self.len];
        } else {
            self.last.push(item);
        }

        let to_wipe = self.last.len().saturating_sub(self.len);
        for _ in 0..to_wipe {
            self.last.remove(0);
        }
    }
}

// #[test]
// fn test_average_singular() {
// 	let mut avg = Average::new(10);
// 	let n = 42.1;
// 	avg.insert(n);
// 	assert_eq!(avg.get_avg(), n);
// }
//
// #[test]
// fn test_average_two() {
// 	let mut avg = Average::new(10);
// 	let n = 42.1;
// 	avg.insert(n);
// 	assert_eq!(avg.get_avg(), n);
// }
