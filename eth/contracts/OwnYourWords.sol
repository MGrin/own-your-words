// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Custom.sol";
import "./minters/TwitterPostMinter.sol";

library OwnedWords {
  struct data {
    uint256 id;
    address owner;

    string sn_name;
    string post_id;
    string post_url;
  }

  struct availability {
    uint256 id;
    bool stored;
  }
}

contract OwnYourWords is ERC721Custom {
  using OwnedWords for OwnedWords.data;
  using OwnedWords for OwnedWords.availability;

  mapping(string => OwnedWords.availability) private _owned_words_by_gen_id;
  mapping(uint256 => OwnedWords.data) private _owned_words_by_id;
  TwitterPostMinter public twitterPostMinter;

  function __OwnYourWords__init(string memory name, string memory symbol, string memory baseURI) initializer public  {
    __ERC721Custom_init(name, symbol, string(abi.encodePacked(baseURI, symbol)));
  }

  function mint(
    string memory sn_name,
    string memory post_id,
    string memory post_url,
    address to
  ) external returns (uint256) {
    string memory gen_sn_id = string(
      abi.encodePacked(sn_name, post_id)
    );

    require(
      isPostAvailable(gen_sn_id) == true,
      "OwnYourWords: These words were already minted"
    );
    uint256 _token_id = _mint_with_owner(to);
    _owned_words_by_id[_token_id].id = _token_id;
    _owned_words_by_id[_token_id].owner = to;
    _owned_words_by_id[_token_id].sn_name = sn_name;
    _owned_words_by_id[_token_id].post_id = post_id;
    _owned_words_by_id[_token_id].post_url = post_url;

    _owned_words_by_gen_id[gen_sn_id].id = _token_id;
    _owned_words_by_gen_id[gen_sn_id].stored = true;
    
    return _token_id;
  }

  function isPostAvailable(string memory gen_sn_id) public view returns (bool) {
    OwnedWords.availability memory availability = _owned_words_by_gen_id[gen_sn_id];

    return !availability.stored;
  }

  function getOWWByGenSnId(string memory gen_sn_id) public view returns (OwnedWords.data memory) {
    require(
      !isPostAvailable(gen_sn_id),
      "OwnYourWords: The post was not yet minted"
    );

    uint256 tokenId = _owned_words_by_gen_id[gen_sn_id].id;
    return getOWWByTokenId(tokenId);
  }

  function getOWWByTokenId(uint256 tokenId) public view returns (OwnedWords.data memory) {
    require(_exists(tokenId) == true, "OwnYourWords: The post was not yet minted");

    return _owned_words_by_id[tokenId];
  }

  function mintTwitterPost(
    string memory postId
  ) external payable {
    twitterPostMinter.startMint{ value: msg.value }(postId, _msgSender(), this.mint);
  }

  function updateTwitterPostMinterAddress(address twitterPostMinterAddress) public  onlyRole(ADMIN_ROLE) {
    revokeRole(MINTER_ROLE, address(twitterPostMinter));
    twitterPostMinter = TwitterPostMinter(twitterPostMinterAddress);
    grantRole(MINTER_ROLE, twitterPostMinterAddress);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://rinkeby.oww-api.famio.app/OWW/";
  }

}