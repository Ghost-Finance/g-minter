//SPDX-License-Identifier: lalala
pragma solidity ^0.8.0;

contract Token {
    uint256 public totalSupply;
    string  public name;
    string  public symbol;
    uint256 public decimals = 18;
    address public owner;
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowances;
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
        owner = msg.sender;
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        balanceOf[msg.sender] -= value;
        balanceOf[to]         += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address to, uint256 value) external returns (bool) {
        allowances[msg.sender][to] = value;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        allowances[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;        
    }
    
    function mint(address to, uint256 value) external {
        require(msg.sender == owner, "unauthorized");
        balanceOf[to] += value;
        totalSupply += value;
        emit Transfer(address(0), to, value);
    }
}