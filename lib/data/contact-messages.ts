import { getSupabaseClient } from '@/lib/supabase';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

interface ContactMessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  reply_message?: string | null;
  replied_at?: string | null;
  created_at: string;
}

function mapContactMessageRow(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status,
    replyMessage: row.reply_message ?? undefined,
    repliedAt: row.replied_at ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapContactMessageRow);
}

export async function createContactMessage(
  input: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
): Promise<ContactMessage> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .insert({
      name: input.name,
      email: input.email,
      message: input.message,
      status: 'new',
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapContactMessageRow(data);
}

export async function getContactMessageById(id: number): Promise<ContactMessage | undefined> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapContactMessageRow(data) : undefined;
}

export async function updateContactMessage(
  id: number,
  updates: Partial<ContactMessage>
): Promise<ContactMessage | null> {
  const { id: _id, ...rest } = updates;
  const patch: Record<string, unknown> = { ...rest };
  if ('replyMessage' in rest) {
    patch.reply_message = rest.replyMessage;
    delete patch.replyMessage;
  }
  if ('repliedAt' in rest) {
    patch.replied_at = rest.repliedAt;
    delete patch.repliedAt;
  }

  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? mapContactMessageRow(data) : null;
}
