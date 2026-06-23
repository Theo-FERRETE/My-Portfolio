/**
 * Script à usage unique : importe les data/*.json existants dans Supabase.
 * Ne pas relancer après le premier run (pas idempotent, dupliquerait les lignes).
 */
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabase';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJson<T>(file: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function migrateProjects() {
  const projects = readJson<any[]>('projects.json', []);
  if (!projects.length) return console.log('projects: rien à migrer');

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('projects').insert(
    projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image ?? '',
      tags: p.tags ?? [],
      link: p.link ?? '',
      github: p.github ?? '',
      featured: !!p.featured,
      created_at: p.createdAt,
    }))
  );
  if (error) throw error;

  const { error: seqError } = await supabase.rpc('setval_projects_id_seq');
  if (seqError) console.warn('⚠️  Impossible de resynchroniser la séquence projects.id:', seqError.message);

  console.log(`projects: ${projects.length} ligne(s) migrée(s)`);
}

async function migrateSkills() {
  const skills = readJson<any[]>('skills.json', []);
  if (!skills.length) return console.log('skills: rien à migrer');

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('skills').insert(
    skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      icon: s.icon,
      description: s.description ?? null,
      order: s.order ?? 0,
    }))
  );
  if (error) throw error;

  const { error: seqError } = await supabase.rpc('setval_skills_id_seq');
  if (seqError) console.warn('⚠️  Impossible de resynchroniser la séquence skills.id:', seqError.message);

  console.log(`skills: ${skills.length} ligne(s) migrée(s)`);
}

async function migrateProfile() {
  const profile = readJson<any | null>('profile.json', null);
  if (!profile) return console.log('profile: rien à migrer');

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('profile').upsert({
    id: true,
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    github: profile.github ?? '',
    linkedin: profile.linkedin ?? '',
    twitter: profile.twitter ?? '',
    updated_at: profile.updatedAt ?? new Date().toISOString(),
  });
  if (error) throw error;

  console.log('profile: migré');
}

async function migrateContactMessages() {
  const messages = readJson<any[]>('contact-messages.json', []);
  if (!messages.length) return console.log('contact_messages: rien à migrer');

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('contact_messages').insert(
    messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      message: m.message,
      status: m.status ?? 'new',
      reply_message: m.replyMessage ?? null,
      replied_at: m.repliedAt ?? null,
      created_at: m.createdAt,
    }))
  );
  if (error) throw error;

  console.log(`contact_messages: ${messages.length} ligne(s) migrée(s)`);
}

async function migrateAdminAuth() {
  const stored = readJson<{ adminPasswordHash?: string; updatedAt?: string } | null>(
    'admin-auth.json',
    null
  );
  if (!stored?.adminPasswordHash) return console.log('admin_auth: rien à migrer');

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('admin_auth').upsert({
    id: true,
    admin_password_hash: stored.adminPasswordHash,
    updated_at: stored.updatedAt ?? new Date().toISOString(),
  });
  if (error) throw error;

  console.log('admin_auth: migré');
}

async function migrateTwoFactor() {
  const allData = readJson<Record<string, any>>('2fa.json', {});
  const emails = Object.keys(allData);
  if (!emails.length) return console.log('two_factor: rien à migrer');

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('two_factor').insert(
    emails.map((email) => ({
      email,
      enabled: !!allData[email].enabled,
      secret: allData[email].secret ?? null,
      backup_codes: allData[email].backupCodes ?? null,
      enabled_at: allData[email].enabledAt ?? null,
    }))
  );
  if (error) throw error;

  console.log(`two_factor: ${emails.length} ligne(s) migrée(s)`);
}

async function main() {
  await migrateProjects();
  await migrateSkills();
  await migrateProfile();
  await migrateContactMessages();
  await migrateAdminAuth();
  await migrateTwoFactor();
}

main()
  .then(() => {
    console.log('\n✅ Migration terminée.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Migration échouée:', err);
    process.exit(1);
  });
