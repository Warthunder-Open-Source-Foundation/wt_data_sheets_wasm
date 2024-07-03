/// Designed to buffer values for a certain period before returning the new resulting one, used for frequently updating UI with infrequently updating data
pub struct CompoundValue<T> {
    // List of values inserted
    current: T,
    last: T,
    buff_len: usize,
    buff_at: usize,
}

impl<T: Clone> CompoundValue<T> {
    pub fn new(current: T, len: usize) -> Self {
        Self {
            last: current.clone(),
            current,
            buff_len: len,
            buff_at: 0,
        }
    }
    pub fn get(&mut self, new: T) -> &T {
        return if self.buff_at < self.buff_len {
            self.current = new;
            self.buff_at += 1;
            &self.last
        } else {
            self.last = self.current.clone();
            self.buff_at = 0;
            &self.current
        };
    }
    pub fn get_owned(&mut self, new: T) -> T {
        self.get(new).clone()
    }
}
