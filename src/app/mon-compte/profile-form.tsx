"use client";

import { useActionState, useState } from "react";
import { Check, Save, ChevronDown } from "lucide-react";
import { saveProfileAction, type ProfileState } from "./actions";
import { type PublicUser } from "@/lib/user-types";
import { RolesPicker } from "@/components/roles-picker";

const initial: ProfileState = {};

export function ProfileForm({ initial: user }: { initial: PublicUser }) {
  const [state, action, pending] = useActionState(saveProfileAction, initial);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "");
  const [bonusOpen, setBonusOpen] = useState(
    Boolean(user.basedIn || user.born || user.funFact),
  );

  return (
    <form action={action} className="space-y-8">
      {/* Photo + identity */}
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <div>
          <Label>Photo</Label>
          <div className="mt-2 aspect-[3/4] w-full overflow-hidden border border-ink/15 bg-chalk">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-5xl font-black italic text-ink/40">
                  {user.displayName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <input
            id="photoUrl"
            name="photoUrl"
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://… (URL de votre photo)"
            className="input mt-2 text-sm"
          />
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-smoke">
            Imgur, Cloudinary, Unsplash…
          </p>
        </div>

        <div className="space-y-5">
          <Field label="Nom de scène" htmlFor="displayName" hint="Public">
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              minLength={2}
              maxLength={60}
              defaultValue={user.displayName}
              className="input"
            />
          </Field>

          <Field label="Vous êtes" hint="1 ou 2 rôles">
            <div className="mt-2">
              <RolesPicker initial={user.roles} required />
            </div>
          </Field>

          <Field label="En une phrase" htmlFor="tagline" hint="Max 120 — c'est la phrase qu'on lit sous votre nom">
            <input
              id="tagline"
              name="tagline"
              type="text"
              maxLength={120}
              defaultValue={user.tagline}
              placeholder="Joue mieux fatigué."
              className="input"
            />
          </Field>
        </div>
      </div>

      {/* Bio (full width) */}
      <Field label="Présentation" htmlFor="bio" hint="Max 800 — quelques phrases sur vous">
        <textarea
          id="bio"
          name="bio"
          rows={6}
          maxLength={800}
          defaultValue={user.bio}
          placeholder="Quelques lignes sur vous, votre parcours, votre approche, vos influences…"
          className="input min-h-[140px] resize-y"
        />
      </Field>

      {/* Optional details — collapsible */}
      <div className="border border-ink/10">
        <button
          type="button"
          onClick={() => setBonusOpen(!bonusOpen)}
          aria-expanded={bonusOpen}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-ink/[0.02]"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              ●  Détails (facultatifs)
            </p>
            <p className="mt-1 font-display text-base">
              Ville, année de naissance, fun fact
            </p>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-smoke transition-transform ${bonusOpen ? "rotate-180" : ""}`}
          />
        </button>
        {bonusOpen && (
          <div className="grid gap-5 border-t border-ink/10 p-4 md:grid-cols-2">
            <Field label="Basé·e à" htmlFor="basedIn">
              <input
                id="basedIn"
                name="basedIn"
                type="text"
                maxLength={60}
                defaultValue={user.basedIn ?? ""}
                placeholder="Paris"
                className="input"
              />
            </Field>

            <Field label="Année de naissance" htmlFor="born">
              <input
                id="born"
                name="born"
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                defaultValue={user.born ?? ""}
                placeholder="1995"
                className="input"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Fun fact" htmlFor="funFact" hint="Max 160 · public">
                <input
                  id="funFact"
                  name="funFact"
                  type="text"
                  maxLength={160}
                  defaultValue={user.funFact ?? ""}
                  placeholder="A 3 chats. Refuse de les nommer."
                  className="input"
                />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
          {state.error && <span className="text-flame">✗ {state.error}</span>}
          {state.ok && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              Enregistré
            </span>
          )}
          {!state.error && !state.ok && (
            <span>Pensez à enregistrer après modification</span>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 bg-ink px-6 py-3 text-sm font-medium tracking-tight text-paper transition hover:bg-flame disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
          <Save className="h-4 w-4" />
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(12, 12, 12, 0.15);
          padding: 10px 12px;
          font-family: var(--font-display);
          font-size: 17px;
          line-height: 1.4;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: #ff3a1f; }
        .input::placeholder { color: rgba(12, 12, 12, 0.35); }
      `}</style>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
      {children}
    </span>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
        {label}
        {hint && (
          <span className="text-[9px] normal-case tracking-tight text-smoke/70">
            {hint}
          </span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
