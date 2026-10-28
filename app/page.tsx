import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import FilmRoll from "./components/FilmRoll";

export default function Home() {
  return (
    <main>
      <header className="fixed inset-x-0 top-9 z-10">
        <Navbar />
      </header>
      <FilmRoll>
        <div className="h-full w-screen shrink-0 p-9">
          <Hero />
        </div>
        <Portfolio />
      </FilmRoll>
    </main>
  );
}
