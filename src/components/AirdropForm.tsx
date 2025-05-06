"use client";

import { InputField } from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useMemo, useState } from "react";
import { calculateTotal } from "@/utils"; // Assuming this function is defined in utils
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const account = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  // every time the amounts change, we need to recalculate the total by calling the function, this is
  // how useMemo works
  const total: number = useMemo(() => {
    calculateTotal(amounts);
  }, [amounts]);

  const {
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract();

  async function getApprovedAmount(
    spenderAddress: `0x${string}`,
    erc20TokenAddress: `0x${string}`,
    ownerAddress: `0x${string}`
  ): Promise<bigint> {
    console.log(`Checking allowance for token ${erc20TokenAddress}`);
    console.log(`Owner: ${ownerAddress}`);
    console.log(`Spender: ${spenderAddress}`);

    try {
      const allowance = await readContract(config, {
        abi: erc20Abi,
        address: erc20TokenAddress, // The address of the ERC20 token contract
        functionName: "allowance",
        args: [ownerAddress, spenderAddress], // Arguments: owner, spender
      });

      console.log("Raw allowance response:", allowance);
      // The response from 'allowance' is typically a BigInt
      return allowance as bigint; // Assert type if necessary based on ABI return type
    } catch (error) {
      console.error("Error fetching allowance:", error);
      // Rethrow or handle error appropriately
      throw new Error("Failed to fetch token allowance.");
    }
  }

  async function handleSubmit() {
    console.log("Form submitted");
    console.log("Token Address:", tokenAddress);
    console.log("Recipients:", recipients);
    console.log("Amounts:", amounts);

    // Get the tsender contract address for the current chain
    const tSenderAddress = chainsToTSender[chainId]?.tsender;
    console.log("Current Chain ID:", chainId);
    console.log("TSender Address for this chain:", tSenderAddress);

    // Basic validation
    if (!account.address) {
      alert("Please connect your wallet.");
      return;
    }
    if (!tSenderAddress) {
      alert(
        "TSender contract not found for the connected network. Please switch networks."
      );
      return;
    }
    if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      alert("Please enter a valid ERC20 token address (0x...).");
      return;
    }
    // Add validation for recipients and amounts later...
    // --- Step 1: Check Allowance ---
    try {
      // Using 'as `0x${string}`' for type assertion required by wagmi/viem
      const approvedAmount = await getApprovedAmount(
        tSenderAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        account.address
      );
      console.log(`Current allowance: ${approvedAmount}`);
      if (approvedAmount < total) {
        const approvalHash = await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [tSenderAddress as `0x${string}`, BigInt(total)],
        });
        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });
        console.log("Approval confirmed:", approvalReceipt);

        // Optional: Check receipt status for success
        if (approvalReceipt.status !== "success") {
          console.error("Approval transaction failed:", approvalReceipt);
          // Handle UI feedback for failed transaction
          return;
        }
      }
    } catch (error) {
      console.error("Error during submission process:", error);
      alert("An error occurred. Check the console for details.");
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <InputField
          label="Token Address"
          placeholder="0x..."
          value={tokenAddress}
          type="text"
          large={false}
          onChange={(e) => setTokenAddress(e)}
        />
        <InputField
          label="Recipients"
          placeholder="0x123..., 0x456..."
          value={recipients}
          onChange={(e) => setRecipients(e)}
          large={true} // Example of another prop
        />

        <InputField
          label="Amounts"
          placeholder="100, 200, ..."
          value={amounts}
          onChange={(e) => setAmounts(e)}
          large={true}
        />

        <button
          className="
    relative inline-block overflow-hidden px-8 py-3 font-bold text-white rounded-full
    bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
    shadow-lg transition-all duration-500 ease-in-out transform
    hover:scale-105 hover:shadow-2xl
    focus:outline-none focus:ring-4 focus:ring-purple-300
    before:absolute before:inset-0 before:bg-white before:opacity-10 before:blur-lg
    before:transition-opacity before:duration-500 hover:before:opacity-20
  "
          type="submit"
        >
          Send Tokens
        </button>
      </form>
    </div>
  );
}
