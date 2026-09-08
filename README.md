# Portfolio — Théo FERRETE

Portfolio full-stack avec un espace admin pour gérer le contenu (projets, compétences, profil) sans toucher au code.

## Installation

```bash
npm install
```

### Variables d'environnement

Crée un fichier `.env.local` à la racine avec :

```bash
# Supabase (Project Settings → API dans le dashboard Supabase)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# NextAuth — génère une valeur avec `npm run generate-secret`
NEXTAUTH_SECRET=...

# Identifiants admin (facultatif si déjà en base, voir plus bas)
ADMIN_EMAIL=ton-email@exemple.com
ADMIN_PASSWORD_HASH=...  # généré avec `npm run hash-password`
```

Sans `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`, le site ne peut pas charger les projets/compétences/profil. Sans `NEXTAUTH_SECRET`, la connexion admin échoue.

Le mot de passe admin peut aussi être stocké directement en base (table `admin_auth`, prioritaire sur `ADMIN_PASSWORD_HASH`) — pratique pour le changer sans redéployer.

### Base de données

Les migrations SQL sont dans `supabase/migrations/`, à exécuter dans l'éditeur SQL du dashboard Supabase, dans l'ordre numéroté.

### Lancer le projet

```bash
npm run dev      # développement — http://localhost:3000
npm run build    # build de production
npm start        # lancer le build
npm test         # tests (Vitest)
```

## Structure

```text
app/
├── (public)/          # Pages publiques : accueil, projets, compétences, contact
├── admin/              # Espace admin (protégé par NextAuth) : dashboard, CRUD projets/compétences,
│                        profil, sécurité 2FA, messages de contact, logs d'audit
├── api/                # Routes API (publiques + /api/admin protégées)
├── components/
│   ├── sections/        # Sections de page (Hero, About, Skills, Projects, Contact...)
│   ├── ui/               # Composants réutilisables (cartes, boutons...)
│   ├── layout/           # Header, Footer, navigation
│   └── providers/        # Contexts (auth...)
lib/
├── data/                # Accès aux données Supabase + validation (Zod)
├── auth/                # NextAuth, 2FA, politique de mots de passe
├── security/             # Rate limiting, audit log, IP
└── supabase/              # Client Supabase (service role, bypasse RLS)
supabase/migrations/     # Schéma SQL, à appliquer manuellement
```

## Contenu géré depuis l'admin

Le contenu du site (projets, compétences, profil, réglages) vit en base Supabase, pas dans le code. Connecte-toi sur `/admin/login` pour tout gérer : ajouter/modifier des projets (avec une mini étude de cas par projet), des compétences, ton profil, activer la 2FA, et consulter les messages de contact reçus.

## Identité visuelle

Thème fixe façon éditeur de code : fond quasi-noir, rouge en accent principal (`--accent` dans `app/globals.css`), teal/ambre/vert en accents secondaires pour les tags et statuts. Les icônes de compétences sont déduites automatiquement du nom de la techno (`lib/skill-icons.tsx`), pas saisies à la main.

## Stack

- **Next.js 16** (App Router) / **React 19** / **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Postgres) pour les données
- **NextAuth** (credentials + 2FA optionnel) pour l'admin
- **Vitest** pour les tests
