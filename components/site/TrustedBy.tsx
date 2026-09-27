import { Container } from "@/components/ui/Container";

// "Trusted By" block on the Works page: heading + short blurb on the left,
// a static client-logo grid on the right (same half/half split as the
// "For Moments That Stay" row below it). Logos are edited in the About
// admin, heading/description in the Works admin — see lib/data/content.ts.
// Renders nothing until at least one logo has been added.
export function TrustedBy({
  heading,
  description,
  logos,
}: {
  heading: string;
  description: string;
  logos: string[];
}) {
  if (logos.length === 0) return null;

  return (
    <Container>
      <div className="grid grid-cols-1 gap-10 pt-16 sm:grid-cols-2 sm:pt-32">
        <div>
          <h2 className="max-w-sm font-heading text-2xl tracking-tight text-obsidian uppercase">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 max-w-sm text-sm leading-[1.3] tracking-tight text-obsidian/70">
              {description}
            </p>
          )}
        </div>
        <ul className="grid grid-cols-4 items-center gap-x-6 gap-y-10 sm:grid-cols-8 sm:gap-y-12">
          {logos.map((logo, index) => (
            // Every logo gets the same box (full column width, fixed height)
            // and is scaled to fit it, so wide wordmarks and square marks
            // come out the same size instead of sharing only a height.
            <li key={index} className="flex h-8 items-center justify-center">
              {/* Plain <img>: client logos have no fixed aspect ratio and
                  render tiny, so next/image's required width/height and
                  optimizer round-trip would cost more than they save. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain opacity-50 grayscale"
              />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
