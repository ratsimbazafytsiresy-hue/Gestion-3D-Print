"use client";

import { FormEvent, useId, useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const demoModeMessage = "Mode demo actif: configure Supabase pour activer la connexion reelle.";

function hasPublicSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = useId();
  const passwordId = useId();
  const feedbackId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!hasPublicSupabaseEnv()) {
      setFeedback({ tone: "success", message: demoModeMessage });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setFeedback({ tone: "error", message: error.message || "Connexion impossible. Verifiez vos identifiants." });
        return;
      }

      setFeedback({ tone: "success", message: `Connexion reussie pour ${email}.` });
      router.replace(getRedirectTarget(searchParams.get("redirectedFrom")));
      router.refresh();
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Connexion impossible. Reessayez dans un instant.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form aria-describedby={feedback ? feedbackId : undefined} className="grid gap-4" onSubmit={handleSubmit}>
      <Field htmlFor={emailId} label="Email">
        <Input
          autoComplete="email"
          disabled={isLoading}
          id={emailId}
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="atelier@example.com"
          required
          type="email"
          value={email}
        />
      </Field>

      <Field htmlFor={passwordId} label="Mot de passe">
        <Input
          autoComplete="current-password"
          disabled={isLoading}
          id={passwordId}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Votre mot de passe"
          required
          type="password"
          value={password}
        />
      </Field>

      {feedback ? (
        <p
          className={feedback.tone === "error" ? "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-atelier-danger" : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-atelier-green"}
          id={feedbackId}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      ) : null}

      <Button className="w-full" disabled={isLoading} type="submit">
        <LogIn aria-hidden="true" size={16} />
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}

function getRedirectTarget(redirectedFrom: string | null) {
  if (!redirectedFrom || !redirectedFrom.startsWith("/") || redirectedFrom.startsWith("//")) {
    return "/";
  }

  return redirectedFrom;
}
