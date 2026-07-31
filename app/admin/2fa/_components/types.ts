export interface TwoFactorStatus {
  enabled: boolean;
  enforced?: boolean;
  policyDisabled?: boolean;
  backupCodesCount: number;
}

export interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

/** Télécharge les codes de secours dans un fichier texte. */
export function downloadBackupCodes(codes: string[]) {
  const text = `Codes de secours 2FA - Portfolio Admin\nGénérés le: ${new Date().toLocaleString()}\n\n${codes.join('\n')}\n\n⚠️ Conservez ces codes en lieu sûr\n⚠️ Chaque code ne peut être utilisé qu'une seule fois`;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-codes-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
