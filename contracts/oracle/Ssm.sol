pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface MedianLike {
  function peek() external view returns (uint256, bool);
}

contract Ssm is AccessControl {
  uint256 public stopped;
  bytes32 public constant READER_ROLE = keccak256("READER_ROLE");
  modifier stoppable { require(stopped == 0, "OSM/is-stopped"); _; }

  address public medianizer;
  uint16  constant ONE_HOUR = 1 hours;
  uint16  public hop = ONE_HOUR;
  uint64  public zzz;

  struct Feed {
    uint256 val;
    uint256 has;
  }

  event Change(address sender, address contractAddress);

  Feed cur;
  Feed nxt;

  event LogValue(uint256 val);

  constructor (address medianizer_) {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    medianizer = medianizer_;
  }

  function stop() external onlyRole(DEFAULT_ADMIN_ROLE) {
    stopped = 1;
  }
  function start() external onlyRole(DEFAULT_ADMIN_ROLE) {
    stopped = 0;
  }

  function change(address medianizer_) external onlyRole(DEFAULT_ADMIN_ROLE) {
    medianizer = medianizer_;

    emit Change(msg.sender, medianizer);
  }

  function era() internal view returns (uint) {
    return block.timestamp;
  }

  function prev(uint ts) internal view returns (uint64) {
    require(hop != 0, "OSM/hop-is-zero");
    return uint64(ts - (ts % hop));
  }

  function step(uint16 ts) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(ts > 0, "OSM/ts-is-zero");
    hop = ts;
  }

  function void() external onlyRole(DEFAULT_ADMIN_ROLE) {
    cur = nxt = Feed(0, 0);
    stopped = 1;
  }

  function pass() public view returns (bool ok) {
    return era() >= zzz + hop;
  }

  function poke() external stoppable {
    require(pass(), "OSM/not-passed");
    (uint256 price, bool ok) = MedianLike(medianizer).peek();
    if (ok) {
      cur = nxt;
      nxt = Feed(price, 1);
      zzz = prev(era());
      emit LogValue(cur.val);
    }
  }

  function peek() external view onlyRole(READER_ROLE) returns (uint256, bool) {
    return (cur.val, cur.has == 1);
  }

  function peep() external view onlyRole(READER_ROLE) returns (uint256, bool) {
    return (nxt.val, nxt.has == 1);
  }

  function read() external view onlyRole(READER_ROLE) returns (uint256) {
    require(cur.has == 1, "OSM/no-current-value");
    return cur.val;
  }
}
