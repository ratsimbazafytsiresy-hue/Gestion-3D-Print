import Link from "next/link";
import { ArrowUpRight, ReceiptText, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BusinessDocument, Client, Project } from "@/lib/domain/types";

type ClientListProps = {
  clients: Client[];
  documents: BusinessDocument[];
  projects: Project[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function ClientList({ clients, documents, projects }: ClientListProps) {
  const rows = clients.map((client) => {
    const clientProjects = projects.filter((project) => project.clientId === client.id);
    const invoicedAmount = documents
      .filter((document) => document.clientId === client.id && document.type === "invoice" && document.status !== "annulee")
      .reduce((total, invoice) => total + invoice.totalIncludingVat, 0);

    return {
      client,
      invoicedAmount,
      projectsCount: clientProjects.length,
    };
  });

  const totalInvoiced = rows.reduce((total, row) => total + row.invoicedAmount, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Clients</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Base clients</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Contacts, projets rattaches et montant facture par compte client.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="amber" className="w-fit">
            <Users aria-hidden className="mr-1.5 h-3.5 w-3.5" />
            {clients.length} clients
          </Badge>
          <Badge tone="green" className="w-fit">
            <ReceiptText aria-hidden className="mr-1.5 h-3.5 w-3.5" />
            {currencyFormatter.format(totalInvoiced)}
          </Badge>
        </div>
      </header>

      <Panel>
        <PanelHeader>
          <PanelTitle>Portefeuille clients</PanelTitle>
          <PanelDescription>Ouvrir une fiche client pour consulter ses historiques projets, devis et factures.</PanelDescription>
        </PanelHeader>
        <PanelContent className="p-0">
          <TableContainer className="rounded-none border-0 bg-transparent">
            <Table className="min-w-[920px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead className="text-right">Projets</TableHead>
                  <TableHead className="text-right">Montant facture</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ client, invoicedAmount, projectsCount }) => (
                  <TableRow key={client.id} className="group">
                    <TableCell className="max-w-72 whitespace-normal py-3">
                      <Link className="flex items-start gap-2 font-medium leading-5 hover:text-atelier-amber" href={`/clients/${client.id}`}>
                        <span>{client.name}</span>
                        <ArrowUpRight
                          aria-hidden
                          className="mt-0.5 h-4 w-4 shrink-0 text-atelier-muted transition-colors group-hover:text-atelier-amber"
                        />
                      </Link>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-atelier-muted">{client.notes || "Aucune note client"}</p>
                    </TableCell>
                    <TableCell className="text-atelier-muted">{client.contactName || "Non renseigne"}</TableCell>
                    <TableCell>
                      {client.email ? (
                        <a className="text-atelier-muted hover:text-atelier-amber" href={`mailto:${client.email}`}>
                          {client.email}
                        </a>
                      ) : (
                        <span className="text-atelier-muted">Non renseigne</span>
                      )}
                    </TableCell>
                    <TableCell className="text-atelier-muted">{client.phone || "Non renseigne"}</TableCell>
                    <TableCell className="text-right tabular-nums">{projectsCount}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{currencyFormatter.format(invoicedAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </PanelContent>
      </Panel>
    </div>
  );
}
