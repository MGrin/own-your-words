// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

struct QueueUints256 {
  uint256[] items;
  uint8 head;
  uint8 tail;
  uint8 used;
  uint8 size;
}

library QueueUints256Funs {
  function create(QueueUints256 storage self, uint8 size) internal {
    self.head = 0;
    self.tail = 0;
    self.used = 0;
    self.size = size;

    while (self.items.length < size) {
      self.items.push();
    }
  }
  
  function append(QueueUints256 storage self, uint item) internal
  returns (bool result) {
    if (self.used < self.items.length) {
      self.items[self.tail] = item;
      self.tail = uint8((self.tail + 1) % self.items.length);
      self.used++;
      return true;
    }
  }
  
  function remove(QueueUints256 storage self) internal 
  returns (uint256 item, bool result) {
    if (self.used > 0) {
      item = self.items[self.head];
      self.head = uint8((self.head + 1) % self.items.length);
      self.used--;
      result = true;
    }
  }
}