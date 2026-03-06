Bienvenue sur mon Portfolio

## 📦 Installation et Lancement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Compiler pour la production
npm run build

# Lancer la version production
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎨 Personnalisation

### 1. Informations personnelles

Modifier les fichiers dans `app/components/` :

#### **Hero.tsx**
```tsx
<h1>Votre Nom</h1>
<h2>Votre Titre</h2>
<p>Votre description...</p>
```

#### **About.tsx**
Personnaliser votre présentation et vos points forts.

#### **Skills.tsx**
Modifier le tableau `skills` :
```tsx
const skills = [
  { name: 'Votre Techno', level: 90, icon: '🚀', color: 'from-blue-500 to-cyan-500' },
  // ...
];
```

#### **Projects.tsx**
Modifier le tableau `projects` :
```tsx
const projects = [
  {
    title: 'Nom du Projet',
    description: 'Description...',
    image: '🎨', // Emoji ou chemin vers image
    tags: ['Tech1', 'Tech2'],
    gradient: 'from-purple-500 to-pink-500',
    link: 'https://votre-projet.com',
  },
  // ...
];
```

#### **Contact.tsx**
Modifier les liens sociaux :
```tsx
const socialLinks = [
  { name: 'GitHub', icon: '💻', url: 'https://github.com/votre-username', color: 'hover:text-gray-700' },
  // ...
];
```

### 2. Couleurs et Thème

Les couleurs principales sont définies avec des classes Tailwind :
- **Gradient principal** : `from-purple-600 to-pink-600`
- **Fond clair** : Nuances de blanc et gris
- **Fond sombre** : Nuances de noir et gris foncé

Pour changer le thème, modifier les gradients dans les composants :
```tsx
className="bg-gradient-to-r from-votre-couleur to-votre-couleur"
```

### 3. Métadonnées SEO

Modifier `app/layout.tsx` :
```tsx
export const metadata: Metadata = {
  title: "Votre Nom - Votre Titre",
  description: "Votre description...",
  keywords: ["vos", "mots", "clés"],
  // ...
};
```

## 🎯 Structure du Projet

```
portfolio/
├── app/
│   ├── components/
│   │   ├── Header.tsx      # Navigation fixe
│   │   ├── Hero.tsx        # Section d'accueil
│   │   ├── About.tsx       # À propos
│   │   ├── Skills.tsx      # Compétences
│   │   ├── Projects.tsx    # Projets
│   │   ├── Contact.tsx     # Contact
│   │   └── Footer.tsx      # Footer
│   ├── globals.css         # Styles globaux et animations
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Page d'accueil
├── public/                 # Fichiers statiques
└── package.json
```

## 🛠️ Technologies Utilisées

- **Next.js 16** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - JavaScript typé
- **Tailwind CSS 4** - Framework CSS utility-first
- **Geist Font** - Typographie moderne

## 📱 Features Avancées

### Animations
- Fade in au scroll
- Slide animations
- Effet shimmer sur les compétences
- Particules suivant la souris
- Bounce animations

### Interactions
- Navigation smooth scroll
- Détection de la section active
- Formulaire de contact
- Hover effects sur tous les éléments interactifs

### Performance
- Intersection Observer pour animations au scroll
- Composants client optimisés
- Images et polices optimisées

## 🎨 Palette de Couleurs

- **Purple** : `#9333ea` (purple-600)
- **Pink** : `#ec4899` (pink-600)
- **Blue** : `#3b82f6` (blue-600)
- **Gradients** : Combinaisons harmonieuses de ces couleurs

## 📄 License

Ce projet est libre d'utilisation pour votre portfolio personnel.

## 🤝 Support

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à me contacter !

---

**Fait avec ❤️ et React**
