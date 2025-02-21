"use client"; // Add this if using App Router

import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <ChatInterface />
    </main>
  );
}