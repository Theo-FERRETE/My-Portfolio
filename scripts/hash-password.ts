import * as readline from 'readline';
import { hashPassword } from '@/lib/password';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('🔐 Hash ton mot de passe\n');

rl.question('Entre ton mot de passe: ', async (password) => {
  if (!password || password.length < 8) {
    console.error('❌ Minimum 8 caractères');
    rl.close();
    process.exit(1);
  }

  try {
    const hash = await hashPassword(password);
    
    console.log('\n✅ Hash généré !\n');
    console.log('Copie ça dans ton .env.local:');
    console.log('─'.repeat(70));
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('─'.repeat(70));
    console.log('\n⚠️  Supprime ADMIN_PASSWORD de ton .env\n');
    
    rl.close();
  } catch (error) {
    console.error('❌ Erreur:', error);
    rl.close();
    process.exit(1);
  }
});
