'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Download, AlertCircle, CheckCircle } from 'lucide-react';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface TwoFactorStatus {
  enabled: boolean;
  enforced?: boolean;
  policyDisabled?: boolean;
  backupCodesCount: number;
}

interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export default function TwoFactorPage() {
  const router = useRouter();
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);

  // Charger le statut au montage
  useEffect(() => {
    void fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/admin/2fa/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Erreur chargement statut:', err);
    }
  }

  async function handleSetup() {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/2fa/setup', { method: 'POST' });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la génération du QR code');
      }
      
      const data = await res.json();
      setSetup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEnable() {
    if (!setup) return;
    
    setIsLoading(true);
    setError('');
    
    try {
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
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'activation');
      }
      
      setSuccess('2FA activé avec succès !');
      setSetup(null);
      setVerificationCode('');
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisable() {
    if (!confirm('Êtes-vous sûr de vouloir désactiver le 2FA ?')) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/2fa/disable', { method: 'POST' });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la désactivation');
      }
      
      setSuccess('2FA désactivé');
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegenerateBackupCodes() {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/2fa/backup-codes', { method: 'POST' });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la régénération');
      }
      
      const data = await res.json();
      setNewBackupCodes(data.backupCodes);
      setSuccess('Codes de secours régénérés');
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  }

  function downloadBackupCodes(codes: string[]) {
    const text = `Codes de secours 2FA - Portfolio Admin\nGénérés le: ${new Date().toLocaleString()}\n\n${codes.join('\n')}\n\n⚠️ Conservez ces codes en lieu sûr\n⚠️ Chaque code ne peut être utilisé qu'une seule fois`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminThemeSwitcher className="fixed top-4 right-4" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 admin-text-accent">
          <Shield className="w-6 h-6" />
          Authentification à Deux Facteurs (2FA)
        </h1>
        <p className="admin-text-muted mt-2">
          Renforcez la sécurité de votre compte avec Google Authenticator
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Statut actuel */}
      {status && !setup && (
        <div className="admin-card p-6 mb-6">
          {status.policyDisabled && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              <p className="font-medium">Mode bypass 2FA actif</p>
              <p className="mt-1">
                La 2FA est bien configurée, mais elle n&apos;est pas demandée à la connexion tant que la variable
                <span className="mx-1 rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[11px]">DISABLE_2FA=true</span>
                reste active.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Statut</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.enabled
                ? 'bg-green-500/15 text-green-400'
                : 'bg-white/10 admin-text-muted'
            }`}>
              {status.enabled
                ? status.policyDisabled
                  ? 'Activé (bypass)'
                  : 'Activé'
                : 'Désactivé'}
            </span>
          </div>

          {status.enabled ? (
            <div className="space-y-4">
              {status.policyDisabled ? (
                <p className="admin-text-muted">
                  Le 2FA est configuré sur votre compte, mais il n&apos;est pas exigé à la connexion en mode bypass.
                </p>
              ) : (
                <p className="admin-text-muted">
                  Le 2FA est activé sur votre compte. Un code à 6 chiffres est demandé à chaque connexion.
                </p>
              )}

              <div className="flex items-center gap-2 text-sm admin-text-muted">
                <Key className="w-4 h-4" />
                <span>{status.backupCodesCount} codes de secours restants</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRegenerateBackupCodes}
                  disabled={isLoading}
                  className="admin-btn-secondary px-4 py-2 disabled:opacity-50"
                >
                  Régénérer codes de secours
                </button>

                <button
                  onClick={handleDisable}
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
                Le 2FA n'est pas encore activé. Activez-le pour renforcer la sécurité de votre compte.
              </p>

              <button
                onClick={handleSetup}
                disabled={isLoading}
                className="admin-btn-primary px-6 py-2 disabled:opacity-50"
              >
                Activer le 2FA
              </button>
            </div>
          )}
        </div>
      )}

      {/* Configuration du 2FA */}
      {setup && (
        <div className="admin-card p-6 space-y-6">
          <h2 className="text-lg font-semibold">Configuration du 2FA</h2>

          {/* Étape 1: Scanner le QR code */}
          <div>
            <h3 className="font-medium mb-2">1. Scannez le QR code</h3>
            <p className="text-sm admin-text-muted mb-4">
              Utilisez Google Authenticator ou une application compatible pour scanner ce code :
            </p>
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <img src={setup.qrCode} alt="QR Code 2FA" className="w-64 h-64" />
            </div>
          </div>

          {/* Étape 2: Sauvegarder les codes de secours */}
          <div>
            <h3 className="font-medium mb-2">2. Sauvegardez vos codes de secours</h3>
            <p className="text-sm admin-text-muted mb-4">
              Ces codes vous permettront de vous connecter si vous perdez votre appareil :
            </p>
            <div className="bg-black/20 p-4 rounded-lg font-mono text-sm space-y-1">
              {setup.backupCodes.map((code, i) => (
                <div key={i}>{code}</div>
              ))}
            </div>
            <button
              onClick={() => downloadBackupCodes(setup.backupCodes)}
              className="admin-btn-secondary mt-3 px-4 py-2 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger les codes
            </button>
          </div>

          {/* Étape 3: Vérification */}
          <div>
            <h3 className="font-medium mb-2">3. Vérifiez avec un code</h3>
            <p className="text-sm admin-text-muted mb-4">
              Entrez le code à 6 chiffres affiché dans votre application :
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="admin-input flex-1 px-4 py-2 text-center text-2xl"
              />
              <button
                onClick={handleEnable}
                disabled={isLoading || verificationCode.length !== 6}
                className="admin-btn-primary px-6 py-2 disabled:opacity-50"
              >
                Activer
              </button>
            </div>
          </div>

          <button
            onClick={() => setSetup(null)}
            className="admin-text-muted hover:opacity-80"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Nouveaux codes de secours régénérés */}
      {newBackupCodes && (
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-4">Nouveaux codes de secours</h2>
          <p className="text-sm admin-text-muted mb-4">
            ⚠️ Les anciens codes ne fonctionnent plus. Sauvegardez ces nouveaux codes :
          </p>
          <div className="bg-black/20 p-4 rounded-lg font-mono text-sm space-y-1 mb-4">
            {newBackupCodes.map((code, i) => (
              <div key={i}>{code}</div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => downloadBackupCodes(newBackupCodes)}
              className="admin-btn-secondary px-4 py-2 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={() => setNewBackupCodes(null)}
              className="admin-btn-secondary px-4 py-2"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
