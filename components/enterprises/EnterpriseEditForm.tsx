"use client";

import React, { useState } from "react";

export default function EnterpriseEditForm({ enterprise }: { enterprise: any }) {
  const [name, setName] = useState(enterprise?.name || "");
  const [slug, setSlug] = useState(enterprise?.slug || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entreprise modifiée :", { name, slug });
    // TODO: appel API update
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm mb-1">Nom *</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Slug *</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enregistrer
      </button>
    </form>
  );
}

