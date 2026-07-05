import Header from "../components/layout/Navbar";
import Hero from "../components/Hero";
import SignageStrip from "../components/SignageStrip";
import About from "../components/About";
import Services from "../components/Services";
import Procedures from "../components/Procedures";
import Gallery from "../components/Gallery";
import News from "../components/News";
import FAQ from "../components/FAQ";
import Location from "../components/Location";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SignageStrip />
        <About />
        <Services />
        <Procedures />
        <Gallery />
        <News />
        <FAQ />
        <Location />
      </main>
      <Footer />
    </>
  );
}
