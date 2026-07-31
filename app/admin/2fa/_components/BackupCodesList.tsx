'use client';

import { Download } from 'lucide-react';
import { downloadBackupCodes } from './types';

/** Liste de codes de secours + bouton de téléchargement. */
export default function BackupCodesList({
  codes,
  downloadLabel = 'Télécharger les codes',
}: {
  codes: string[];
  downloadLabel?: string;
}) {
  return (
    <>
      <ul className="bg-black/20 p-4 rounded-lg font-mono text-sm space-y-1">
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <button
        onClick={() => downloadBackupCodes(codes)}
        className="admin-btn-secondary mt-3 px-4 py-2 flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {downloadLabel}
      </button>
    </>
  );
}
