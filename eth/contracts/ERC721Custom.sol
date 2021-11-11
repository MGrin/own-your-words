// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ERC721Custom is
  Initializable,
  ContextUpgradeable,
  AccessControlEnumerableUpgradeable,
  ERC721EnumerableUpgradeable,
  ERC721BurnableUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  CountersUpgradeable.Counter internal _tokenIdTracker;

  function initialize(string memory name, string memory symbol)
    public
    virtual
    initializer
  {
    __ERC721Custom_init(name, symbol);
  }

  function __ERC721Custom_init(
    string memory name,
    string memory symbol
  ) internal initializer {
    __Context_init_unchained();
    __ERC165_init_unchained();
    __AccessControl_init_unchained();
    __AccessControlEnumerable_init_unchained();
    __ERC721_init_unchained(name, symbol);
    __ERC721Enumerable_init_unchained();
    __ERC721Burnable_init_unchained();
    __ERC721Custom_init_unchained();
  }

  function __ERC721Custom_init_unchained() internal initializer {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function _mint_with_owner(address to) internal returns (uint256) {
    require(
      hasRole(MINTER_ROLE, _msgSender()),
      string(abi.encodePacked("ERC721Custom: must have minter role to mint"))
    );

    uint256 _tokenId = _tokenIdTracker.current();
    _mint(to, _tokenIdTracker.current());
    _tokenIdTracker.increment();
    return _tokenId; 
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

    return "NOT IMPLEMENTED YET";
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(
      AccessControlEnumerableUpgradeable,
      ERC721Upgradeable,
      ERC721EnumerableUpgradeable
    )
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function retrieveFunds() public {
    require(hasRole(PAUSER_ROLE, _msgSender()), "ERC721Custom: must have pauser role");
    payable(_msgSender()).transfer(address(this).balance);
  }

  uint256[48] private __gap;
}
