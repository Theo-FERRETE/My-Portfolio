'use client';

import { Key } from 'lucide-react';
import type { TwoFactorStatus } from './types';

interface TwoFactorStatusCardProps {
  status: TwoFactorStatus;
  isLoading: boolean;
  onSetup: () => void;
  onDisable: () => void;
  onRegenerateBackupCodes: () => void;
}

export default function TwoFactorStatusCard({
  status,
  isLoading,
  onSetup,
  onDisable,
  onRegenerateBackupCodes,
}: TwoFactorStatusCardProps) {
  const badgeLabel = status.enabled
    ? status.policyDisabled
      ? 'Activé (bypass)'
      : 'Activé'
    : 'Désactivé';

  return (
    <div className="admin-card p-6 mb-6">
      {status.policyDisabled && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          <p className="font-medium">Mode bypass 2FA actif</p>
          <p className="mt-1">
            La 2FA est bien configurée, mais elle n&apos;est pas demandée à la connexion tant que la
            variable
            <span className="mx-1 rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[11px]">
              DISABLE_2FA=true
            </span>
            reste active.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Statut</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status.enabled ? 'bg-green-500/15 text-green-400' : 'bg-white/10 admin-text-muted'
          }`}
        >
          {badgeLabel}
        </span>
      </div>

      {status.enabled ? (
        <div className="space-y-4">
          <p className="admin-text-muted">
            {status.policyDisabled
              ? "Le 2FA est configuré sur votre compte, mais il n'est pas exigé à la connexion en mode bypass."
              : 'Le 2FA est activé sur votre compte. Un code à 6 chiffres est demandé à chaque connexion.'}
          </p>

          <p className="flex items-center gap-2 text-sm admin-text-muted">
            <Key className="w-4 h-4" />
            <span>{status.backupCodesCount} codes de secours restants</span>
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onRegenerateBackupCodes}
              disabled={isLoading}
              className="admin-btn-secondary px-4 py-2 disabled:opacity-50"
            >
              Régénérer codes de secours
            </button>

            <button
              onClick={onDisable}
              disabled={isLoading}
              className="admin-btn-danger px-4 py-2 disabled:opacity-50"
            >
              Désactiver 2FA
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="admin-text-muted">
            Le 2FA n&apos;est pas encore activé. Activez-le pour renforcer la sécurité de votre
            compte.
          </p>

          <button
            onClick={onSetup}
            disabled={isLoading}
            className="admin-btn-primary px-6 py-2 disabled:opacity-50"
          >
            Activer le 2FA
          </button>
        </div>
      )}
    </div>
  );
}
