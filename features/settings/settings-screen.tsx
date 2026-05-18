import { Badge } from "@/components/ui/badge";
import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const roles = ["Admin", "membre"];
const materials = ["FDM", "PLA", "PETG", "ABS", "TPU", "ASA"];
const futureModules = ["stock matiere", "maintenance machines", "portail client", "PDF export", "compta"];

export function SettingsScreen() {
  const environmentLabel = hasSupabaseEnv() ? "Supabase" : "Demo fixtures";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-atelier-line pb-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Finance Atelier</p>
          <h1 className="mt-2 text-2xl font-semibold text-atelier-ink">Parametres</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-atelier-muted">
            Configuration V1 de l&apos;application interne et reperes d&apos;exploitation atelier.
          </p>
        </div>
        <Badge tone={environmentLabel === "Supabase" ? "green" : "amber"} className="w-fit">
          {environmentLabel}
        </Badge>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Panel>
          <PanelHeader>
            <PanelTitle>Application</PanelTitle>
            <PanelDescription>Identite et source de donnees active.</PanelDescription>
          </PanelHeader>
          <PanelContent className="grid gap-4">
            <InfoRow label="Nom" value="Gestion Crafted" />
            <InfoRow label="Environnement" value={environmentLabel} />
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Roles</PanelTitle>
            <PanelDescription>Affichage des profils prevus pour la V1.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} tone={role === "Admin" ? "amber" : "neutral"}>
                  {role}
                </Badge>
              ))}
            </div>
          </PanelContent>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader>
            <PanelTitle>Matieres V1</PanelTitle>
            <PanelDescription>Liste de reference pour les flux FDM et couts atelier.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {materials.map((material) => (
                <Badge className="justify-center" key={material} tone={material === "FDM" ? "amber" : "neutral"}>
                  {material}
                </Badge>
              ))}
            </div>
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Modules futurs</PanelTitle>
            <PanelDescription>Perimetre identifie mais hors version active.</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <div className="flex flex-wrap gap-2">
              {futureModules.map((moduleName) => (
                <Badge key={moduleName}>{moduleName}</Badge>
              ))}
            </div>
          </PanelContent>
        </Panel>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4 rounded-md border border-atelier-line bg-white px-3 py-2">
      <span className="text-xs font-medium uppercase tracking-wide text-atelier-muted">{label}</span>
      <span className="truncate text-sm font-semibold text-atelier-ink">{value}</span>
    </div>
  );
}
