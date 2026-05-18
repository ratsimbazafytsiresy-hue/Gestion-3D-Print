import { ClientList } from "@/features/clients/client-list";
import { getClientsData } from "@/lib/data/repository";

export default function ClientsPage() {
  return <ClientList {...getClientsData()} />;
}
