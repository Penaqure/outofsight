import { Container } from "@/components/ui/Container";

// Client logos are edited in the About admin; Home/Works take the block's
// heading/description from the Works admin — see lib/data/content.ts.
// Both variants render nothing until at least one logo has been added.

// Plain <img>: client logos have no fixed aspect ratio and render tiny, so
// next/image's required width/height and optimizer round-trip would cost
// more than they save. The seeded SVGs carry their own Figma width/height,
// so they render at design size; the max-* caps only rein in large uploads.
function Logo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className="max-h-8 w-auto max-w-16 object-contain grayscale sm:max-h-10 sm:max-w-24"
    />
  );
}

// Entrance used when `animated`: the whole block starts slightly lowered and
// transparent, then slowly settles once an ancestor <Reveal> sets
// data-shown. motion-safe only, so reduced-motion users get the content
// without the movement.
const enter =
  "transition duration-[1600ms] ease-out motion-safe:translate-y-3 motion-safe:opacity-0 group-data-shown:translate-y-0 group-data-shown:opacity-100";

// "Trusted International Clients" block on Home and Works (Figma v2):
// heading + short blurb on the left, a 7×2 logo grid on the right half.
// `animated` (Home) gently fades the block in — it must sit inside a
// <Reveal>.
export function TrustedBy({
  heading,
  description,
  logos,
  animated = false,
}: {
  heading: string;
  description: string;
  logos: string[];
  animated?: boolean;
}) {
  if (logos.length === 0) return null;

  return (
    <Container>
      <div
        className={`grid grid-cols-1 items-center gap-10 py-16 sm:grid-cols-2 sm:py-[126px] ${
          animated ? enter : ""
        }`}
      >
        <div>
          <h2 className="max-w-[467px] font-heading text-2xl tracking-tight text-obsidian uppercase">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 max-w-[530px] text-sm leading-[1.3] tracking-tight text-obsidian">
              {description}
            </p>
          )}
        </div>
        <ul className="grid grid-cols-4 opacity-50 sm:grid-cols-7">
          {logos.map((logo, index) => (
            <li
              key={index}
              className="flex h-20 items-center justify-center sm:h-32"
            >
              <Logo src={logo} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

// "Trusted By" strip on About (Figma v2): centred heading over a single
// row of logos that runs past both screen edges. The row is rendered twice
// back to back and scrolled by exactly one copy's width, so the loop is
// seamless; the second copy is hidden from assistive tech.
export function TrustedByMarquee({ logos }: { logos: string[] }) {
  if (logos.length === 0) return null;

  return (
    <section className="flex flex-col items-center gap-9 overflow-hidden py-16 sm:py-24">
      <h2 className="font-heading text-base font-semibold tracking-tight text-obsidian sm:text-2xl">
        Trusted By
      </h2>
      <div className="flex w-max animate-marquee opacity-50 hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex">
            {logos.map((logo, index) => (
              <li
                key={index}
                className="flex h-20 w-28 items-center justify-center sm:h-32 sm:w-[180px]"
              >
                <Logo src={logo} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
