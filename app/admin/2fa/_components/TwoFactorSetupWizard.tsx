'use client';

import BackupCodesList from './BackupCodesList';
import type { TwoFactorSetup } from './types';

interface TwoFactorSetupWizardProps {
  setup: TwoFactorSetup;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  isLoading: boolean;
  onEnable: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetupWizard({
  setup,
  verificationCode,
  onVerificationCodeChange,
  isLoading,
  onEnable,
  onCancel,
}: TwoFactorSetupWizardProps) {
  return (
    <div className="admin-card p-6 space-y-6">
      <h2 className="text-lg font-semibold">Configuration du 2FA</h2>

      <div>
        <h3 className="font-medium mb-2">1. Scannez le QR code</h3>
        <p className="text-sm admin-text-muted mb-4">
          Utilisez Google Authenticator ou une application compatible pour scanner ce code :
        </p>
        <div className="flex justify-center bg-white p-4 rounded-lg">
          {/* Data URI générée côté serveur : next/image n'a rien à optimiser ici. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setup.qrCode} alt="QR Code de configuration 2FA" className="w-64 h-64" />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">2. Sauvegardez vos codes de secours</h3>
        <p className="text-sm admin-text-muted mb-4">
          Ces codes vous permettront de vous connecter si vous perdez votre appareil :
        </p>
        <BackupCodesList codes={setup.backupCodes} />
      </div>

      <div>
        <h3 className="font-medium mb-2">3. Vérifiez avec un code</h3>
        <p className="text-sm admin-text-muted mb-4">
          Entrez le code à 6 chiffres affiché dans votre application :
        </p>
        <div className="flex gap-3">
          <label htmlFor="verification-code" className="sr-only">
            Code de vérification à 6 chiffres
          </label>
          <input
            id="verification-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={verificationCode}
            onChange={(e) => onVerificationCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="admin-input flex-1 px-4 py-2 text-center text-2xl"
          />
          <button
            onClick={onEnable}
            disabled={isLoading || verificationCode.length !== 6}
            className="admin-btn-primary px-6 py-2 disabled:opacity-50"
          >
            Activer
          </button>
        </div>
      </div>

      <button onClick={onCancel} className="admin-text-muted hover:opacity-80">
        Annuler
      </button>
    </div>
  );
}
