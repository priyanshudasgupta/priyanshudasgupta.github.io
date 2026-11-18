// Links to other sites open in a new tab; links to files on this site do too.
export default function ExternalLink({ href, children, ...rest }) {
  return <a href={href} target="_blank" rel="noopener" {...rest}>{children}</a>;
}
