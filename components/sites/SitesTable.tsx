"use client";

import React, { useEffect, useState } from "react";
import { clientGet, clientDelete } from "@/lib/clientApi";

interface Site {
  id: string;
  name: string;
  location: string;
}

const SitesTable = () => {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    clientGet("/sites").then((data) => setSites(data));
  }, []);

  const handleDelete = async (id: string) => {
    await clientDelete(`/sites/${id}`);
    setSites((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Nom</th>
          <th className="px-4 py-2 border">Localisation</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sites.map((site) => (
          <tr key={site.id}>
            <td className="border px-4 py-2">{site.name}</td>
            <td className="border px-4 py-2">{site.location}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => handleDelete(site.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SitesTable;

