export const languages = {
  en: 'English',
  fr: 'Français',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'blog.readMore': 'Read more',
    'blog.readingTime': 'min read',
    'blog.publishedOn': 'Published on',
    'blog.updatedOn': 'Updated on',
    'blog.backToBlog': '← Back to blog',
    'footer.poweredBy': 'Powered by Astro',
    'meta.description': 'A blog about AI and Machine Learning',
    'home.title': 'AI & Machine Learning Blog',
    'home.subtitle': 'Exploring the future of artificial intelligence',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.blog': 'Blog',
    'nav.about': 'À propos',
    'blog.readMore': 'Lire la suite',
    'blog.readingTime': 'min de lecture',
    'blog.publishedOn': 'Publié le',
    'blog.updatedOn': 'Mis à jour le',
    'blog.backToBlog': '← Retour au blog',
    'footer.poweredBy': 'Propulsé par Astro',
    'meta.description': 'Un blog sur l\'IA et l\'apprentissage automatique',
    'home.title': 'Blog IA & Apprentissage Automatique',
    'home.subtitle': 'Explorer l\'avenir de l\'intelligence artificielle',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}