// SPDX-License-Identifier: MIT ①

pragma solidity ^0.8.0;

import "./ERC721PresetMinterAutoIdUpgradeable.sol";

library MintedPost {
  struct data {
    uint256 id;
    string sn_name;
    string author_id;
    string author_name;
    string author_picture_url;
    string post_id;
    string post_url;
    string message;
    string token_uri;
    uint256 isValue;
  }
}

contract OwnedWords is ERC721PresetMinterAutoIdUpgradeable {
  using MintedPost for MintedPost.data;

  function getVersion() public pure returns (string memory) {
    return "1.0.2";
  }

  function initialize() public virtual initializer {
    __OwnedWords_init();
  }

  function __OwnedWords_init() internal initializer {
    __ERC721PresetMinterAutoId_init("OwnedWords", "OWW");
  }

  mapping(uint256 => MintedPost.data) private _owned_posts_by_id;
  mapping(string => MintedPost.data) private _owned_posts_by_gen_id;
  mapping(address => uint256[]) private _owned_tokens_by_address;

  function mint(
    string memory sn_name,
    string memory author_id,
    string memory author_name,
    string memory author_picture_url,
    string memory post_id,
    string memory post_url,
    string memory message,
    string memory token_uri
  ) public virtual returns (uint256) {
    string memory gen_id = string(
      abi.encodePacked(sn_name, author_id, post_id)
    );
    require(
      _owned_posts_by_gen_id[gen_id].isValue != 457,
      "OwnedWords: The post was already minted"
    );

    uint256 _token_id = _mint_without_owner(msg.sender);
    _owned_posts_by_id[_token_id].id = _token_id;
    _owned_posts_by_id[_token_id].sn_name = sn_name;
    _owned_posts_by_id[_token_id].author_id = author_id;
    _owned_posts_by_id[_token_id].author_name = author_name;
    _owned_posts_by_id[_token_id].author_picture_url = author_picture_url;
    _owned_posts_by_id[_token_id].post_id = post_id;
    _owned_posts_by_id[_token_id].post_url = post_url;
    _owned_posts_by_id[_token_id].message = message;
    _owned_posts_by_id[_token_id].token_uri = token_uri;
    _owned_posts_by_id[_token_id].isValue = 457;

    _owned_posts_by_gen_id[gen_id] = _owned_posts_by_id[_token_id];
    _owned_tokens_by_address[msg.sender].push(_token_id);

    return _token_id;
  }

  function getPostUrl(uint256 tokenId) public view returns (string memory) {
    require(
      _exists(tokenId),
      "OwnedWords: POST URL query for nonexistent token"
    );

    return _owned_posts_by_id[tokenId].post_url;
  }

  function getTokens() public view returns (uint256[] memory) {
    return _owned_tokens_by_address[msg.sender];
  }

  function getTokenIdForPost(
    string memory sn_name,
    string memory author_id,
    string memory post_id
  ) public view returns (uint256) {
    string memory gen_id = string(
      abi.encodePacked(sn_name, author_id, post_id)
    );
    require(
      _owned_posts_by_gen_id[gen_id].isValue == 457,
      "OwnedWords: The post is not yet minted"
    );

    return _owned_posts_by_gen_id[gen_id].id;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    return _owned_posts_by_id[tokenId].token_uri;
  }
}
