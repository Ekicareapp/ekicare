"use client";
import { useEffect, useState } from "react";

export default function DateTime({ iso }: { iso: string }) {
  const [text, setText] = useState("");
  useEffect(() => {
    setText(
      new Date(iso).toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "medium",
      })
    );
  }, [iso]);
  return <time suppressHydrationWarning dateTime={iso}>{text}</time>;
}
