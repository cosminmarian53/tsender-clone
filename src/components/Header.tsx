import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2rem",
        width: "100%",
      }}
    >
      {/* Left side - Title */}
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>tsender</h1>

      {/* Right side - GitHub link and Connect button */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <a
          href="https://github.com/your-username/tsender"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaGithub size={24} />
        </a>
        <ConnectButton />
      </div>
    </header>
  );
}
