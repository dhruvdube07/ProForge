import React from 'react';

/**
 * Validates and displays password complexity strength.
 * - Easy: 6+ characters (Red)
 * - Moderate: 8+ characters, letters + numbers (Yellow)
 * - Hard: 10+ characters, letters + numbers + special characters (Green)
 */
export default function PasswordStrength({ password }) {
  if (!password) return null;

  const checkStrength = (pwd) => {
    if (pwd.length < 6) {
      return { score: 0, label: 'Too Short (Min 6 chars)', color: 'bg-red-600', textClass: 'text-red-500' };
    }

    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    if (pwd.length >= 10 && hasLetters && hasNumbers && hasSpecial) {
      return { score: 3, label: 'Hard Strength', color: 'bg-emerald-500', textClass: 'text-emerald-400' };
    } else if (pwd.length >= 8 && hasLetters && hasNumbers) {
      return { score: 2, label: 'Moderate Strength', color: 'bg-amber-500', textClass: 'text-amber-400' };
    } else {
      return { score: 1, label: 'Easy Strength', color: 'bg-red-500', textClass: 'text-red-400' };
    }
  };

  const strength = checkStrength(password);

  return (
    <div className="space-y-2 mt-1">
      <div className="flex justify-between items-center text-xxs font-semibold">
        <span className="text-themeTextSecondary">Password Strength:</span>
        <span className={`${strength.textClass} font-bold transition-all duration-300`}>
          {strength.label}
        </span>
      </div>
      
      {/* 3-Bar Strength Indicator */}
      <div className="flex gap-1.5 h-1.5 w-full bg-themeBorder/35 rounded-full overflow-hidden">
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            strength.score >= 1 ? strength.color : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            strength.score >= 2 ? strength.color : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            strength.score >= 3 ? strength.color : 'bg-transparent'
          }`}
        />
      </div>

      {/* Helper Bullet Points */}
      <div className="text-[10px] text-themeTextSecondary leading-normal pl-1 space-y-0.5">
        <div className={password.length >= 6 ? 'text-emerald-400 font-medium' : ''}>
          • Minimum 6 characters (Required)
        </div>
        <div className={(password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)) ? 'text-emerald-400 font-medium' : ''}>
          • Moderate: 8+ characters with letters & numbers
        </div>
        <div className={(password.length >= 10 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) ? 'text-emerald-400 font-medium' : ''}>
          • Hard: 10+ characters with letters, numbers & symbols
        </div>
      </div>
    </div>
  );
}
