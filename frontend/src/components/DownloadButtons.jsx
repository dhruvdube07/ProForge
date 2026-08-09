import React, { useState } from 'react';
import { FileText, Mail, Linkedin, ChevronDown, Check, Copy } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function DownloadButtons({ profile }) {
  const { generateResume, generateCoverLetter, generateSignature, generateLinkedIn } = useProfile();

  const [loadingType, setLoadingType] = useState(null); // 'resume', 'letter', 'sig', 'li'
  const [modalType, setModalType] = useState(null); // 'letter', 'sig', 'li'

  // Form states for cover letter
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');

  // Signature state
  const [signatureHtml, setSignatureHtml] = useState('');
  const [copiedSignature, setCopiedSignature] = useState(false);

  // LinkedIn bio state
  const [linkedinBio, setLinkedinBio] = useState('');
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);

  // Trigger Resume Download
  const handleResumeDownload = async () => {
    setLoadingType('resume');
    try {
      await generateResume(profile);
    } catch (err) {
      alert(`Error generating PDF Resume: ${err.message}`);
    } finally {
      setLoadingType(null);
    }
  };

  // Open Cover Letter modal
  const openLetterModal = () => {
    // Pre-populate default contents
    setJobTitle(profile.profession || '');
    setLetterContent(
      `I am writing to express my enthusiastic interest in the ${profile.profession || 'Target Role'} position. With a strong background in technology and a proven track record as a ${profile.profession || 'specialist'}, I am confident that I can bring high value to your team.\n\nOver the course of my career, I have developed strong skills in ${Array.isArray(profile.skills) ? profile.skills.slice(0, 3).join(', ') : 'my domain'}. One of my notable achievements includes: ${Array.isArray(profile.achievements) && profile.achievements.length > 0 ? profile.achievements[0] : 'delivering successful key milestones'}.\n\nThank you for your time and consideration. I look forward to discussing how my experience aligns with your business needs.`
    );
    setModalType('letter');
  };

  // Trigger Cover Letter Download
  const handleLetterDownload = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      alert('Please fill in both Company Name and Job Title.');
      return;
    }
    setLoadingType('letter');
    try {
      await generateCoverLetter(profile, companyName, jobTitle, letterContent);
      setModalType(null);
    } catch (err) {
      alert(`Error generating Cover Letter: ${err.message}`);
    } finally {
      setLoadingType(null);
    }
  };

  // Fetch and display Signature
  const handleSignatureLoad = async () => {
    setLoadingType('sig');
    try {
      const html = await generateSignature(profile);
      setSignatureHtml(html);
      setModalType('sig');
    } catch (err) {
      alert(`Failed to generate email signature: ${err.message}`);
    } finally {
      setLoadingType(null);
    }
  };

  // Copy HTML signature code
  const copySignatureCode = () => {
    navigator.clipboard.writeText(signatureHtml);
    setCopiedSignature(true);
    setTimeout(() => setCopiedSignature(false), 2000);
  };

  // Fetch and display LinkedIn bio
  const handleLinkedinLoad = async () => {
    setLoadingType('li');
    try {
      const text = await generateLinkedIn(profile);
      setLinkedinBio(text);
      setModalType('li');
    } catch (err) {
      alert(`Failed to generate AI LinkedIn bio: ${err.message}`);
    } finally {
      setLoadingType(null);
    }
  };

  // Copy LinkedIn bio to clipboard
  const copyLinkedinBio = () => {
    navigator.clipboard.writeText(linkedinBio);
    setCopiedLinkedin(true);
    setTimeout(() => setCopiedLinkedin(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-themeTextSecondary uppercase tracking-wider">
        Export Assets
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Generate Resume PDF */}
        <button
          onClick={handleResumeDownload}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-sm transition-all duration-300 hover-lift cursor-pointer disabled:opacity-50"
        >
          {loadingType === 'resume' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FileText className="h-5 w-5" />
          )}
          Download Resume
        </button>

        {/* Generate Cover Letter PDF */}
        <button
          onClick={openLetterModal}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-theme shadow-sm transition-all duration-300 hover-lift cursor-pointer disabled:opacity-50"
        >
          <FileText className="h-5 w-5" />
          Cover Letter
        </button>

        {/* Generate Email Signature */}
        <button
          onClick={handleSignatureLoad}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-theme shadow-sm transition-all duration-300 hover-lift cursor-pointer disabled:opacity-50"
        >
          {loadingType === 'sig' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Mail className="h-5 w-5" />
          )}
          Email Signature
        </button>

        {/* Generate LinkedIn Bio */}
        <button
          onClick={handleLinkedinLoad}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-theme shadow-sm transition-all duration-300 hover-lift cursor-pointer disabled:opacity-50"
        >
          {loadingType === 'li' ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Linkedin className="h-5 w-5" />
          )}
          LinkedIn Bio
        </button>
      </div>

      {/* OVERLAY MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
          <div className="bg-themeCard border border-themeBorder rounded-theme w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-themeBorder pb-3">
              <h3 className="text-lg font-bold text-themeText flex items-center gap-2">
                {modalType === 'letter' && 'Generate PDF Cover Letter'}
                {modalType === 'sig' && 'Your Email HTML Signature'}
                {modalType === 'li' && 'AI LinkedIn Bio'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-full hover:bg-themeBg text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            {modalType === 'letter' && (
              <div className="space-y-4 text-themeText">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-themeTextSecondary mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google India"
                      className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-themeTextSecondary mb-1">Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Product Developer"
                      className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-themeTextSecondary mb-1">Letter Content Body</label>
                  <textarea
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    rows={8}
                    className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-sm font-sans"
                  />
                </div>
                <button
                  onClick={handleLetterDownload}
                  disabled={loadingType === 'letter'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow cursor-pointer disabled:opacity-50"
                >
                  {loadingType === 'letter' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Download Cover Letter PDF'
                  )}
                </button>
              </div>
            )}

            {modalType === 'sig' && (
              <div className="space-y-4 text-themeText">
                <p className="text-xs text-themeTextSecondary">
                  Here is a preview of your brand signature. Click copy to copy the raw HTML block to embed in your Gmail/Outlook signature settings.
                </p>

                {/* Render Signature Preview */}
                <div className="p-4 bg-white rounded-theme border border-themeBorder flex justify-center">
                  <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
                </div>

                {/* Raw HTML Pre */}
                <div>
                  <label className="block text-xs font-semibold text-themeTextSecondary mb-1">Raw HTML Signature Code</label>
                  <textarea
                    readOnly
                    value={signatureHtml}
                    rows={4}
                    className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg text-xxs font-mono focus:outline-none cursor-text select-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copySignatureCode}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow cursor-pointer"
                  >
                    {copiedSignature ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
                    {copiedSignature ? 'Copied HTML!' : 'Copy Raw HTML Code'}
                  </button>
                  <button
                    onClick={() => setModalType(null)}
                    className="py-2.5 px-4 bg-themeBg hover:bg-themeBorder text-themeText font-semibold rounded-theme border border-themeBorder cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {modalType === 'li' && (
              <div className="space-y-4 text-themeText">
                <p className="text-xs text-themeTextSecondary">
                  This LinkedIn "About" section is tailored by Groq AI based on your bio description, skills, values, and accomplishments.
                </p>

                <textarea
                  readOnly
                  value={linkedinBio}
                  rows={10}
                  className="w-full p-4 rounded-theme border border-themeBorder bg-themeBg text-sm font-sans leading-relaxed focus:outline-none select-all cursor-text"
                />

                <div className="flex gap-3">
                  <button
                    onClick={copyLinkedinBio}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow cursor-pointer"
                  >
                    {copiedLinkedin ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
                    {copiedLinkedin ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                  </button>
                  <button
                    onClick={() => setModalType(null)}
                    className="py-2.5 px-4 bg-themeBg hover:bg-themeBorder text-themeText font-semibold rounded-theme border border-themeBorder cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// Add simple SVG X component inside or import it
function X(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
