contract Clipper {
    struct Auction {
        address tokenToSell;
        uint amountToSell;
        address tokenToRaise;
        uint initialPrice;
        uint priceReductionRatio;
        uint auctionStart;
        uint auctionFinish;
    }
    
    Auction[] public auctions;
    
    event AuctionStarted(uint256 start, uint256 end, address tokenToSell, uint amountToSell);
    event AuctionBided(uint indexed id);
    
    function startAuction (
        uint auctionTarget,
        uint collateralAmount,
        address cdpAccountAddress,
        address keeperAddress, 
        uint initialPrice // pode ser de oracle
        
        // address tokenToSell,
        // uint amountToSell,
        // address tokenToRaise,
        // uint initialPrice,
        uint priceReductionRatio // 0.999999999999999999999999999 1% aa. step=90s
    ) public {
        uint256 startTimestamp = block.timestamp;
        uint256 endTimestamp = startTimestamp + 1 weeks;

        auctions.push(
            Auction(
                tokenToSell,
                amountToSell,
                tokenToRaise,
                initialPrice,
                priceReductionRatio,
                startTimestamp,
                endTimestamp
            )
        );

        // emitir evento
        emit AuctionStarted(startTimestamp, endTimestamp, tokenToSell, amountToSell);
        
        // tras o tokenToSell
        require(Token(tokenToSell).transferFrom(msg.sender, address(this), amountToSell), "token transfer fail");
    }
    
    uint constant WAD = 10**18;
    uint constant RAY = 10**27;
    uint constant RAD = 10**45;
    
    // optimized version from dss PR #78
    function rpow(uint256 x, uint256 n, uint256 b) internal pure returns (uint256 z) {
        assembly {
            switch n case 0 { z := b }
            default {
                switch x case 0 { z := 0 }
                default {
                    switch mod(n, 2) case 0 { z := b } default { z := x }
                    let half := div(b, 2)  // for rounding.
                    for { n := div(n, 2) } n { n := div(n,2) } {
                        let xx := mul(x, x)
                        if shr(128, x) { revert(0,0) }
                        let xxRound := add(xx, half)
                        if lt(xxRound, xx) { revert(0,0) }
                        x := div(xxRound, b)
                        if mod(n,2) {
                            let zx := mul(z, x)
                            if and(iszero(iszero(x)), iszero(eq(div(zx, x), z))) { revert(0,0) }
                            let zxRound := add(zx, half)
                            if lt(zxRound, zx) { revert(0,0) }
                            z := div(zxRound, b)
                        }
                    }
                }
            }
        }
    }    
    
    function bid(uint auctionId) public {
        Auction storage auction = auctions[auctionId];
        require(auction.amountToSell > 0);
        require(block.timestamp > auction.auctionStart && block.timestamp < auction.auctionFinish);
        uint tokenAmount = price(auction.initialPrice, block.timestamp - auction.auctionStart, auction.priceReductionRatio) * auction.amountToSell;
        
        require(Token(auction.tokenToRaise).transferFrom(msg.sender, address(this), tokenAmount), "token transfer fail");
        
        auction.amountToSell = 0;
        auction.auctionFinish = block.timestamp;
        
        // emitir evento 
        emit AuctionBided(auctionId);
    }
    
    
    // top: initial price
    // dur: seconds since the auction has started
    // cut: cut encodes the percentage to decrease per second.
    //   For efficiency, the values is set as (1 - (% value / 100)) * RAY
    //   So, for a 1% decrease per second, cut would be (1 - 0.01) * RAY
    //
    // returns: top * (cut ^ dur)
    //
    function price(uint256 initialPrice, uint256 duration, uint priceReductionRatio) public pure returns (uint256) {
        return rpow(priceReductionRatio, duration, RAY) * initialPrice / RAY;
    }
    
    
    function getAuction(uint auctionId) public view returns (Auction memory) {
        return auctions[auctionId];
    }
}