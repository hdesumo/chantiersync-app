import { cardClasses } from "@/components/ui";

export default function ReportsPlaceholder() {
  return (
    <div className="grid gap-4">
      <div className={cardClasses()}>
        <h1 className="text-xl font-semibold">Rapports</h1>
        <p className="text-mutedText">
          La page Rapports arrive bientôt. Pour l’instant, utilisez la section <b>Sites</b> pour créer un chantier.
        </p>
      </div>
    </div>
  );
}

