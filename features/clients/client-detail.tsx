import Link from "next/link";
import { ArrowUpRight, FileText, LayoutGrid, Mail, MapPin, Phone, ReceiptText, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BusinessDocument, Client, Project } from "@/lib/domain/types";
import { formatCalendarDate } from "@/features/projects/project-date-format";

type ClientDetailProps = {
  client: Client | null;
  invoices: BusinessDocument[];
  projects: Project[];
  quotes: BusinessDocument[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function ClientDetail({ client, invoices, projects, quotes }: ClientDetailProps) {
  if (!client) {
    return <EmptyState className="py-8" title="Client introuvable" />;
  }

  const sortedProjects = [...projects].sort((left, right) => left.deliveryDate.localeCompare(right.deliveryDate));
  const sortedQuotes = [...quotes].sort((left, right) => right.issueDate.localeCompare(left.issueDate));
  const sortedInvoices = [...invoices].sort((left, right) => right.issueDate.localeCompare(left.issueDate));
  const activeInvoiceTotal = sortedInvoices
    .filter((invoice) => invoice.type === "invoice" && invoice.status !== "annulee")
    .reduce((total, invoice) => total + invoice.totalIncludingVat, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-atelier-line pb-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Fiche client</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">{client.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>
              <UserRound aria-hidden className="mr-1.5 h-3.5 w-3.5" />
              {client.contactName || "Contact non renseigne"}
            </Badge>
            <Badge tone="green">{currencyFormatter.format(activeInvoiceTotal)} facture</Badge>
            <Badge tone="amber">{projects.length} projets</Badge>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-atelier-muted">{client.notes || "Aucune note renseignee pour ce client."}</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(320px,0.55fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader>
            <PanelTitle>Coordonnees</PanelTitle>
            <PanelDescription>Informations utiles pour relance, livraison et facturation.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <div className="grid gap-3">
              <InfoTile icon={<Mail aria-hidden className="h-4 w-4" />} label="Email" value={client.email || "Non renseigne"} />
              <InfoTile icon={<Phone aria-hidden className="h-4 w-4" />} label="Telephone" value={client.phone || "Non renseigne"} />
              <InfoTile icon={<MapPin aria-hidden className="h-4 w-4" />} label="Adresse" value={client.address || "Non renseignee"} />
            </div>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Projets lies</PanelTitle>
            <PanelDescription>Dossiers atelier rattaches au client.</PanelDescription>
          </PanelHeader>
          <PanelContent className={sortedProjects.length > 0 ? "p-0" : undefined}>
            {sortedProjects.length > 0 ? (
              <TableContainer className="rounded-none border-0 bg-transparent">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projet</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Livraison</TableHead>
                      <TableHead className="text-right">Montant estime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProjects.map((project) => (
                      <TableRow key={project.id} className="group">
                        <TableCell className="max-w-80 whitespace-normal py-3">
                          <Link className="flex items-start gap-2 font-medium leading-5 hover:text-atelier-amber" href={`/projets/${project.id}`}>
                            <span>{project.title}</span>
                            <ArrowUpRight
                              aria-hidden
                              className="mt-0.5 h-4 w-4 shrink-0 text-atelier-muted transition-colors group-hover:text-atelier-amber"
                            />
                          </Link>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-atelier-muted">{project.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge>{project.status}</Badge>
                        </TableCell>
                        <TableCell className="tabular-nums text-atelier-muted">{formatCalendarDate(project.deliveryDate)}</TableCell>
                        <TableCell className="text-right tabular-nums">{currencyFormatter.format(project.estimatedAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <EmptyState icon={<LayoutGrid aria-hidden size={18} />} title="Aucun projet" />
            )}
          </PanelContent>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocumentHistory documents={sortedQuotes} emptyTitle="Aucun devis" icon={<FileText aria-hidden size={18} />} title="Historique devis" />
        <DocumentHistory
          documents={sortedInvoices}
          emptyTitle="Aucune facture"
          icon={<ReceiptText aria-hidden size={18} />}
          title="Historique factures"
        />
      </section>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-atelier-line bg-white px-3 py-3">
      <div className="flex items-center gap-2 text-atelier-muted">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-atelier-ink">{value}</p>
    </div>
  );
}

function DocumentHistory({
  documents,
  emptyTitle,
  icon,
  title,
}: {
  documents: BusinessDocument[];
  emptyTitle: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        <PanelDescription>Documents commerciaux lies au compte client.</PanelDescription>
      </PanelHeader>
      <PanelContent className={documents.length > 0 ? "p-0" : undefined}>
        {documents.length > 0 ? (
          <TableContainer className="rounded-none border-0 bg-transparent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Emission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Total TTC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <Link className="font-medium hover:text-atelier-amber" href={`/devis-factures#${document.id}`}>
                        {document.number}
                      </Link>
                      <p className="mt-1 text-xs text-atelier-muted">{document.type === "quote" ? "Devis" : "Facture"}</p>
                    </TableCell>
                    <TableCell className="tabular-nums text-atelier-muted">{formatCalendarDate(document.issueDate)}</TableCell>
                    <TableCell>
                      <Badge tone={document.status === "annulee" || document.status === "refuse" ? "danger" : "neutral"}>
                        {document.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{currencyFormatter.format(document.totalIncludingVat)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState icon={icon} title={emptyTitle} />
        )}
      </PanelContent>
    </Panel>
  );
}
