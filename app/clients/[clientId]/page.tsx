import { ClientDetail } from "@/features/clients/client-detail";
import { getClientsData } from "@/lib/data/repository";

type ClientDetailPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = await params;
  const { clients, documents, projects } = getClientsData();
  const client = clients.find((item) => item.id === clientId) ?? null;

  return (
    <ClientDetail
      client={client}
      invoices={documents.filter((document) => document.clientId === clientId && document.type === "invoice")}
      projects={projects.filter((project) => project.clientId === clientId)}
      quotes={documents.filter((document) => document.clientId === clientId && document.type === "quote")}
    />
  );
}
