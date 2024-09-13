import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";
  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  const amountOut = 2000e6;

  const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const amountAMin = 1000;
  const amountBMin = 1000;
  const amountADesired = 4000;
  const amountBDesired = 3000;

  const USDC_Contract = await ethers.getContractAt(
    "IERC20",
    USDC_ADDRESS,
    impersonatedSigner
  );
  const DAI_Contract = await ethers.getContractAt("IERC20", DAI_ADDRESS);
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  await USDC_Contract.approve(ROUTER_ADDRESS, amountOut);
  const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
  const daiBal = await DAI_Contract.balanceOf(impersonatedSigner.address);
  console.log("BALANCE BEFORE SWAP: ", usdcBal, daiBal);

  const liquidity = await ROUTER.addLiquidity(
    USDC_ADDRESS,
    DAI_ADDRESS,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    impersonatedSigner.address,
    Math.floor(Date.now() / 1000) * (60 * 10)
  );

  console.log("LIQUIDITY: ", liquidity);

  const usdcBalAfter = await USDC_Contract.balanceOf(
    impersonatedSigner.address
  );
  const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);

  console.log("BALANCE AFTER SWAP: ", usdcBalAfter, daiBalAfter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
