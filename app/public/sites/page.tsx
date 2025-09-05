"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSites, siteQrPngUrl } from "@/lib/api";

export default function PublicSitesPage() {
  const [sites, setSites] = useState<any[]>([]);

  useEffect(() => {
    getSites()
      .then((data) => setSites(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sites publics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">{site.name}</h2>
            <p className="text-gray-600 mb-4">{site.description}</p>
            <Image
              src={siteQrPngUrl(site.id)}
              alt={`QR code du site ${site.name}`}
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
