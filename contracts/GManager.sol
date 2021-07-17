//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./GDai.sol";

contract GManager is Ownable, Pausable {
    mapping (address => mapping (address => address)) public tokenPairs;
    mapping (address => uint) public tokenPrice;
    mapping (address => bool) public oracles;
    
    event NewTokenPair(address indexed from, address indexed  tokenA, address indexed tokenB, address tokenPair);
    event NewPrice(address indexed from, address indexed  tokenPrice, uint256 price);
    event SetOracle(address indexed from, address indexed oracle, bool authorized);

    modifier onlyOracle() {
        require(oracles[_msgSender()], "unauthorized"); 
        _;
    }
    
    modifier notIdentical(address tokenA, address tokenB) {
        require(tokenA != tokenB, 'IDENTICAL_ADDRESSES');
        _;
    }
    
    function sortTokens(address tokenA, address tokenB) public pure returns (address, address){
        return tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }
    
    function createPair(address tokenA, address tokenB) external onlyOwner notIdentical(tokenA, tokenB) returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        require(tokenPairs[token0][token1] == address(0), "Token Exists");
        bytes memory bytecode = type(GDai).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        tokenPairs[token0][token1] = pair;
        emit NewTokenPair(_msgSender(), token0, token1, pair);
    }

    function setTokenPrice(address tokenPair, uint256 price) external onlyOracle {
        tokenPrice[tokenPair] = price;
        emit NewPrice(_msgSender(), tokenPair, price);
    }
    
    function getTokenPairAddress(address tokenA, address tokenB) public view notIdentical(tokenA, tokenB) returns (address){
       (address token0, address token1) = sortTokens(tokenA, tokenB);
       return tokenPairs[token0][token1];
    }
    
    function setOracle(address address_, bool authorized) public onlyOwner {
        oracles[address_] = authorized;
        emit SetOracle(_msgSender(), address_, authorized);
    }
}