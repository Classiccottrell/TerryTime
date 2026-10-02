"use client";

import { useState } from "react";

// TBD: replace with the real inbox. A mailto form needs no backend; swap to an
// API route (e.g. Resend) if you'd rather messages arrive without the buyer's mail app.
const INBOX = "hello@terryterrylarryberry.com";

export function ContactForm() {
  const [topic, setTopic] = useState("Order");
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const subject = `${topic}${order ? ` · order ${order}` : ""}`;
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  return (
    <form className="info-form" onSubmit={send}>
      <label>
        What&apos;s it about?
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option>Order</option>
          <option>Damaged or wrong item</option>
          <option>Sizing</option>
          <option>Press or collab</option>
          <option>Something else</option>
        </select>
      </label>
      <label>
        Order number (if you have one)
        <input value={order} onChange={(e) => setOrder(e.target.value)} placeholder="From your receipt email" />
      </label>
      <label>
        Message
        <textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      <button type="submit">Open in email</button>
    </form>
  );
}
