"use client";
import { InputField } from "@/components/ui/InputField";
import { useState } from "react";
export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");

    async function handleSubmit() {
      // You can access the current state values here
      console.log("Token Address:", tokenAddress);
      console.log("Recipients:", recipients);
      console.log("Amounts:", amounts);
      // ... logic to handle form submission
    }

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <InputField
          label="Token Address"
          placeholder="0x..."
          value={tokenAddress}
          type="text"
          large={false}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <InputField
          label="Recipients"
          placeholder="0x123..., 0x456..."
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          large={true} // Example of another prop
        />

        <InputField
          label="Amounts"
          placeholder="100, 200, ..."
          value={amounts}
          onChange={(e) => setAmounts(e.target.value)}
          large={true}
        />

        <button type="submit">Send Tokens</button>
      </form>
    </div>
  );
}
