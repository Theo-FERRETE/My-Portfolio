# 🔒 Sécurisation Portfolio - Guide Express

## ⚡ Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Développement Local
L'application fonctionne directement avec les valeurs par défaut :

```bash
npm run dev
```

**Login admin par défaut :**
- Email: `admin@portfolio.com`
- Password: Utiliser `npm run hash-password` pour créer votre propre mot de passe

⚠️ **IMPORTANT : Changez le mot de passe AVANT tout déploiement !**

## 🚀 Avant de Déployer sur OVH

### Étape 1 : Générer un secret sécurisé
```bash
npm run generate-secret
```
Copiez la valeur générée.

### Étape 2 : Hasher votre mot de passe
```bash
npm run hash-password
```
Entrez un **vrai** mot de passe fort, puis copiez le hash.

### Étape 3 : Configuration OVH
Dans le panel OVH, ajoutez ces variables d'environnement :

```env
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=<secret_généré_étape_1>
ADMIN_EMAIL=votre-email@domain.com
ADMIN_PASSWORD_HASH=<hash_généré_étape_2>
ENABLE_AUDIT_LOGS=true
```

⚠️ **N'utilisez JAMAIS `ADMIN_PASSWORD` en production !**

### Étape 4 : Build et Upload
```bash
npm run build
```

Uploadez tout le contenu sur OVH via FTP/SSH.

## 🛡️ Sécurité Incluse

✅ Hashage bcrypt des mots de passe  
✅ Rate limiting anti-bruteforce  
✅ Headers HTTP sécurisés  
✅ Logs d'audit complets  
✅ Validation Zod des données  
✅ Protection CSRF  
✅ Sessions JWT sécurisées  

## 📊 Interface Admin

- Dashboard: `/admin/dashboard`
- Projets: `/admin/projects`
- Compétences: `/admin/skills`
- Profil: `/admin/profile`
- Logs: `/admin/audit-logs`

## 📚 Documentation Complète

Voir [README_SECURITY.md](./README_SECURITY.md) pour tous les détails.

## ⚠️ IMPORTANT

**Avant de pousser sur GitHub :**
1. ✅ `.env.local` est dans `.gitignore`
2. ✅ Pas de secrets dans le code
3. ✅ Utilisez `.env.example` comme template

**En production :**
1. ✅ Toujours utiliser `ADMIN_PASSWORD_HASH`
2. ✅ Jamais de `ADMIN_PASSWORD`
3. ✅ HTTPS/SSL activé
4. ✅ Secrets uniques et forts

---

**Besoin d'aide ?** Consultez le [README_SECURITY.md](./README_SECURITY.md)
