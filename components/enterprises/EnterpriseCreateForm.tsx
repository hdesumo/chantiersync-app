// components/enterprises/EnterpriseCreateForm.tsx
setName(""); setSlug(""); setPhone(""); setAddress(""); setLeaders([""]); setLogoFile(null); setLogoPreview(null);
router.refresh();
} catch (e: any) { setErr(e?.message || "Erreur lors de la création"); }
finally { setSubmitting(false); }
};


return (
<form onSubmit={onSubmit} className="space-y-4 rounded-2xl border p-6">
<h2 className="text-lg font-semibold">Créer une entreprise</h2>
<div className="grid gap-4 md:grid-cols-2">
<div>
<label className="block text-sm mb-1">Nom *</label>
<input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: BatiPlus Sénégal" required />
</div>
<div>
<label className="block text-sm mb-1">Slug *</label>
<input className="w-full border rounded px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={autoSlug || "ex: batiplus-senegal"} />
<p className="text-xs opacity-60 mt-1">Auto: {autoSlug}</p>
</div>
<div>
<label className="block text-sm mb-1">Téléphone *</label>
<input className="w-full border rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+221 77 123 45 67" required />
</div>
<div>
<label className="block text-sm mb-1">Adresse</label>
<input className="w-full border rounded px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, Ville, Pays" />
</div>
<div className="md:col-span-2">
<label className="block text-sm mb-2">Logo (PNG/JPG)</label>
<div className="flex items-center gap-4">
<input type="file" accept="image/*" onChange={onLogoChange} />
{logoPreview && <img src={logoPreview} alt="Aperçu" className="h-12 w-12 object-contain rounded border" />}
</div>
</div>
</div>


<div className="space-y-2">
<div className="flex items-center justify-between">
<label className="text-sm">Dirigeants *</label>
<button type="button" onClick={addLeader} className="px-3 py-1.5 rounded bg-black text-white text-sm">Ajouter</button>
</div>
{leaders.map((l, i) => (
<div key={i} className="flex items-center gap-2">
<input className="flex-1 border rounded px-3 py-2" value={l} onChange={(e) => updateLeader(i, e.target.value)} placeholder="Nom & Prénom" required />
{leaders.length > 1 && (
<button type="button" onClick={() => removeLeader(i)} className="text-red-600 text-sm">Retirer</button>
)}
</div>
))}
</div>


{err && <p className="text-red-600 text-sm">{err}</p>}
<button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">{submitting ? "Création…" : "Créer l’entreprise"}</button>
</form>
);
}
