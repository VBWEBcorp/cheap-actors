import { getFilms } from "@/lib/catalog";
import { FilmIndex } from "@/components/film-index";

export const metadata = {
  title: "Films",
  description: "L'intégralité du programme Cheap Actors.",
};

export default function FilmsPage() {
  const films = getFilms();

  return (
    <div className="pt-32 md:pt-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 grid grid-cols-12 gap-4 md:mb-20 lg:mb-24">
          <div className="col-span-12 md:col-span-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              ●  Programme — {films.length} films, c'est déjà ça
            </p>
            <h1 className="mt-4 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(56px,12vw,200px)] md:mt-6">
              Films<span className="text-flame">.</span>
            </h1>
          </div>
          <p className="col-span-12 mt-2 max-w-md font-display text-lg leading-snug md:col-span-3 md:mt-24 md:text-xl lg:mt-32">
            Format horizontal. <br />
            <span className="italic">Pour ceux qui veulent rester assis.</span>
          </p>
        </div>

        <FilmIndex films={films} />
      </div>
    </div>
  );
}
