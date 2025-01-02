import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PortfolioCard from "./components/Portfolio";

export default function Home() {
  return (
    <main className=" p-9">
      <Navbar />
      <Hero />
      {/* <PortfolioCard /> */}
    </main>
  );
}
