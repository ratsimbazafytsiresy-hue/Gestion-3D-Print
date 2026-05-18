import { DocumentEditor } from "@/features/documents/document-editor";
import { DocumentList } from "@/features/documents/document-list";
import { getDocumentsData } from "@/lib/data/repository";

export default function QuotesAndInvoicesPage() {
  const data = getDocumentsData();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Finance Atelier</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Devis & factures</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Gestion dense des pieces commerciales rattachees aux clients et aux projets de production.
          </p>
        </div>
      </header>

      <DocumentList {...data} />
      <DocumentEditor clients={data.clients} projects={data.projects} />
    </div>
  );
}
