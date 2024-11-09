// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// 定义一个合约，名为 FungibleToken
contract FungibleToken {
  //mapping 类型的变量，用于存储每个地址对应的余额
  mapping(address => uint256) private balances;
  //uint256 类型的变量，用于存储 Token 的总发行量。定义为 public，可以被任何人查询。
  uint256 public totalSupply;
  //address 类型的变量，用于存储此 Token 的发行者。用于一些权限控制
  address private owner;

  // 构造函数，用于初始化 owner 变量
  constructor() {
    owner = msg.sender;
  }

  //用于铸造 Token 的函数
  function mint(address recipient, uint256 amount) public {
    //权限控制，只有 owner 可以调用此函数
    require(msg.sender == owner, 'Not authorized.');
    // 进行造币， recipient 地址的余额增加 amount
    balances[recipient] += amount;
    // 总发行量增加 amount
    totalSupply += amount;
  }

  // 用于查询对应地址的余额
  function balanceOf(address account) public view returns (uint256) {
    return balances[account];
  }
}
