"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave } from "react-icons/fa";

export default function NewAffiliatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/affiliates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERADMIN_TOKEN}`,
      },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      alert("Affilié créé ✅");
      router.push("/dashboard/superadmin/affiliates");
    } else {
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="max-w-lg bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Nouvel affilié</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaSave className="mr-2" /> Sauvegarder
        </button>
      </form>
    </div>
  );
}

