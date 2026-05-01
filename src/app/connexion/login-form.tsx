"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";
  const from = params.get("from") ?? "/mon-compte";

  return (
    <form action={action} className="grid gap-5 border border-ink/15 bg-paper p-6 md:p-8">
      <input type="hidden" name="from" value={from} />

      {justRegistered && (
        <p className="border border-flame/40 bg-flame/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
          ✓ Compte créé. Connectez-vous.
        </p>
      )}

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          className="w-full border-b border-ink/30 bg-transparent py-2 font-display text-xl outline-none focus:border-flame"
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border-b border-ink/30 bg-transparent py-2 font-display text-xl outline-none focus:border-flame"
        />
      </Field>

      {state.error && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
          ✗ {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-2 inline-flex items-center justify-between gap-3 bg-ink px-5 py-4 text-sm font-medium tracking-tight text-paper transition hover:bg-flame disabled:opacity-50"
      >
        {pending ? "Connexion…" : "Se connecter"}
        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
