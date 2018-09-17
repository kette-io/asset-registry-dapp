pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract AssetRegistry is ERC721Token, Ownable {

    /*** EVENTS ***/
    /// The event emitted (useable by web3) when a token is purchased
    event BoughtToken(address indexed buyer, uint256 tokenId);

    /*** CONSTANTS ***/
    uint8 constant DESCRIPTION_MIN_LENGTH = 1;
    uint8 constant DESCRIPTION_MAX_LENGTH = 64;

    /*** DATA TYPES ***/

    /// Price set by contract owner for each token in Wei.
    /// @dev If you'd like a different price for each token type, you will
    /// need to use a mapping like: `mapping(uint256 => uint256) tokenTypePrices;`
    uint256 currentRegistrationPrice = 3000000000000000;

    //every asset has an image attached to it stored on ipfs. this is the corresponding hash
    mapping(string => string) ipfsImageHashes;
    //short description of your asset
    mapping(string => string) tokenDescriptions;
    //short description of your asset
    mapping(uint256 => string) uniqueTokensIds;

    constructor() ERC721Token("KETTE Asset Registry", "KET") public {
    // any init code when you deploy the contract would run here
    }

    /// Requires the amount of Ether be at least or more of the currentRegistrationPrice
    /// @dev Creates an instance of an token and mints it to the purchaser
    /// @param _ipfsImageHash hash of the image of the asset on ipfs
    /// @param _description The short description of the asset
    /// @param _uniqueId the ID by which the asset is uniquely idenitifable
    function buyToken (
        string _ipfsImageHash,
        string _description,
        string _uniqueId
  ) external payable {
        bytes memory __descriptionBytes = bytes(_description);
        require(__descriptionBytes.length >= DESCRIPTION_MIN_LENGTH, "_description is too short");
        require(__descriptionBytes.length <= DESCRIPTION_MAX_LENGTH, "_description is too long");
        require(bytes(tokenDescriptions[_uniqueId]).length == 0, "token with this uniqueId already exists");

        require(msg.value >= currentRegistrationPrice, "Amount of Ether sent too small");
        uint256 index = allTokens.length + 1;
        _mint(msg.sender, index);
        
        uniqueTokensIds[index] = _uniqueId;
        ipfsImageHashes[_uniqueId] = _ipfsImageHash;
        tokenDescriptions[_uniqueId] = _description;
    
        emit BoughtToken(msg.sender, index);
    }

  /**
   * @dev Returns all of the tokens that the user owns
   * @return An array of token indices
   */
    function myTokens()
    external
    view
    returns (
      uint256[]
    )
    {
        return ownedTokens[msg.sender];
    }
    
    /// @notice Returns all the relevant information about a specific token
    /// @param _index The index of the token of interest
    function getUniqueIdForIndex(uint256 _index)
    external
    view
    returns (
      string uniqueId_
    ) {
        uniqueId_ = uniqueTokensIds[_index];
    }

  /// @notice Returns all the relevant information about a specific token
  /// @param _uniqueId The ID of the token of interest
    function getToken(string _uniqueId)
    external
    view
    returns (
      string ipfsImageHash_,
      string description_
    ) {
        ipfsImageHash_ = ipfsImageHashes[_uniqueId];
        description_ = tokenDescriptions[_uniqueId];
    }

  /// @notice Allows the owner of this contract to set the currentRegistrationPrice for each token
    function setCurrentRegistrationPrice(uint256 newPrice)
    public
    onlyOwner
    {
        currentRegistrationPrice = newPrice;
    }

  /// @notice Returns the currentRegistrationPrice for each token
    function getCurrentRegistrationPrice()
    external
    view
    returns (
    uint256 price_
  ) {
        price_ = currentRegistrationPrice;
    }
}
