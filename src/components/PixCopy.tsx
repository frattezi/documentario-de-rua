// The PIX key and its copy button. With no key the button is disabled and the key reads
// "a definir". With one, a click writes it to the clipboard and the button reads "Chave copiada"
// for 2.5 seconds; if the clipboard is refused, the key is selected for a manual copy instead.
import { useState } from "react";
import { pixCopiedMs, pixCopyLabels as labels } from "../content/support";

export interface PixCopyProps {
  pixKey: string | null;
}

export default function PixCopy({ pixKey }: PixCopyProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!pixKey) return;
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), pixCopiedMs);
    } catch {
      const key = document.getElementById("pixkey");
      if (key) window.getSelection()?.selectAllChildren(key);
    }
  }

  return (
    <>
      <p className="key" id="pixkey">
        {pixKey ?? labels.noKey}
      </p>
      <button className={copied ? "btn btn--done" : "btn"} type="button" disabled={!pixKey} onClick={copy}>
        {copied ? labels.copied : labels.copy}
      </button>
    </>
  );
}
