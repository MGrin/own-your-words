// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./minters/TwitterPostMinter.sol";
import "./utils/OwnedWords.sol";

contract OwnYourWords is
    Initializable, ContextUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721PausableUpgradeable
{
    function initialize(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) public virtual initializer {
        __OwnYourWords_init(name, symbol, baseTokenURI);
    }
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using OwnedWords for OwnedWords.data;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    CountersUpgradeable.Counter private _tokenIdTracker;

    string private _baseTokenURI;

    TwitterPostMinter private twitterPostMinter;

    function __OwnYourWords_init(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) internal onlyInitializing {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        __ERC721_init_unchained(name, symbol);
        __ERC721Enumerable_init_unchained();
        __Pausable_init_unchained();
        __ERC721Pausable_init_unchained();
        __OwnYourWords_init_unchained(baseTokenURI);
    }

    function __OwnYourWords_init_unchained(
        string memory baseTokenURI
    ) internal onlyInitializing {
        _baseTokenURI = baseTokenURI;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        _setupRole(ADMIN_ROLE, _msgSender());
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function mint(address to) external returns (uint256) {
        require(hasRole(MINTER_ROLE, _msgSender()), "OwnYourWords: must have minter role to mint");

        uint256 _token_id = _tokenIdTracker.current();

        _mint(to, _token_id);
        _tokenIdTracker.increment();

        return _token_id;
    }

    function mintTwitterPost(string memory postId) external payable {
      twitterPostMinter.startMint{ value: msg.value }(postId, _msgSender(), this.mint);
    }

    function isAvailable(string memory sn_name, string memory sn_id) public view returns (bool) {
      bytes32 encodedSnName = keccak256(abi.encodePacked(sn_name));

      if (twitterPostMinter.getSnName() == encodedSnName) {
        return twitterPostMinter.isAvailable(sn_id);
      }

      return false;
    }

    function getOWWBySnId(string memory sn_name, string memory sn_id) public view returns (OwnedWords.data memory) {
      require(
        !isAvailable(sn_name, sn_id),
        "OwnYourWords: The post was not yet minted"
      );

      bytes32 encodedSnName = keccak256(abi.encodePacked(sn_name));

      if (twitterPostMinter.getSnName() == encodedSnName) {
        return twitterPostMinter.getOWWBySnId(sn_id);
      }

      require(false, "OwnYourWords: Unsupported social network"); 
    }

    function getOWWByTokenId(uint256 tokenId) public view returns (OwnedWords.data memory) {
      require(_exists(tokenId) == true, "OwnYourWords: The post was not yet minted");

      if (twitterPostMinter.tokenExists(tokenId)) {
        return twitterPostMinter.getOWWByTokenId(tokenId);
      }

      require(false, "OwnYourWords: The post was not yet minted");
    }

    function setTwitterPostMinterAddress(address twitterPostMinterAddress) public {
      require(hasRole(ADMIN_ROLE, _msgSender()), "OwnYourWords: must have admin role to mint");

      revokeRole(MINTER_ROLE, address(twitterPostMinter));
      twitterPostMinter = TwitterPostMinter(twitterPostMinterAddress);
      grantRole(MINTER_ROLE, twitterPostMinterAddress);
    }

    function pause() public {
        require(hasRole(PAUSER_ROLE, _msgSender()), "OwnYourWords: must have pauser role to pause");
        _pause();
    }

    function unpause() public {
        require(hasRole(PAUSER_ROLE, _msgSender()), "OwnYourWords: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721EnumerableUpgradeable, ERC721PausableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerableUpgradeable, ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function retrieveFunds() public onlyRole(ADMIN_ROLE){
      payable(_msgSender()).transfer(address(this).balance);
    }

    function setBaseURI(string memory newBaseURI) public onlyRole(ADMIN_ROLE) {
      _baseTokenURI = newBaseURI;
    }


    function baseTokenURI() public view returns (string memory) {
      return _baseTokenURI;
    }

    function tokenURI(uint256 _tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(baseTokenURI(), "OWW", Strings.toString(_tokenId)));
    }

    uint256[48] private __gap;
}
