import { generateSecret } from '@/lib/auth';

console.log('🔐 Générateur de secret\n');

const secret = generateSecret(32);

console.log('✅ Secret généré !\n');
console.log('Copie ça dans ton .env.local:');
console.log('─'.repeat(70));
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('─'.repeat(70));
console.log('\n⚠️  Garde-le secret !\n');
