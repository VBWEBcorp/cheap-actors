import "server-only";

import { Resend } from "resend";
import type { ModerationStatus } from "./user-types";

/**
 * Resend (emails transactionnels).
 *
 * Client instancié paresseusement, et NO-OP quand RESEND_API_KEY est absent :
 * le build et les flux inscription/modération ne doivent jamais planter sur un
 * environnement mal configuré (même posture défensive que lib/db.ts et lib/r2.ts).
 * Les fonctions ci-dessous n'émettent JAMAIS d'exception — elles renvoient un
 * SendResult que l'appelant peut ignorer sans risque.
 *
 * Variables requises :
 *   RESEND_API_KEY   re_xxx
 *   RESEND_FROM      "VBWEB <noreply@vbweb.fr>"  (domaine vérifié côté Resend)
 */

const FROM = process.env.RESEND_FROM ?? "Cheap Actors <onboarding@resend.dev>";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cheap-actors.com").replace(
    /\/$/,
    "",
  );
}

let client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY manquant — email non envoyé:", opts.subject);
    return { ok: false, error: "RESEND_API_KEY manquant" };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[email] envoi échoué:", error);
      return { ok: false, error: error.message ?? "Échec d'envoi" };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email] exception:", err);
    return { ok: false, error: "Exception lors de l'envoi" };
  }
}

/* =========================================================
 * Design system (inline — contraintes clients mail).
 * Univers éditorial « avis imprimé » : papier crème, encre,
 * accent flamme, titres serif (Fraunces), labels mono.
 * =========================================================
 */
const C = {
  page: "#e4ddcf", // crème un peu plus profond autour de la carte
  paper: "#efe9dc",
  ink: "#0c0c0c",
  smoke: "#797063",
  chalk: "#dcd3c2",
  flame: "#ff3a1f",
};
const SERIF =
  "'Fraunces', Georgia, 'Times New Roman', Times, serif";
const SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, 'Courier New', Courier, monospace";

/** Eyebrow mono uppercase (avec puce flamme), façon le reste du site. */
function eyebrow(label: string): string {
  return `<div style="margin:0;font-family:${MONO};font-size:10px;line-height:1.4;letter-spacing:0.28em;text-transform:uppercase;color:${C.smoke};">
    <span style="color:${C.flame};">&#9679;</span>&nbsp;&nbsp;${label}
  </div>`;
}

/** Gros titre serif, avec un point flamme façon « la vitrine. ». */
function headline(text: string): string {
  return `<h1 style="margin:14px 0 0;font-family:${SERIF};font-weight:900;font-size:42px;line-height:0.94;letter-spacing:-0.03em;color:${C.ink};">${text}<span style="color:${C.flame};">.</span></h1>`;
}

/** Sous-titre serif italique, ton « légende ». */
function dek(text: string): string {
  return `<p style="margin:14px 0 0;font-family:${SERIF};font-style:italic;font-size:20px;line-height:1.35;color:${C.smoke};">${text}</p>`;
}

function para(text: string): string {
  return `<p style="margin:18px 0 0;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.ink};">${text}</p>`;
}

/** Bouton encre, texte papier, label mono — puce flamme à droite. */
function cta(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr><td style="background:${C.ink};">
    <a href="${href}" style="display:inline-block;padding:16px 26px;font-family:${MONO};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.paper};text-decoration:none;">${label}&nbsp;&nbsp;<span style="color:${C.flame};">&#9679;</span></a>
  </td></tr></table>`;
}

function hairline(): string {
  return `<div style="height:1px;line-height:1px;font-size:0;background:${C.chalk};margin:28px 0;">&nbsp;</div>`;
}

/** Ligne label/valeur en mono (notifs admin). */
function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${C.chalk};font-family:${MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.smoke};white-space:nowrap;vertical-align:top;width:90px;">${label}</td>
    <td style="padding:8px 0 8px 16px;border-bottom:1px solid ${C.chalk};font-family:${SANS};font-size:14px;color:${C.ink};">${value}</td>
  </tr>`;
}

/** Bloc encadré flamme, signature de la home. */
function flameTag(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px 0 0;"><tr><td style="border:2px solid ${C.flame};padding:11px 18px;font-family:${MONO};font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:${C.flame};">
    <span>&#9679;</span>&nbsp;&nbsp;pas connus · pas chers · pas mal
  </td></tr></table>`;
}

/** Coquille complète : masthead + contenu + pied, sur papier crème. */
function shell(opts: { eyebrowLabel: string; preheader: string; content: string }): string {
  const url = siteUrl();
  const host = url.replace(/^https?:\/\//, "");
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,900;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
a { text-decoration: none; }
body { margin:0; padding:0; }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none!important;max-height:0;overflow:hidden;opacity:0;color:${C.page};font-size:1px;line-height:1px;">${opts.preheader}&#847;&zwnj;&#160;&#847;&zwnj;&#160;&#847;&zwnj;&#160;&#847;&zwnj;&#160;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:36px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.paper};border:1px solid ${C.ink};">
    <!-- liseré flamme -->
    <tr><td style="height:5px;line-height:5px;font-size:0;background:${C.flame};">&nbsp;</td></tr>

    <!-- masthead -->
    <tr><td style="padding:30px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${SERIF};font-weight:900;font-size:22px;letter-spacing:-0.02em;color:${C.ink};">cheap <em style="font-style:italic;">actors</em><span style="color:${C.flame};">&nbsp;&#9679;</span></td>
        <td align="right" style="font-family:${MONO};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${C.smoke};">vol. 01 · 2026</td>
      </tr></table>
      <div style="height:1px;line-height:1px;font-size:0;background:${C.ink};margin:18px 0 26px;">&nbsp;</div>
      ${eyebrow(opts.eyebrowLabel)}
    </td></tr>

    <!-- contenu -->
    <tr><td style="padding:0 40px 36px;">
      ${opts.content}
    </td></tr>

    <!-- pied -->
    <tr><td style="padding:22px 40px 30px;border-top:1px solid ${C.ink};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.smoke};">
          Cheap Actors<br>
          <a href="${url}" style="color:${C.ink};">${host}</a>
        </td>
        <td align="right" style="font-family:${MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.smoke};">
          entrée gratuite<br>sortie quand vous voulez
        </td>
      </tr></table>
    </td></tr>
  </table>
  <div style="font-family:${MONO};font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${C.smoke};opacity:0.8;margin:16px 0 0;">message automatique · ne pas répondre</div>
</td></tr>
</table>
</body>
</html>`;
}

/* =========================================================
 * Emails métier
 * =========================================================
 */

/** Bienvenue après inscription. `pending` = compte en attente de modération. */
export async function sendWelcomeEmail(
  to: string,
  displayName: string,
  pending: boolean,
): Promise<SendResult> {
  const name = escapeHtml(displayName);
  const body = pending
    ? para(
        `Ton compte est créé, <strong>${name}</strong>. Un humain — pas un algorithme — va regarder ton profil avant publication. On répond à tout, même aux refus (mais en mieux écrit).`,
      ) +
      para(
        `En attendant, tu peux déjà compléter ton profil et ajouter tes vidéos YouTube.`,
      )
    : para(
        `Ton compte est créé et actif, <strong>${name}</strong>. Complète ton profil et ajoute tes vidéos quand tu veux.`,
      );

  const content = `
    ${headline("Bienvenue")}
    ${dek("Des comédien·ne·s qu'aucune agence n'a rappelés.")}
    ${body}
    ${cta(`${siteUrl()}/mon-compte`, "Compléter mon profil")}
    ${flameTag()}
  `;
  const html = shell({
    eyebrowLabel: pending ? "Inscription · en attente" : "Inscription · actif",
    preheader: pending
      ? "Compte créé — un humain regarde ton profil avant publication."
      : "Compte créé et actif. Complète ton profil.",
    content,
  });
  const text = [
    `BIENVENUE, ${displayName}.`,
    "",
    pending
      ? "Ton compte est créé. Un humain va regarder ton profil avant publication. Tu peux déjà le compléter et ajouter tes vidéos."
      : "Ton compte est créé et actif. Complète ton profil et ajoute tes vidéos.",
    "",
    `Mon compte : ${siteUrl()}/mon-compte`,
    "",
    "Cheap Actors — pas connus · pas chers · pas mal",
  ].join("\n");

  return sendEmail({ to, subject: "Bienvenue sur Cheap Actors", html, text });
}

/** Notifie les super-admins qu'un nouveau compte attend une modération. */
export async function notifyAdminsNewSignup(opts: {
  displayName: string;
  email: string;
  roles: string[];
  adminEmails: string[];
}): Promise<SendResult> {
  if (opts.adminEmails.length === 0) return { ok: false, error: "Aucun admin" };
  const content = `
    ${headline("À modérer")}
    ${dek("Un nouveau profil attend ton feu vert.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 0;">
      ${infoRow("Nom", escapeHtml(opts.displayName))}
      ${infoRow("Email", escapeHtml(opts.email))}
      ${infoRow("Rôles", escapeHtml(opts.roles.join(" · ") || "—"))}
    </table>
    ${cta(`${siteUrl()}/admin`, "Ouvrir la modération")}
  `;
  const html = shell({
    eyebrowLabel: "Modération · nouveau compte",
    preheader: `${opts.displayName} vient de s'inscrire — à modérer.`,
    content,
  });
  const text = [
    "NOUVEAU COMPTE À MODÉRER",
    "",
    `Nom   : ${opts.displayName}`,
    `Email : ${opts.email}`,
    `Rôles : ${opts.roles.join(" · ")}`,
    "",
    `Modérer : ${siteUrl()}/admin`,
  ].join("\n");

  return sendEmail({
    to: opts.adminEmails,
    subject: `Nouveau compte à modérer — ${opts.displayName}`,
    html,
    text,
    replyTo: opts.email,
  });
}

/** Notifie l'acteur d'une décision de modération (approuvé / refusé / suspendu). */
export async function sendModerationEmail(opts: {
  to: string;
  displayName: string;
  status: ModerationStatus;
  slug: string;
  reason?: string;
}): Promise<SendResult> {
  const { status, slug, reason } = opts;
  const name = escapeHtml(opts.displayName);
  const reasonBlock = reason
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;border-left:3px solid ${C.flame};">
        <tr><td style="padding:4px 0 4px 16px;font-family:${MONO};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.smoke};">Motif</td></tr>
        <tr><td style="padding:2px 0 4px 16px;font-family:${SANS};font-size:14px;line-height:1.55;color:${C.ink};">${escapeHtml(reason)}</td></tr>
      </table>`
    : "";

  let subject: string;
  let eyebrowLabel: string;
  let preheader: string;
  let content: string;
  let text: string;

  if (status === "approved") {
    subject = "Ton profil Cheap Actors est en ligne";
    eyebrowLabel = "Modération · validé";
    preheader = "C'est validé — ton profil est public.";
    content = `
      ${headline("C'est validé")}
      ${dek(`Bienvenue dans la vitrine, ${name}.`)}
      ${para("Ton profil est désormais public. Les gens peuvent te découvrir, regarder tes vidéos, et se souvenir de ton nom.")}
      ${cta(`${siteUrl()}/acteurs/${encodeURIComponent(slug)}`, "Voir mon profil public")}
      ${flameTag()}
    `;
    text = `C'EST VALIDÉ\n\nTon profil est en ligne et public.\n\nVoir : ${siteUrl()}/acteurs/${slug}`;
  } else if (status === "rejected") {
    subject = "À propos de ton profil Cheap Actors";
    eyebrowLabel = "Modération · pas retenu";
    preheader = "Pas cette fois — mais tu peux ajuster et retenter.";
    content = `
      ${headline("Pas cette fois")}
      ${dek(`On répond à tout, ${name} — même aux refus.`)}
      ${para("Ton profil n'a pas été retenu pour le moment. Ce n'est pas définitif : ajuste-le et retente quand tu veux.")}
      ${reasonBlock}
      ${cta(`${siteUrl()}/mon-compte`, "Ajuster mon profil")}
    `;
    text = `PAS CETTE FOIS\n\nTon profil n'a pas été retenu pour le moment.${reason ? `\n\nMotif : ${reason}` : ""}\n\nAjuster : ${siteUrl()}/mon-compte`;
  } else if (status === "suspended") {
    subject = "Ton profil Cheap Actors a été suspendu";
    eyebrowLabel = "Modération · suspendu";
    preheader = "Ton profil a été suspendu.";
    content = `
      ${headline("Profil suspendu")}
      ${dek("Ton profil n'est plus visible publiquement.")}
      ${para("Il a été suspendu et retiré de la vitrine. Pour comprendre ou contester, réponds à cet email ou écris-nous.")}
      ${reasonBlock}
    `;
    text = `PROFIL SUSPENDU\n\nTon profil a été suspendu et n'est plus visible.${reason ? `\n\nMotif : ${reason}` : ""}`;
  } else {
    // "pending" — pas d'email (état transitoire).
    return { ok: false, error: "Statut sans notification" };
  }

  return sendEmail({ to: opts.to, subject, html: shell({ eyebrowLabel, preheader, content }), text });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
