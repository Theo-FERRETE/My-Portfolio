const bcrypt = require('bcrypt');

// Mot de passe à hasher
const password = 'admin123';

console.log('\n🔐 Génération du hash bcrypt...\n');

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
  
  console.log('✅ Hash généré pour le mot de passe "admin123" :\n');
  console.log('─'.repeat(70));
  console.log('ADMIN_PASSWORD_HASH=' + hash);
  console.log('─'.repeat(70));
  console.log('\n📋 Copie cette ligne dans ton .env.local (ligne 20)\n');
  
  // Vérification
  bcrypt.compare(password, hash, (err, result) => {
    if (result) {
      console.log('✅ Vérification : le hash est VALIDE\n');
    }
  });
});
