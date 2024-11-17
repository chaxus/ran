// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// 定义 IERC20 的接口,声明转账函数
interface IERC20 {
  // 方法允许代币的持有者将代币直接发送到另一个地址。
  function transfer(address, uint256) external returns (bool);

  // 方法则用于在代币持有者授权后，允许第三方（例如，我们的众筹合约）从持有者账户中转出代币到任意地址。
  // 在众筹合约中，transferFrom 尤为关键，因为它使得合约能够在收到用户授权后，从用户账户中直接提取代币，进而完成筹资。
  function transferFrom(address, address, uint256) external returns (bool);
}

contract CrowdFund {
  // 众筹活动的发起事件，用于记录众筹活动的发起者、目标金额、活动开始时间和活动结束时间。
  event Launch(uint256 id, address indexed creator, uint256 goal, uint32 startAt, uint32 endAt);
  // 众筹活动的取消事件
  event Cancel(uint256 id);
  // 用于在每次用户成功质押代币时发出通知
  // 这个事件应该包含这些参数，如众筹活动的ID、质押者的地址以及质押的金额。
  event Pledge(uint256 indexed id, address indexed caller, uint256 amount);
  // 用于在每次用户成功撤销质押代币时发出通知
  event UnPledge(uint256 indexed id, address indexed caller, uint256 amount);
  // 用于在项目方成功提取筹集的资金时发出通知
  event Claim(uint256 id);
  // 用户成功取回质押的代币时发出通知
  event Refund(uint256 id, address indexed caller, uint256 amount);
  // 众筹活动结构体，用于存储众筹活动的相关信息。
  struct Campaign {
    // 项目发起者：标识谁启动了众筹活动。
    address creator;
    // 目标金额：设定的筹资目标，用以衡量众筹成功与否。
    uint256 goal;
    // 用户质押数目：记录参与者质押的代币数量。
    uint256 pledged;
    // 活动起始时间：定义众筹活动开始和结束的具体时间点。
    uint32 startAt;
    uint32 endAt;
    // 资金申领状态：标识项目方是否已经成功申领筹集到的资金。
    bool claimed;
  }
  // 在部署合约之前，我们需要明确我们将采用哪种 ERC20 代币进行资金筹集。
  // 因为该代币合约必须实现我们的 IERC20 接口，所以只要有代币合约地址，我们就可以使用 IERC20 来实例化该合约，从而实现与该合约的交互。
  // 对于该地址变量，我们可以使用 immutable 标记，这样它的值会在合约构造函数执行期间被设置一次，并且在之后不能被修改。
  // 这样做不仅减少了合约的存储成本，还提高了合约的安全性。
  IERC20 public immutable token;
  // 为了标识和记录项目方发起的各个活动，我们需要引入一个变量 count 来记录已经发起的众筹活动数量。
  uint256 public count;
  // 当涉及到一一对应的关系时，我们通常使用 mapping 来存储。在这里，我们可以定义一个从 uint256 到 Campaign 的映射。
  // 在可见性方面，我们选择public，以便于查询。
  mapping(uint256 => Campaign) public campaigns;
  // 为了记录用户质押的代币数量，我们可以定义一个从活动 ID 到用户地址的映射，再到质押数量的映射。
  mapping(uint256 => mapping(address => uint256)) public pledgedAmount;

  constructor(address _token) {
    token = IERC20(_token);
  }

  // 众筹活动的发起函数，用于启动一个新的众筹活动。
  // 该函数接受三个参数：目标金额、活动开始时间和活动结束时间。
  function launch(uint256 _goal, uint32 _startAt, uint32 _endAt) external {
    // 验证输入参数
    // 活动开始时间的验证：活动的开始时间必须在当前时间之后，以给予项目方和投资者准备的时间。
    require(_startAt >= block.timestamp, 'start at < now');
    // 活动结束时间的验证：活动的结束时间必须在开始时间之后，以确保活动的有效性。
    require(_endAt >= _startAt, 'end at < start at');
    // 活动结束时间的验证：活动的结束时间必须在当前时间之后，以确保活动的有效性。
    require(_endAt <= block.timestamp + 90 days, 'end at > max duration');
    // 更新活动ID
    count += 1;
    // 新的 Campaign 结构体实例与其对应的活动 ID记录到 campaigns 映射，确保了每个众筹活动的信息都能被准确地存储和访问
    campaigns[count] = Campaign({
      creator: msg.sender,
      goal: _goal,
      pledged: 0,
      startAt: _startAt,
      endAt: _endAt,
      claimed: false
    });
    // 触发 Launch 事件，记录众筹活动的发起者、目标金额、活动开始时间和活动结束时间。
    emit Launch(count, msg.sender, _goal, _startAt, _endAt);
  }

  // 众筹活动的取消函数，用于取消一个已经发起的众筹活动。
  function cancel(uint256 _id) external {
    // 找到活动ID对应的活动信息
    Campaign memory campaign = campaigns[_id];
    // 验证活动发起者，只有活动发起者才能取消活动
    require(campaign.creator == msg.sender, 'not creator');
    // 验证活动未开始，只有未开始的活动才能被取消，因为一旦活动开始，可能已经有投资者参与，取消活动将影响到这些投资者的利益。
    require(block.timestamp < campaign.startAt, 'started');
    // 删除活动
    delete campaigns[_id];
    // 触发 Cancel 事件，通知活动的取消。
    emit Cancel(_id);
  }

  // 众筹活动的质押函数，用于参与众筹活动。
  // _id 这是用户希望支持的众筹活动的唯一标识符
  // _amount 这是用户打算质押的代币数量。
  function pledge(uint256 _id, uint256 _amount) external {
    // 找到活动ID对应的活动信息
    Campaign storage campaign = campaigns[_id];
    // 验证活动是否已开始
    require(block.timestamp >= campaign.startAt, 'not started');
    // 验证活动是否未结束
    require(block.timestamp <= campaign.endAt, 'ended');
    // 更新活动的已筹集金额
    campaign.pledged += _amount;
    // 记录用户的质押金额
    pledgedAmount[_id][msg.sender] += _amount;
    // 从用户账户中转出质押的代币, 这使得我们能够从用户账户中安全地转移代币到众筹合约中，作为对特定活动的质押。
    token.transferFrom(msg.sender, address(this), _amount);
    // 用户的代币成功转移到合约并且所有相关信息更新之后，我们需要触发 Pledge 事件，将质押的详细信息广播出去。
    emit Pledge(_id, msg.sender, _amount);
  }

  // 取消质押
  // _id 希望撤销质押的指定的众筹活动
  // _amount 希望从质押中撤回的代币数量，允许用户有选择性地撤销部分或全部质押
  function unpledge(uint256 _id, uint256 _amount) external {
    // 获取指定活动并验证
    Campaign storage campaign = campaigns[_id];
    // 只有在活动尚未结束时，用户才能撤销质押
    require(block.timestamp <= campaign.endAt, 'ended');
    // 更新活动的已筹集金额
    campaign.pledged -= _amount;
    // 更新用户的质押记录
    pledgedAmount[_id][msg.sender] -= _amount;
    // 退还代币给用户
    token.transfer(msg.sender, _amount);
    // 触发 UnPledge 事件，通知用户的撤销质押行为
    emit UnPledge(_id, msg.sender, _amount);
  }

  // 在众筹活动成功结束后，项目方应被允许提取筹集的资金
  // 为了实现这一点，我们需要定义一个 claim 函数，用于项目方提取筹集的资金。
  function claim(uint256 _id) external {
    Campaign storage campaign = campaigns[_id];
    // 验证活动发起者
    require(campaign.creator == msg.sender, 'not creator');
    // 验证活动已结束
    require(block.timestamp >= campaign.endAt, 'not ended');
    // 筹资目标已达成
    require(campaign.pledged >= campaign.goal, 'pledged < goal');
    // 资金未被提取，防止资金被重复提取
    require(!campaign.claimed, 'claimed');
    // 标记资金已被提取
    campaign.claimed = true;
    // 转账给项目方
    token.transfer(campaign.creator, campaign.pledged);
    // 触发 Claim 事件，通知资金提取成功
    emit Claim(_id);
  }

  // 为了保证用户在众筹活动失败后能够取回质押的代币，我们需要定义一个 refund 函数，用于用户取回质押的代币。
  function refund(uint256 _id) external {
    Campaign memory campaign = campaigns[_id];
    // 验证活动已结束
    require(block.timestamp > campaign.endAt, 'not ended');
    // 验证筹资目标未达成
    require(campaign.pledged < campaign.goal, 'pledged >= goal');
    // 首先，我们需要通过访问 pledgedAmount 映射，我们检索出用户在特定众筹活动中的质押金额。
    uint256 bal = pledgedAmount[_id][msg.sender];
    // 接着，为了确保不会发生重复退款的情况，我们将用户在该活动中的质押记录置为零。
    pledgedAmount[_id][msg.sender] = 0;
    // 最后，我们执行代币退款操作，通过调用 transfer 函数将之前质押的代币数量退还给用户，完成整个退款流程。
    token.transfer(msg.sender, bal);
    // 触发 Refund 事件，通知用户的退款操作
    emit Refund(_id, msg.sender, bal);
  }
}
