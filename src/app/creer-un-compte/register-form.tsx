"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { registerAction, type RegisterState } from "./actions";
import { RolesPicker } from "@/components/roles-picker";

const initial: RegisterState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);

  return (
    <form action={action} className="grid gap-5 border border-ink/15 bg-paper p-6 md:p-8">
      <Field label="Nom de scène" htmlFor="displayName">
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          defaultValue={state.values?.displayName ?? ""}
          placeholder="Lou Daubigné"
          className="w-full border-b border-ink/30 bg-transparent py-2 font-display text-xl outline-none focus:border-flame"
        />
      </Field>

      <Field label="Vous êtes" htmlFor="roles" hint="1 ou 2 rôles">
        <div className="mt-2">
          <RolesPicker initial={state.values?.roles ?? []} required />
        </div>
      </Field>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          placeholder="lou@exemple.com"
          className="w-full border-b border-ink/30 bg-transparent py-2 font-display text-xl outline-none focus:border-flame"
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password" hint="8 caractères minimum">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
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
        {pending ? "Création…" : "Créer mon compte"}
        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
      </button>

      <p className="text-xs text-smoke">
        En vous inscrivant, vous acceptez qu'on regarde vos vidéos avec attention,
        et qu'on en parle dans notre dos.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
        {label}
        {hint && <span className="text-[9px] normal-case tracking-tight text-smoke/70">{hint}</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
