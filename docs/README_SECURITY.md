# 🔐 Guide de Sécurité - Portfolio

Ce portfolio intègre des fonctionnalités de sécurité niveau entreprise pour protéger votre contenu et vos données.

## 📋 Table des matières

- [Fonctionnalités de sécurité](#fonctionnalités-de-sécurité)
- [Configuration initiale](#configuration-initiale)
- [Déploiement sur OVH](#déploiement-sur-ovh)
- [Maintenance](#maintenance)

## 🛡️ Fonctionnalités de sécurité

### 1. Authentification renforcée
- ✅ Hashage de mot de passe avec bcrypt (10 rounds)
- ✅ Sessions JWT sécurisées (24h max)
- ✅ Protection contre les attaques par force brute
- ✅ Rate limiting sur le login (5 tentatives / 15min)

### 2. Protection des routes
- ✅ Middleware Next.js pour toutes les routes admin
- ✅ Vérification du rôle admin côté serveur
- ✅ Redirection automatique si non authentifié
- ✅ Protection des APIs avec vérification de session

### 3. Headers de sécurité HTTP
- ✅ **X-Frame-Options**: DENY (anti-clickjacking)
- ✅ **X-Content-Type-Options**: nosniff
- ✅ **Referrer-Policy**: strict-origin
- ✅ **Permissions-Policy**: restrictions strictes
- ✅ **HSTS**: Strict-Transport-Security (production)

### 4. Validation des données
- ✅ Schémas Zod pour toutes les APIs
- ✅ Validation côté serveur obligatoire
- ✅ Sanitization des inputs
- ✅ Type-safety avec TypeScript

### 5. Audit et logs
- ✅ Logging de toutes les actions admin
- ✅ Tracking IP et user-agent
- ✅ Horodatage précis
- ✅ Interface de visualisation
- ✅ Nettoyage automatique des vieux logs

### 6. Rate limiting
- ✅ Login: 5 tentatives / 15min
- ✅ APIs admin: 100 requêtes / 15min
- ✅ APIs publiques: 200 requêtes / 15min
- ✅ Par adresse IP

## ⚙️ Configuration initiale

### 1. Installation des dépendances

```bash
npm install
```

### 2. Générer un secret NextAuth

```bash
npm run generate-secret
```

Copiez la valeur générée dans `.env.local` :
```env
NEXTAUTH_SECRET=valeur_générée
```

### 3. Hasher votre mot de passe

```bash
npm run hash-password
```

Entrez votre mot de passe, puis copiez le hash dans `.env.local` :
```env
ADMIN_PASSWORD_HASH=hash_généré
```

⚠️ **Important Next.js** : dans un fichier `.env`, les `$` sont interprétés. Un hash bcrypt doit etre stocké avec des dollars échappés:
```env
ADMIN_PASSWORD_HASH=\$2b\$10\$...
```

### 4. Configuration .env.local

Créez un fichier `.env.local` à la racine :

```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<votre_secret_généré>

# Admin
ADMIN_EMAIL=votre-email@domain.com
ADMIN_PASSWORD_HASH=<votre_hash_généré>

# Sécurité
ENABLE_AUDIT_LOGS=true
```

⚠️ **IMPORTANT** : Ne JAMAIS committer `.env.local` ou `.env.production`

### 5. Démarrage

```bash
npm run dev
```

Accédez à http://localhost:3000

## 🌐 Déploiement sur OVH

### 1. Préparer le build

```bash
npm run build
```

Vérifiez qu'il n'y a pas d'erreurs.

### 2. Variables d'environnement OVH

Dans le panel OVH, configurez ces variables :

```env
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=<votre_secret>
ADMIN_EMAIL=<votre_email>
ADMIN_PASSWORD_HASH=<votre_hash>
ENABLE_AUDIT_LOGS=true
```

⚠️ **N'utilisez JAMAIS `ADMIN_PASSWORD` en production !**

### 3. SSL/HTTPS

Assurez-vous que :
- ✅ SSL est activé sur votre domaine OVH
- ✅ Certificat valide
- ✅ Redirection HTTP → HTTPS configurée

### 4. Upload des fichiers

Uploadez via FTP/SSH ou Git :
- Tout le dossier `.next/`
- `node_modules/`
- `public/`
- `package.json`

### 5. Démarrage

```bash
npm start
```

## 🔒 Bonnes pratiques

### Mots de passe

✅ **À FAIRE**
- Utiliser `ADMIN_PASSWORD_HASH` uniquement
- Générer via `npm run hash-password`
- Mot de passe minimum 12 caractères
- Combiner majuscules, minuscules, chiffres, symboles

❌ **À ÉVITER**
- Stocker le mot de passe en clair
- Utiliser `ADMIN_PASSWORD` en production
- Mots de passe simples ou communs
- Réutiliser des mots de passe

### Secrets

✅ **À FAIRE**
- Générer via `npm run generate-secret`
- Différents secrets dev/production
- Secrets longs (32+ caractères)
- Rotation régulière

❌ **À ÉVITER**
- Secrets par défaut ou d'exemple
- Committer les secrets dans Git
- Partager les secrets
- Secrets courts

### Logs d'audit

Les logs sont stockés dans la table Supabase `audit_logs` (1000 entrées max retournées en lecture, voir [lib/security/audit-log.ts](../lib/security/audit-log.ts)). Pour les consulter, utilisez le SQL Editor Supabase ou l'interface web :

Interface web : `https://votre-domaine.com/admin/audit-logs`

## 🔧 Maintenance

### Nettoyage des logs

Les logs sont automatiquement limités à 1000 entrées. Pour nettoyer manuellement :

```typescript
import { cleanOldLogs } from '@/lib/audit-log';

// Garder 90 derniers jours
await cleanOldLogs(90);
```

### Sauvegardes

Toutes les données (projets, skills, profil, messages, 2FA, logs d'audit) sont stockées dans Supabase. Utilisez les sauvegardes automatiques du dashboard Supabase (Project Settings > Database > Backups), ou exportez manuellement via `pg_dump` / le SQL Editor.

### Monitoring

Vérifiez régulièrement :
- ✅ Tentatives de login échouées
- ✅ Logs d'erreur
- ✅ Usage du rate limiting
- ✅ Headers de sécurité (securityheaders.com)

### Mise à jour des dépendances

```bash
# Vérifier les mises à jour de sécurité
npm audit

# Corriger automatiquement
npm audit fix

# Mettre à jour les dépendances
npm update
```

## 🚨 En cas de problème

### Mot de passe oublié

1. Générer un nouveau hash :
```bash
npm run hash-password
```

2. Mettre à jour `.env.local` :
```env
ADMIN_PASSWORD_HASH=nouveau_hash
```

3. Redémarrer :
```bash
npm run dev
```

### Verrouillage après rate limiting

Attendre 15 minutes ou redémarrer l'application pour réinitialiser les compteurs.

### Session expirée

Les sessions expirent après 24h. Reconnectez-vous simplement.

## 📚 Ressources

- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [NextAuth.js](https://next-auth.js.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)

## 🎯 Checklist de sécurité

Avant de déployer en production :

- [ ] `NEXTAUTH_SECRET` généré et configuré
- [ ] `ADMIN_PASSWORD_HASH` généré (pas de mot de passe en clair)
- [ ] `.env.local` dans `.gitignore`
- [ ] HTTPS/SSL activé
- [ ] Headers de sécurité configurés
- [ ] Rate limiting activé
- [ ] Logs d'audit activés
- [ ] Build de production sans erreurs
- [ ] Test de connexion admin
- [ ] Vérification des headers (securityheaders.com)

---

**Besoin d'aide ?** Consultez la documentation ou créez une issue.
