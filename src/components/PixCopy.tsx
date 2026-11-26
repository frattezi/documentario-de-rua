// The PIX key and its copy button. With no key the button is disabled and the key reads
// "a definir", so a visitor can never copy a wrong one. With a key, one click copies it and
// the label confirms for 2.5 seconds.
import { useState } from "react";

const CONFIRMATION_MS = 2500;

export default function PixCopy({ pixKey }: { pixKey: string | null }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!pixKey) return;
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), CONFIRMATION_MS);
    } catch {
      // No clipboard permission: select the key so it can be copied by hand.
      const key = document.getElementById("pixkey");
      if (key) window.getSelection()?.selectAllChildren(key);
    }
  };

  return (
    <>
      <p className="key" id="pixkey">
        {pixKey ?? "a definir"}
      </p>
      <button
        className={copied ? "btn btn--done" : "btn"}
        type="button"
        disabled={!pixKey}
        onClick={copy}
      >
        {copied ? "Chave copiada" : "Copiar chave"}
      </button>
    </>
  );
}
