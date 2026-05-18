import { Panel, PanelContent, PanelDescription, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-6">
      <Panel className="w-full max-w-md">
        <PanelHeader>
          <p className="text-xs font-medium uppercase tracking-wide text-atelier-muted">Finance Atelier</p>
          <PanelTitle className="mt-2 text-xl">Gestion Crafted</PanelTitle>
          <PanelDescription>Connexion a l&apos;espace interne de pilotage atelier.</PanelDescription>
        </PanelHeader>
        <PanelContent>
          <LoginForm />
        </PanelContent>
      </Panel>
    </div>
  );
}
