const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const { ZERO_ADDRESS } = constants;
const { shouldSupportInterfaces } = require("./SupportsInterface.behavior");

const { expect } = require("chai");

const OwnedWords = artifacts.require("OwnedWords");

contract("OwnedWords", function (accounts) {
  const [deployer, other] = accounts;

  const name = "OwnedWords";
  const symbol = "OWW";
  const mint_args = [
    "test",
    "1234",
    "TEST",
    "http://test.test/test",
    "7890",
    "http://test.test/posts/7890",
    "TEST TEST TEST",
    "ipfs:trololo",
  ];
  const DEFAULT_ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const MINTER_ROLE = web3.utils.soliditySha3("MINTER_ROLE");

  beforeEach(async function () {
    this.token = await deployProxy(OwnedWords);
  });

  shouldSupportInterfaces([
    "ERC721",
    "ERC721Enumerable",
    "AccessControl",
    "AccessControlEnumerable",
  ]);

  it("token has correct name", async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it("token has correct symbol", async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it("deployer has the default admin role", async function () {
    expect(
      await this.token.getRoleMemberCount(DEFAULT_ADMIN_ROLE)
    ).to.be.bignumber.equal("1");
    expect(await this.token.getRoleMember(DEFAULT_ADMIN_ROLE, 0)).to.equal(
      deployer
    );
  });

  it("deployer has the minter role", async function () {
    expect(
      await this.token.getRoleMemberCount(MINTER_ROLE)
    ).to.be.bignumber.equal("1");
    expect(await this.token.getRoleMember(MINTER_ROLE, 0)).to.equal(deployer);
  });

  it("minter role admin is the default admin", async function () {
    expect(await this.token.getRoleAdmin(MINTER_ROLE)).to.equal(
      DEFAULT_ADMIN_ROLE
    );
  });

  describe("minting", function () {
    it("everyone can mint", async function () {
      const tokenId = new BN("0");

      const receipt = await this.token.mint(...mint_args, {
        from: other,
      });
      expectEvent(receipt, "Transfer", {
        from: ZERO_ADDRESS,
        tokenId,
      });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal("1");
      expect(await this.token.ownerOf(tokenId)).to.equal(other);

      expect(await this.token.tokenURI(tokenId)).to.equal(mint_args[7]);
    });

    it("already minted post can not be minted", async function () {
      let tokenId = new BN("0");

      const receipt = await this.token.mint(...mint_args, {
        from: other,
      });
      expectEvent(receipt, "Transfer", {
        from: ZERO_ADDRESS,
        to: other,
        tokenId,
      });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal("1");
      expect(await this.token.ownerOf(tokenId)).to.equal(other);

      tokenId = new BN("1");

      await expectRevert(
        this.token.mint(...mint_args, {
          from: other,
        }),
        "OwnedWords: The post was already minted"
      );
    });

    it("can retrieve list of token ids for sender", async function () {
      let tokenId = new BN("0");

      let receipt = await this.token.mint(...mint_args, {
        from: other,
      });
      expectEvent(receipt, "Transfer", {
        from: ZERO_ADDRESS,
        to: other,
        tokenId,
      });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal("1");
      expect(await this.token.ownerOf(tokenId)).to.equal(other);

      tokenId = new BN("1");

      const another_mint_args = [...mint_args];
      another_mint_args[1] = "1222";

      receipt = await this.token.mint(...another_mint_args, {
        from: other,
      });
      expectEvent(receipt, "Transfer", {
        from: ZERO_ADDRESS,
        to: other,
        tokenId,
      });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal("2");
      expect(await this.token.ownerOf(tokenId)).to.equal(other);

      const listOfOwnedTokens = await this.token.getTokens({
        from: other,
      });
      expect(listOfOwnedTokens).to.have.lengthOf(2);
      expect(listOfOwnedTokens[0]).to.have.lengthOf(1);
      expect(listOfOwnedTokens[1]).to.have.lengthOf(1);
      expect(listOfOwnedTokens[0].words).to.include(0);
      expect(listOfOwnedTokens[1].words).to.include(1);
    });

    it("can know if the post was already minted", async function () {
      let tokenId = new BN("0");

      let receipt = await this.token.mint(...mint_args, {
        from: other,
      });
      expectEvent(receipt, "Transfer", {
        from: ZERO_ADDRESS,
        to: other,
        tokenId,
      });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal("1");
      expect(await this.token.ownerOf(tokenId)).to.equal(other);

      const tokenIdForPost = await this.token.getTokenIdForPost(
        mint_args[0],
        mint_args[1],
        mint_args[4]
      );
      expect(tokenIdForPost).to.be.bignumber.equal("0");

      const another_mint_args = [...mint_args];
      another_mint_args[1] = "1222";

      await expectRevert(
        this.token.getTokenIdForPost(
          another_mint_args[0],
          another_mint_args[1],
          another_mint_args[4]
        ),
        "OwnedWords: The post is not yet minted"
      );
    });
  });

  describe("burning", function () {
    it("holders can burn their tokens", async function () {
      const tokenId = new BN("0");

      await this.token.mint(...mint_args, { from: other });

      const receipt = await this.token.burn(tokenId, { from: other });

      expectEvent(receipt, "Transfer", {
        from: other,
        to: ZERO_ADDRESS,
        tokenId,
      });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal("0");
      expect(await this.token.totalSupply()).to.be.bignumber.equal("0");
    });
  });

  describe("contract version", function () {
    it("should return the contract version", async function () {
      expect(await this.token.getVersion({ from: other })).to.equal("1.0.0");
    });
  });
});
