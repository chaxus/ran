// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// 定义一个合约，名为 FungibleToken
// 代币的铸造
// 代币余额的查询
// 转账：
// 1. 首先我们需要判断转账者的余额是否大于要转账的金额
// 2. 然后我们需要通过映射分别获取转账者和接收者余额
// 3. 然后在转账者的映射上减去要转账的金额
// 4. 在收款者的映射上加上转账的金额
// 5. 更新所有与金额有关的变量后，转账就完成了。
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
  // 用于转账
  function transfer(address recipient, uint256 amount) public returns (bool) {
    // 参数检查
    // 很明显，由于入参是调用者指定的，而我们不希望调用者指定的转账金额大于其实际拥有的代币余额。
    // 因为这样的非预期参数，可能造成转账时发生错误，我们需要即时阻止此次调用。
    // 所以我们需要进行对入参 amount 进行检查，要求此值不能大于调用者对应的 balances 映射中储存的余额。以确保在后续的执行过程中不会出现意外。
    require(amount <= balances[msg.sender], "Not enough balance.");
    // 在我们编写转账的代码时，一个好的习惯是按照转账的逻辑顺序去写，先减后加。所以我们这里先将转账者的余额减去转账金额。
    balances[msg.sender] -= amount;
    // 将接收者的余额增加转账金额
    balances[recipient] += amount;
    return true;
  }
}
