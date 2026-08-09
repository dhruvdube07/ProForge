import React, { useRef, useState } from 'react';

/**
 * Renders a premium 6-digit OTP inputs row with automatic focus-management.
 */
export default function OTPInput({ length = 6, onChange }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return; // Allow numbers only

    const newOtp = [...otp];
    // Take only the last character if typed
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Call callback with current code
    const currentCode = newOtp.join('');
    onChange(currentCode);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        // If current value is empty, focus and clear the previous input
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = '';
      } else {
        // Clear current input value
        newOtp[index] = '';
      }
      setOtp(newOtp);
      onChange(newOtp.join(''));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return; // Allow numbers only

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < length) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus last filled input or the first one if empty
    const focusIdx = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {otp.map((char, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={char}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-xl font-bold rounded-theme border border-themeBorder bg-themeCard focus:border-themePrimary focus:ring-2 focus:ring-themePrimaryLight focus:outline-none transition-all duration-200 text-themeText"
        />
      ))}
    </div>
  );
}
