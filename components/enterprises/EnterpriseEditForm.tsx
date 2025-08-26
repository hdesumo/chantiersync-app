// components/enterprises/EnterpriseEditForm.tsx
<label className="block text-sm mb-1">Nom *</label>
<input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
</div>
<div>
<label className="block text-sm mb-1">Slug *</label>
<input className="w-full border rounded px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
</div>
<div>
<label className="block text-sm mb-1">Téléphone *</label>
<input className="w-full border rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} required />
</div>
<div>
<label className="block text-sm mb-1">Adresse</label>
<input className="w-full border rounded px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
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
<input className="flex-1 border rounded px-3 py-2" value={l} onChange={(e) => updateLeader(i, e.target.value)} required />
{leaders.length > 1 && (
<button type="button" onClick={() => removeLeader(i)} className="text-red-600 text-sm">Retirer</button>
)}
</div>
))}
</div>


{err && <p className="text-red-600 text-sm">{err}</p>}


<div className="flex items-center gap-3">
<button type="submit" disabled={saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer"}</button>
{!confirmingDelete ? (
<button type="button" onClick={() => setConfirmingDelete(true)} className="px-4 py-2 rounded border border-red-500 text-red-600">Supprimer</button>
) : (
<>
<span className="text-sm">Confirmer ?</span>
<button type="button" onClick={onDelete} className="px-3 py-2 rounded bg-red-600 text-white">Oui</button>
<button type="button" onClick={() => setConfirmingDelete(false)} className="px-3 py-2 rounded border">Non</button>
</>
)}
</div>
</form>
);
}
