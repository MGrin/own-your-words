// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library OwnedWords {
  struct data {
    uint256 id;

    string sn_name;
    string post_id;
    string post_url;
  }

  struct availability {
    uint256 id;
    bool stored;
  }
}