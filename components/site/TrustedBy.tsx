import { Container } from "@/components/ui/Container";
import { CLIENT_LOGO_CLASS } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import {
  RevealItem,
  RevealWords,
  afterWords,
  twoLineHeading,
} from "@/components/ui/RevealText";

// Home's clients section is edited in the admin Home editor; the About strip's
// logos in the admin About editor — see lib/data/content.ts.
// Both variants render nothing until at least one logo has been added, and
// both play the shared Contact-style entrance (components/ui/RevealText)
// when scrolled into view: heading word by word, then the rest fades up.

// Plain <img>: client logos have no fixed aspect ratio and render small, so
// next/image's required width/height and optimizer round-trip would cost
// more than they save. Sized by CLIENT_LOGO_CLASS, the same rule as the admin
// tiles, so a logo looks the same size in both.
function Logo({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={`${CLIENT_LOGO_CLASS} grayscale`}
    />
  );
}

// "Trusted International Clients" block on Home (Figma v2):
// heading + short blurb on the left, a 6×2 logo grid on the right half
// (stacked on narrower screens, where side by side would leave the logos too
// little width to keep their size; 3 per row on phones).
// `id` makes it a scroll target (the Home hero's "Scroll" cue).
export function TrustedBy({
  id,
  heading,
  description,
  logos,
}: {
  id?: string;
  heading: string;
  description: string;
  logos: string[];
}) {
  if (logos.length === 0) return null;

  const itemsStart = afterWords(heading);

  return (
    <Reveal id={id}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 py-16 sm:py-[126px] min-[1400px]:grid-cols-2">
          <div>
            <h2 className="max-w-[467px] font-heading text-2xl tracking-tight text-obsidian">
              <RevealWords text={twoLineHeading(heading)} />
            </h2>
            {description && (
              <RevealItem
                as="p"
                startMs={itemsStart}
                className="mt-4 max-w-[530px] text-sm leading-[1.3] tracking-tight text-obsidian"
              >
                {description}
              </RevealItem>
            )}
          </div>
          <ul className="grid grid-cols-3 opacity-50 sm:grid-cols-6">
            {logos.map((logo, index) => (
              <RevealItem
                key={index}
                as="li"
                startMs={itemsStart}
                index={index + 1}
                className="flex h-20 items-center justify-center px-0.5 sm:h-24"
              >
                <Logo src={logo} />
              </RevealItem>
            ))}
          </ul>
        </div>
      </Container>
    </Reveal>
  );
}

// "Trusted By" strip on About (Figma v2): centred heading over a single
// row of logos that runs past both screen edges. The row is rendered twice
// back to back and scrolled by exactly one copy's width, so the loop is
// seamless; the second copy is hidden from assistive tech.
export function TrustedByMarquee({ logos }: { logos: string[] }) {
  if (logos.length === 0) return null;

  return (
    <Reveal
      as="section"
      className="flex flex-col items-center gap-9 overflow-hidden pt-16 pb-9 sm:pt-24 sm:pb-9"
    >
      <h2 className="font-heading text-base font-semibold tracking-tight text-obsidian sm:text-2xl">
        <RevealWords text="Trusted By" />
      </h2>
      <RevealItem startMs={afterWords("Trusted By")}>
        <div className="flex w-max animate-marquee opacity-50 hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex">
              {logos.map((logo, index) => (
                <li
                  key={index}
                  className="flex h-20 w-28 items-center justify-center px-1 sm:h-32 sm:w-[180px]"
                >
                  <Logo src={logo} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </RevealItem>
    </Reveal>
  );
}
