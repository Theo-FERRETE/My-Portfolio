'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Download, AlertCircle, CheckCircle } from 'lucide-react';

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Authentification à Deux Facteurs (2FA)
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Renforcez la sécurité de votre compte avec Google Authenticator
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Statut actuel */}
      {status && !setup && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          {status.policyDisabled && (
            <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              Le 2FA est desactive globalement via `DISABLE_2FA=true`. Vous pouvez le configurer ici puis remettre `DISABLE_2FA=false` pour l'activer a la connexion.
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Statut</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.enabled
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              {status.enabled
                ? status.policyDisabled
                  ? 'Active (bypassee)'
                  : 'Active'
                : 'Desactive'}
            </span>
          </div>

          {status.enabled ? (
            <div className="space-y-4">
              {status.policyDisabled ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Le 2FA est bien configure sur votre compte, mais il n&apos;est pas exige a la connexion tant que `DISABLE_2FA=true`.
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Le 2FA est active sur votre compte. Vous devez entrer un code a 6 chiffres a chaque connexion.
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Key className="w-4 h-4" />
                <span>{status.backupCodesCount} codes de secours restants</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRegenerateBackupCodes}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Régénérer codes de secours
                </button>
                
                <button
                  onClick={handleDisable}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Désactiver 2FA
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Le 2FA n'est pas encore activé. Activez-le pour renforcer la sécurité de votre compte.
              </p>
              
              <button
                onClick={handleSetup}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50font-medium"
              >
                Activer le 2FA
              </button>
            </div>
          )}
        </div>
      )}

      {/* Configuration du 2FA */}
      {setup && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <h2 className="text-lg font-semibold">Configuration du 2FA</h2>

          {/* Étape 1: Scanner le QR code */}
          <div>
            <h3 className="font-medium mb-2">1. Scannez le QR code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Utilisez Google Authenticator ou une application compatible pour scanner ce code :
            </p>
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <img src={setup.qrCode} alt="QR Code 2FA" className="w-64 h-64" />
            </div>
          </div>

          {/* Étape 2: Sauvegarder les codes de secours */}
          <div>
            <h3 className="font-medium mb-2">2. Sauvegardez vos codes de secours</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Ces codes vous permettront de vous connecter si vous perdez votre appareil :
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-1">
              {setup.backupCodes.map((code, i) => (
                <div key={i}>{code}</div>
              ))}
            </div>
            <button
              onClick={() => downloadBackupCodes(setup.backupCodes)}
              className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger les codes
            </button>
          </div>

          {/* Étape 3: Vérification */}
          <div>
            <h3 className="font-medium mb-2">3. Vérifiez avec un code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Entrez le code à 6 chiffres affiché dans votre application :
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center text-2xl font-mono"
              />
              <button
                onClick={handleEnable}
                disabled={isLoading || verificationCode.length !== 6}
                className="px-6 py2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Activer
              </button>
            </div>
          </div>

          <button
            onClick={() => setSetup(null)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Nouveaux codes de secours régénérés */}
      {newBackupCodes && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Nouveaux codes de secours</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            ⚠️ Les anciens codes ne fonctionnent plus. Sauvegardez ces nouveaux codes :
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-1 mb-4">
            {newBackupCodes.map((code, i) => (
              <div key={i}>{code}</div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => downloadBackupCodes(newBackupCodes)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={() => setNewBackupCodes(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
