import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-dvh flex items-center px-6">
      <div className="scanlines" aria-hidden />
      <div className="max-w-3xl mx-auto w-full">
        <span className="tag">ERR · 404</span>
        <h1
          className="glitch mt-8 font-display font-semibold text-chrome text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight"
          data-text="No route."
        >
          No route.
        </h1>
        <p className="mt-6 max-w-md text-chrome-dim leading-relaxed">
          This address doesn&apos;t resolve to anything on this node. The link may
          be old or mistyped.
        </p>
        <Link href="/" className="cta mt-10">
          <span className="cta-body notched">
            Back to the street
            <span className="cta-icon" aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9.5 6H2.5M2.5 6 5.5 3M2.5 6l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
              </svg>
            </span>
          </span>
        </Link>
      </div>
    </main>
  );
}
