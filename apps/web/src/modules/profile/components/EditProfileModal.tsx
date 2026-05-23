import { useState } from 'react';
import { faculties, majors, programLevels, type PublicUser } from '@swap/types';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';
import UserAvatar from '@swap-web/common/components/UserAvatar';
import { useUpdateProfile } from '../hooks/useProfile';

const YEAR_OPTIONS_BY_LEVEL: Record<string, number[]> = {
  Undergraduate: [1, 2, 3, 4, 5, 6],
  Postgraduate: [1, 2, 3],
  Diploma: [1, 2, 3],
};

const MicrosoftLogo = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0 }}>
    <rect x="1.5" y="1.5" width="9" height="9" fill="#F25022" />
    <rect x="13.5" y="1.5" width="9" height="9" fill="#7FBA00" />
    <rect x="1.5" y="13.5" width="9" height="9" fill="#00A4EF" />
    <rect x="13.5" y="13.5" width="9" height="9" fill="#FFB900" />
  </svg>
);

function LockedRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, color: 'var(--od-text-tertiary)', fontWeight: 500 }}>{label}</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 10px',
          background: 'var(--od-surface-alt)',
          border: '1px solid var(--od-border)',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: 12.5,
            color: 'var(--od-text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: 'var(--od-text-tertiary)', flexShrink: 0 }}
        >
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

interface EditProfileModalProps {
  user: PublicUser;
  onClose: () => void;
}

export default function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const { user: sessionUser } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [displayName, setDisplayName] = useState(user.fullName);
  const [programLevel, setProgramLevel] = useState(user.programLevel ?? '');
  const [year, setYear] = useState<number | ''>(user.year ?? '');
  const [faculty, setFaculty] = useState(user.faculty ?? '');
  const [major, setMajor] = useState(user.major ?? '');
  const [bio, setBio] = useState(user.bio ?? '');

  const yearOptions = YEAR_OPTIONS_BY_LEVEL[programLevel] ?? [];

  const handleSave = () => {
    updateProfile(
      {
        displayName: displayName || undefined,
        programLevel: programLevel || undefined,
        year: year !== '' ? Number(year) : undefined,
        faculty: faculty || undefined,
        major: major || undefined,
        bio: bio || undefined,
      },
      { onSuccess: onClose },
    );
  };

  const handleOverlayClick = () => {
    if (!isPending) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,17,21,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 50,
        animation: 'overlayIn 160ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(580px, calc(100vw - 48px))',
          background: '#fff',
          borderRadius: 10,
          boxShadow: 'var(--od-shadow-modal)',
          maxHeight: 'calc(100vh - 48px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 160ms cubic-bezier(.2,.7,.2,1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Edit Profile</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--od-text-secondary)',
              marginTop: -4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f1f1')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          className="edit-grid no-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: 28,
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <UserAvatar user={user} size={112} />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <LockedRow label="Email" value={sessionUser?.email ?? ''} />
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--od-text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <MicrosoftLogo /> From your university account
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Display name">
              <TextInput value={displayName} onChange={setDisplayName} placeholder="Your name" />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Program Level">
                <SelectInput
                  value={programLevel}
                  onChange={(v) => {
                    setProgramLevel(v);
                    setYear('');
                  }}
                  options={programLevels.map((l) => ({ value: l, label: l }))}
                  placeholder="Select"
                />
              </FormField>
              <FormField label="Year">
                <SelectInput
                  value={year !== '' ? String(year) : ''}
                  onChange={(v) => setYear(v ? Number(v) : '')}
                  options={yearOptions.map((y) => ({ value: String(y), label: `Year ${y}` }))}
                  placeholder={programLevel ? 'Select' : 'Pick level first'}
                  disabled={!programLevel || yearOptions.length === 0}
                />
              </FormField>
            </div>

            <FormField label="Faculty">
              <SelectInput
                value={faculty}
                onChange={setFaculty}
                options={faculties.map((f) => ({ value: f, label: f }))}
                placeholder="Select"
              />
            </FormField>

            <FormField label="Major">
              <SelectInput
                value={major}
                onChange={setMajor}
                options={majors.map((m) => ({ value: m, label: m }))}
                placeholder={faculty ? 'Select your major' : 'Pick a faculty first'}
                disabled={!faculty}
              />
            </FormField>

            <FormField label="Bio" hint={`${bio.length}/200`} optional>
              <TextArea
                value={bio}
                onChange={(v) => setBio(v.slice(0, 200))}
                placeholder="A short note buyers see on your profile…"
              />
            </FormField>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px 20px',
            borderTop: '1px solid var(--od-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            disabled={isPending}
            style={{
              height: 44,
              padding: '0 16px',
              borderRadius: 6,
              background: 'transparent',
              color: 'var(--od-text)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f1f1')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            style={{
              height: 44,
              padding: '0 18px',
              borderRadius: 6,
              background: isPending ? 'var(--od-primary-disabled)' : 'var(--od-primary)',
              color: '#fff',
              border: 'none',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'inherit',
              transition: 'background 120ms ease',
            }}
          >
            {isPending ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    display: 'inline-block',
                    animation: 'spin 700ms linear infinite',
                  }}
                />
                Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--od-text)' }}>
          {label}
          {optional && (
            <span style={{ fontWeight: 400, color: 'var(--od-text-tertiary)', marginLeft: 4 }}>(optional)</span>
          )}
        </label>
        {hint && <span style={{ fontSize: 12, color: 'var(--od-text-tertiary)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        height: 46,
        padding: '0 12px',
        borderRadius: 6,
        border: `1.5px solid ${focused ? 'var(--od-primary)' : 'var(--od-border)'}`,
        boxShadow: focused ? '0 0 0 4px var(--od-primary-tint)' : 'none',
        fontSize: 14,
        color: 'var(--od-text)',
        background: '#fff',
        fontFamily: 'inherit',
        transition: 'all 120ms ease',
        width: '100%',
        outline: 'none',
      }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        height: 46,
        padding: '0 36px 0 12px',
        borderRadius: 6,
        border: `1.5px solid ${focused ? 'var(--od-primary)' : 'var(--od-border)'}`,
        boxShadow: focused ? '0 0 0 4px var(--od-primary-tint)' : 'none',
        fontSize: 14,
        color: value ? 'var(--od-text)' : 'var(--od-text-tertiary)',
        background: disabled
          ? 'var(--od-surface-alt)'
          : `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%239a9a9a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center`,
        fontFamily: 'inherit',
        transition: 'all 120ms ease',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        appearance: 'none',
        outline: 'none',
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: '10px 12px',
        borderRadius: 6,
        border: `1.5px solid ${focused ? 'var(--od-primary)' : 'var(--od-border)'}`,
        boxShadow: focused ? '0 0 0 4px var(--od-primary-tint)' : 'none',
        fontSize: 14,
        color: 'var(--od-text)',
        background: '#fff',
        fontFamily: 'inherit',
        transition: 'all 120ms ease',
        width: '100%',
        resize: 'none',
        lineHeight: 1.5,
        outline: 'none',
      }}
    />
  );
}
