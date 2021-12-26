// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC721Custom is
  Initializable,
  ContextUpgradeable,
  AccessControlEnumerableUpgradeable,
  ERC721EnumerableUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  bytes32 public constant ADMIN_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  CountersUpgradeable.Counter internal _tokenIdTracker;

  string internal baseURI;

  function initialize(string memory name, string memory symbol, string memory _baseURI)
    public
    virtual
    initializer
  {
    __ERC721Custom_init(name, symbol, _baseURI);
  }

  function __ERC721Custom_init(
    string memory name,
    string memory symbol,
    string memory _baseURI
  ) internal initializer {
    __Context_init_unchained();
    __ERC165_init_unchained();
    __AccessControl_init_unchained();
    __AccessControlEnumerable_init_unchained();
    __ERC721_init_unchained(name, symbol);
    __ERC721Enumerable_init_unchained();
    __ERC721Custom_init_unchained();
    baseURI = _baseURI;
  }

  function __ERC721Custom_init_unchained() internal initializer {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

    _setupRole(ADMIN_ROLE, _msgSender());
    _setRoleAdmin(ADMIN_ROLE, MINTER_ROLE);
    _setupRole(MINTER_ROLE, _msgSender());
  }

  function _mint_with_owner(address to) internal onlyRole(MINTER_ROLE) returns (uint256) {
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

    return string(abi.encodePacked(baseURI, "/", Strings.toString(tokenId)));
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override (ERC721EnumerableUpgradeable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override (
      AccessControlEnumerableUpgradeable,
      ERC721EnumerableUpgradeable
    )
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function retrieveFunds() public onlyRole(ADMIN_ROLE){
    payable(_msgSender()).transfer(address(this).balance);
  }

  function setBaseURI(string memory newBaseURI) public onlyRole(ADMIN_ROLE) {
    baseURI = newBaseURI;
  }
  

  uint256[48] private __gap;
}
