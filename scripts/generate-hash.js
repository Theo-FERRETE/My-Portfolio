const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.log('\n🔐 Génération du hash bcrypt...\n');
console.log('⚠️  ATTENTION : N\'entrez JAMAIS un mot de passe faible en production !\n');

rl.question('Entre ton mot de passe (min. 8 caractères): ', (password) => {
  if (!password || password.length < 8) {
    console.error('\n❌ Erreur : Le mot de passe doit contenir au moins 8 caractères\n');
    rl.close();
    process.exit(1);
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('❌ Erreur:', err);
      rl.close();
      process.exit(1);
    }
    
    console.log('\n✅ Hash généré avec succès !\n');
    console.log('─'.repeat(70));
    console.log('ADMIN_PASSWORD_HASH=' + hash);
    console.log('─'.repeat(70));
    console.log('\n📋 Copie cette ligne dans ton .env.local\n');
    
    // Vérification
    bcrypt.compare(password, hash, (err, result) => {
      if (result) {
        console.log('✅ Vérification : le hash est VALIDE\n');
      }
      rl.close();
    });
  });
});
