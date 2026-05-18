import { Badge } from "@/components/ui/badge";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PROJECT_STATUS_LABELS } from "@/lib/domain/constants";
import { getProjectFinancials, isProjectAtRisk } from "@/lib/domain/calculations";
import { clients, documents, expenses, projects } from "@/lib/domain/fixtures";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
  style: "percent",
});

const clientById = new Map(clients.map((client) => [client.id, client]));

const projectRows = projects.slice(0, 4).map((project) => {
  const financials = getProjectFinancials(project, documents, expenses);

  return {
    ...project,
    clientName: clientById.get(project.clientId)?.name ?? "Client inconnu",
    financials,
    atRisk: isProjectAtRisk(financials),
  };
});

const totals = projectRows.reduce(
  (current, project) => ({
    expenses: current.expenses + project.financials.expensesTotal,
    margin: current.margin + project.financials.margin,
    revenue: current.revenue + project.financials.revenueBasis,
  }),
  { expenses: 0, margin: 0, revenue: 0 },
);

const marginRate = totals.revenue > 0 ? totals.margin / totals.revenue : 0;

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Pilotage atelier</h1>
        </div>
        <Badge tone="amber">Finance Atelier</Badge>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricPanel label="Chiffre suivi" value={currencyFormatter.format(totals.revenue)} />
        <MetricPanel label="Marge estimee" value={currencyFormatter.format(totals.margin)} tone="green" />
        <MetricPanel label="Taux de marge" value={percentFormatter.format(marginRate)} tone="amber" />
      </section>

      <Panel>
        <PanelHeader>
          <PanelTitle>Projets recents</PanelTitle>
          <PanelDescription>Vue compacte pour valider le shell et les primitives UI avant le dashboard complet.</PanelDescription>
        </PanelHeader>
        <PanelContent className="p-0">
          <TableContainer className="rounded-none border-0 bg-transparent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Livraison</TableHead>
                  <TableHead className="text-right">Marge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRows.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="text-atelier-muted">{project.clientName}</TableCell>
                    <TableCell>
                      <Badge tone={project.atRisk ? "danger" : project.status === "en_production" ? "amber" : "neutral"}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-atelier-muted">{project.deliveryDate}</TableCell>
                    <TableCell className="text-right font-medium text-atelier-green">
                      {currencyFormatter.format(project.financials.margin)}
                    </TableCell>
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

function MetricPanel({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "amber" | "green" }) {
  const toneClass = {
    amber: "text-atelier-amber",
    green: "text-atelier-green",
    neutral: "text-atelier-ink",
  }[tone];

  return (
    <Panel>
      <PanelContent>
        <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">{label}</p>
        <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</p>
      </PanelContent>
    </Panel>
  );
}
