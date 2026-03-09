/**
 * 🔒 Politique de sécurité des mots de passe
 * Validation stricte des mots de passe pour l'authentification admin
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

const MIN_LENGTH = 12;
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'passw0rd', 'shadow', '123123', '654321',
  'superman', 'qazwsx', 'michael', 'football', 'admin',
  'administrator', 'root', 'toor', 'pass', 'test',
];

/**
 * Valide la force d'un mot de passe selon les critères de sécurité
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // Vérification longueur minimale
  if (password.length < MIN_LENGTH) {
    errors.push(`Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères`);
  }

  // Vérification complexité
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!hasLowerCase) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!hasNumbers) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!hasSpecialChars) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  // Vérification mots de passe communs
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
    errors.push('Ce mot de passe est trop commun');
  }

  // Calcul du score de force
  if (errors.length === 0) {
    const score = 
      (password.length >= 16 ? 2 : password.length >= 12 ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChars ? 1 : 0);

    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Vérifie si un mot de passe respecte les exigences minimales
 * Lève une erreur si le mot de passe est invalide
 */
export function requireStrongPassword(password: string): void {
  const result = validatePasswordStrength(password);
  
  if (!result.isValid) {
    throw new Error(`Mot de passe invalide: ${result.errors.join(', ')}`);
  }
}
