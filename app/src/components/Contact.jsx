import { useEffect, useRef, useState } from 'react';
import { site } from '../data.js';
import Section from './Section.jsx';

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
      <p className="fine">Sent through FormSubmit after a quick captcha. I'll see your email address so I know who asked.</p>
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

export default function Contact() {
  return (
    <Section id="contact" className="contact" label="Contact">
      <p className="prose">I'm looking for research positions and internships for summer 2027. Email is the best way to reach me.</p>
      <div className="email-line">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <CopyEmail />
      </div>
      <ResumeForm />
    </Section>
  );
}
