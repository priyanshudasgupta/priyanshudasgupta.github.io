import { useEffect, useRef, useState } from 'react';
import { site } from '../data.js';
import Section from './Section.jsx';
import ExternalLink from './ExternalLink.jsx';

// Résumé request: a plain form POST to FormSubmit, which emails the visitor a
// download link (autoresponse) and sends the request to my inbox. FormSubmit
// redirects back with ?resume=sent, which swaps the form for a thank-you note.
function ResumeForm() {
  const [sent, setSent] = useState(false);
  useEffect(() => { setSent(/[?&]resume=sent/.test(window.location.search)); }, []);

  if (sent) {
    return <p className="resume-sent">Thanks! Check your inbox for a link to my résumé.</p>;
  }
  return (
    <form className="resume-form" action={`https://formsubmit.co/${site.email}`} method="POST">
      <label htmlFor="resume-email">Want my résumé? Enter your email and I'll send it to you.</label>
      <div className="resume-row">
        <input id="resume-email" type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
        <button type="submit">Email me the résumé</button>
      </div>
      <input type="hidden" name="_subject" value="Résumé request from your website" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={`${site.url}/?resume=sent#contact`} />
      <input
        type="hidden"
        name="_autoresponse"
        value={`Thanks for your interest! You can download my résumé here: ${site.url}/${site.resumePath}  Best, ${site.name}`}
      />
      <div className="hp" aria-hidden="true">
        <label>Leave this empty <input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <p className="fine ui">Sent through FormSubmit after a quick captcha. I'll see your email address so I know who asked.</p>
    </form>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    const fallback = () => { window.location.href = `mailto:${site.email}`; };
    if (!navigator.clipboard?.writeText) return fallback();
    navigator.clipboard.writeText(site.email).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    }, fallback);
  };
  return <button className="copy-btn" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy email'}</button>;
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Contact() {
  return (
    <Section id="contact" className="contact" label="Contact" title="Get in touch.">
      <p className="prose">I'm looking for research positions and internships for summer 2027. Email is the best way to reach me.</p>
      <ResumeForm />
      <div className="email-line">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <CopyEmail />
      </div>
      <ul className="links">
        <li><ExternalLink href={site.linkedin}><LinkedInIcon />LinkedIn</ExternalLink></li>
        <li><ExternalLink href={site.github}><GitHubIcon />GitHub</ExternalLink></li>
      </ul>
    </Section>
  );
}
