'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { AdminGuard, AdminPageHeader } from '@/app/admin/_components';
import TwoFactorStatusCard from './_components/TwoFactorStatusCard';
import TwoFactorSetupWizard from './_components/TwoFactorSetupWizard';
import BackupCodesList from './_components/BackupCodesList';
import type { TwoFactorSetup, TwoFactorStatus } from './_components/types';

function TwoFactorScreen() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/2fa/status');
      if (res.ok) setStatus(await res.json());
    } catch (err) {
      console.error('Erreur chargement statut:', err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchStatus();
  }, [fetchStatus]);

  /** Enveloppe commune : bascule le chargement, remonte l'erreur, rafraîchit le statut. */
  const run = async (action: () => Promise<void>) => {
    setIsLoading(true);
    setError('');

    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = () =>
    run(async () => {
      const res = await fetch('/api/admin/2fa/setup', { method: 'POST' });
      if (!res.ok) throw new Error('Erreur lors de la génération du QR code');
      setSetup(await res.json());
    });

  const handleEnable = () =>
    run(async () => {
      if (!setup) return;

      const res = await fetch('/api/admin/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: setup.secret,
          backupCodes: setup.backupCodes,
          token: verificationCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'activation");

      setSuccess('2FA activé avec succès !');
      setSetup(null);
      setVerificationCode('');
      await fetchStatus();
    });

  const handleDisable = () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver le 2FA ?')) return;

    return run(async () => {
      const res = await fetch('/api/admin/2fa/disable', { method: 'POST' });
      if (!res.ok) throw new Error('Erreur lors de la désactivation');

      setSuccess('2FA désactivé');
      await fetchStatus();
    });
  };

  const handleRegenerateBackupCodes = () =>
    run(async () => {
      const res = await fetch('/api/admin/2fa/backup-codes', { method: 'POST' });
      if (!res.ok) throw new Error('Erreur lors de la régénération');

      const data = await res.json();
      setNewBackupCodes(data.backupCodes);
      setSuccess('Codes de secours régénérés');
      await fetchStatus();
    });

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title="Authentification à deux facteurs"
        subtitle="Renforcez la sécurité de votre compte avec Google Authenticator"
        backHref="/admin/dashboard"
      />

      <main className="p-6 max-w-4xl mx-auto">
        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2" role="alert">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2" role="status">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {success}
          </p>
        )}

        {status && !setup && (
          <TwoFactorStatusCard
            status={status}
            isLoading={isLoading}
            onSetup={handleSetup}
            onDisable={handleDisable}
            onRegenerateBackupCodes={handleRegenerateBackupCodes}
          />
        )}

        {setup && (
          <TwoFactorSetupWizard
            setup={setup}
            verificationCode={verificationCode}
            onVerificationCodeChange={setVerificationCode}
            isLoading={isLoading}
            onEnable={handleEnable}
            onCancel={() => setSetup(null)}
          />
        )}

        {newBackupCodes && (
          <div className="admin-card p-6">
            <h2 className="text-lg font-semibold mb-4">Nouveaux codes de secours</h2>
            <p className="text-sm admin-text-muted mb-4">
              ⚠️ Les anciens codes ne fonctionnent plus. Sauvegardez ces nouveaux codes :
            </p>
            <BackupCodesList codes={newBackupCodes} downloadLabel="Télécharger" />
            <button
              onClick={() => setNewBackupCodes(null)}
              className="admin-btn-secondary mt-3 ml-3 px-4 py-2"
            >
              Fermer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <AdminGuard loadingLabel="Chargement de la configuration 2FA...">
      <TwoFactorScreen />
    </AdminGuard>
  );
}
