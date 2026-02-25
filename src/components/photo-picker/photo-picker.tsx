'use client';

import { useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

type PhotoPickerProps = {
  previewUrl: string | null;
  onPick: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
};

export function PhotoPicker({
  previewUrl,
  onPick,
  onClear,
  disabled,
}: PhotoPickerProps) {
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  function handleFile(file?: File) {
    if (!file) return;

    // validação mínima: 5MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('A foto deve ter no máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem válida.');
      return;
    }

    onPick(file);
  }

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-border-primary bg-background-secondary">
          <img
            src={previewUrl}
            alt="Prévia"
            className="h-64 w-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white"
            disabled={disabled}
            aria-label="Remover foto"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border-divisor bg-background-tertiary p-4">
          <p className="text-paragraph-small text-content-secondary">
            Adicione uma foto do casamento (opcional).
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="btn-olive w-full flex items-center justify-center gap-2"
          onClick={() => cameraRef.current?.click()}
          disabled={disabled}
        >
          <Camera size={18} />
          Tirar foto
        </button>

        <button
          type="button"
          className="btn-olive w-full flex items-center justify-center gap-2"
          onClick={() => galleryRef.current?.click()}
          disabled={disabled}
        >
          <ImageIcon size={18} />
          Galeria
        </button>
      </div>

      {/* câmera */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* galeria */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
