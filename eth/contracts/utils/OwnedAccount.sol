// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library OwnedAccount {
  struct data {
    uint256 id;

    string sn_name;
    string sn_id;
    string sn_url;
  }

  struct availability {
    uint256 id;
    bool stored;
  }
}