
// SPDX-License-Identifier: MIT
// 我们要做的CryptoKitty其实是一个遵循ERC721的NFT，只是在ERC721的基础上添加了自己的功能，例如创建初代小猫。
pragma solidity ^0.8.26;
// 引入 ERC721 的标准库, 需安装 Solidity+Hardhat Extension 即可解决导入的错误。
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// 定义一个 SimpleCryptoKitties 合约，并继承 ERC721 合约
contract SimpleCryptoKitties is ERC721 {
  // 我们需要引入一个名为 _tokenIdCounter 的变量。
  // 这个变量的主要作用是记录当前可用的 TokenId ，也即小猫的数量。
  // 每当成功铸造一个 NFT，_tokenIdCounter 的值都会自动加1，指向下一个即将被铸造的 NFT 的 TokenId 。
  // 这样，我们就能确保每个 CryptoKitty 都拥有唯一的 TokenId ，并且我们还可以通过这个变量轻松地追踪 NFT 的数量和顺序。
  // 由于 TokenId 是非负的，我们选择使用 uint256 来存储它。
  // 在变量的可见性方面，我们希望所有人都能知道他们即将创建的小猫的 TokenId 大概是多少，所以我们将其定义为 public 。
  // 最后，我们需要将这个值初始化为1，因为我们希望 NFT 的 TokenId 从1开始，而不是从0。
  uint256 public _tokenIdCounter = 1;
  // 我们需要在 ERC721 的基础上添加自己的逻辑。
  // 每只小猫的样子都是独特的，那么我们应该如何记录小猫的这些差异呢？
  // 我们需要一个变量来存储小猫的基础信息，这包括基因、出生时间、猫妈妈的 TokenId、猫爸爸的 TokenId 以及迭代次数。
  // 这些基础信息其实就是小猫的属性。为了表示某个物体的属性，我们选择使用结构体。
  // 这种数据结构非常适合存储物体的各种属性信息。
  // 对于这些属性，我们选择使用 uint256 类型来表示。
  // 选择 uint256 来表示基因的原因是，我们可以根据正整数的大小以及一些奇偶属性来模拟基因的特性。
  // 而在 Solidity 中，时间通常是用 uint256 来表示的，因此出生时间也采用了这种类型。
  struct Kitty {
    uint256 genes;
    uint64 birthTime;
    uint32 momId;
    uint32 dadId;
    uint16 generation;
  }
  // 前面我们提到，需要在合约中存储小猫的信息，并确保小猫的信息与 TokenId 一一对应。
  // 当涉及到一一对应的关系时，我们通常使用 mapping 来存储。
  // 在这里，我们需要一个从 uint256 到 Kitty 的映射。在可见性方面，我们选择public，以便于查询。
  mapping(uint256 => Kitty) public kitties;
  // 定义一个构造函数并初始化 ERC721 合约，将其名称设置为 " SimpleCryptoKitties "，符号设置为 " SCK "。
  constructor() ERC721("SimpleCryptoKitties", "SCK") {}
  // 创建小猫
  // 开始定义 _createKitty 函数。该函数的主要目的是提供一个公共方法，用于根据给定的小猫信息铸造一个 NFT，并在合约中记录小猫信息，使其与 TokenId 一一对应。
  //  _createKitty 函数接受五个参数：猫妈妈的 TokenId、猫爸爸的 TokenId、迭代数、基因和猫的主人。这五个参数将用于初始化 NFT 结构体。其中，猫的主人信息是为了确保新铸造的 NFT 被分配给正确的主人。
  // 由于 _createKitty 函数是设计为合约内部的通用功能，我们将其可见性设置为private。
  function _createKitty(
    uint256 momId,
    uint256 dadId,
    uint256 generation,
    uint256 genes,
    address owner
  ) private returns (uint256){
    // 在 _createKitty 函数中，首先我们需要将小猫的信息存储到新创建的 kitties 映射中。
    // 为了创建一个完整的 Kitty 结构体，我们还需要一个属性：birthTime，即小猫的出生时间。在区块链中，我们可以使用 block.timestamp 语法来获取当前区块的时间。
    // 一旦我们拥有了 Kitty 结构体中的所有信息，就可以创建一个新的小猫。接下来，我们只需将要铸造的 NFT 的 TokenId 与这个新小猫关联起来即可。
    kitties[_tokenIdCounter] = Kitty(
      genes,
      block.timestamp,
      momId,
      dadId,
      generation
    )
    // 在将 TokenId 与小猫信息关联之后，我们还需要为该 TokenId 创建对应的 NFT 。
    // 在这一步，我们将调用 ERC721 中提供的 _mint 函数。这个函数需要两个参数：NFT 的主人和 TokenId 。
    // 我们已经有了这两个信息，分别是参数 owner 和状态变量 _tokenIdCounter 。
    _mint(owner, _tokenIdCounter);
    return _tokenIdCounter++;
  }
  // 创建一个初代小猫
  // 我们要定义一个名为 createKittyGen0 的函数。理解这个函数的目的是关键：它的任务是随机生成一个初代小猫。
  // 这个小猫的基因是随机的，父母信息为空，迭代数为0，出生时间则是当前区块的时间戳。
  // 这些组成了初代小猫的基本信息。
  // 我们希望用户在创建随机的初代小猫后能知道自己创建的小猫的 TokenId，因此这个函数需要返回一个值，即新创建的小猫的 TokenId 。
  // 关于函数的可见性，我们选择public，因为我们希望这个函数可以在任何地方被调用，以创建一个初代小猫。
  function createKittyGen0() public returns (uint256) {
    // createKittyGen0 函数需要随机生成小猫的基因，这个基因是一个 uint256 类型的变量。为此，我们需要一个随机数生成算法。
    // 在 Solidity 中，常用的随机数生成方法涉及到两个内置函数：keccak256 和 abi.encodePacked。
    // keccak256 是一个哈希生成算法，能够将任意长度的输入转换为一个固定长度的 bytes32 类型的哈希值。
    // 由于不同的输入会产生不同的哈希值，我们只需确保输入字符串包含小猫的独特信息。
    // 那么，如何构造这样的独特信息呢？我们可以使用 abi.encodePacked 函数来编码多种信息，如当前的时间戳、TokenId 等具有唯一性的属性。
    // 由于这些属性对每只小猫都是独特的，将它们编码并通过 keccak256 进行哈希处理后，那么每个小猫就可以拥有属于自己的独特基因了。
    uint256 genes = uint256(keccak256(abi.encodePacked(block.timestamp, _tokenIdCounter)));
    // 调用 _createKitty 函数，参数中猫妈妈和猫爸爸的TokenId都填0，迭代数为0，基因为 genes，猫主人为 msg.sender
    return _createKitty(0,0,0,genes,msg.sender);
  }
  // 孕育小猫
  // 它是为了根据指定的猫妈妈和猫爸爸孕育出下一代小猫，而这只小猫的基因与其父母有关。
  function breed(uint256 momId, uint256 dadId) public returns (uint256) {
    // 判断 momId 不等于 dadId
    require(momId != dadId, "both ids are the same!");
    // 判断 momId 对应的主人是否是 msg.sender
    require(ownerOf(momId) == msg.sender, "Not the owner of the mom kitty");
    // 判断 dadId 对应的主人是否是 msg.sender。
    require(ownerOf(dadId) == msg.sender, "Not the owner of the dad kitty");
    // 为了孕育出下一代小猫，我们就需要获取猫爸和猫妈的基础信息，而该基础信息是存储在 kitties 这个映射中。
    // 在 Solidity 中，当处理结构体时，我们需要指定其存储位置。由于不需要改变猫妈和猫爸的信息，我们选择存储在 memory 当中，这会节省不少 gas 消耗。
    Kitty memory mom = kitties[momId];
    Kitty memory dad = kitties[dadId];
    // 计算迭代数
    // 0代猫爸 x 0代猫妈 = 1 代小猫
    // 1代猫爸 x 1代猫妈 = 2代小猫
    // 1代猫爸 x 0代猫妈 = 2代小猫
    // 小猫的迭代数是猫爸和猫妈中的最大迭代数加1。
    // 所以我们这里需要先获取到猫爸和猫妈的最大迭代数，最后将这个值加一即可。
    // 这个计算可以通过一个简单的三元运算符来完成。
    uint256 newGeneration = mom.generation > dad.generation ? mom.generation++ : dad.generation++;
    // 由于小猫的基因需要和父母有关，所以我们选择将父母的基因相加除以2，就可以得到小猫的基因。
    // 这样小猫的基因既有一定的随机性，也和父母的基因有关。
    uint256 newGenes = (mom.genes + dad.genes) / 2;

    return _createKitty(momId, dadId, newGeneration, newGenes,msg.sender);
  }
}
