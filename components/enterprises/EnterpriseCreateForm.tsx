"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnterpriseCreateForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [leaders, setLeaders] = useState<string[]>([""]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log("Entreprise créée :", {
        name,
        slug,
        phone,
        address,
        leaders,
        logoFile,
      });

      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      {err && <p className="text-red-500">{err}</p>}

      <input
        type="text"
        placeholder="Nom de l'entreprise"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="text"
        placeholder="Téléphone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Envoi..." : "Créer l’entreprise"}
      </button>
    </form>
  );
}

