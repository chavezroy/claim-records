import Image from 'next/image';
import Link from 'next/link';
import { artists } from '@/lib/data/artists';
import { getFeaturedProducts } from '@/lib/data/products';
import ArtistCard from '@/components/artists/ArtistCard';
import ProductCard from '@/components/shop/ProductCard';
import GetInTouch from '@/components/contact/GetInTouch';

export default function AboutPage() {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-dark text-white py-16">
        <div className="container">
          <div className="text-center max-w-full">
            <h1 className="text-4xl md:text-5xl mb-4 font-electric">Claim Records</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4">Claim Your Stake!</p>
            <p className="text-lg md:text-xl text-gray-300">
              An independent record label dedicated to amplifying authentic voices and groundbreaking music.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl mb-8 font-electric">Our Mission</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
              Claim Records is built on the foundation of artistic integrity and creative freedom. 
              We believe in giving artists the platform they deserve to share their authentic stories 
              and connect with audiences who truly understand their vision.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Our mission is to discover, develop, and promote exceptional talent while maintaining 
              the highest standards of artistic expression and industry innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-12 font-electric text-center">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-xl md:text-2xl mb-4 text-primary font-semibold">The Beginning</h3>
                <p className="text-gray-700 leading-relaxed">
                  Claim Records was founded with a simple yet powerful vision: to create a space 
                  where artists can thrive without compromising their creative integrity. We started 
                  as a small independent label with a passion for discovering raw, unfiltered talent.
                </p>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl mb-4 text-primary font-semibold">Today</h3>
                <p className="text-gray-700 leading-relaxed">
                  Today, we're proud to represent a diverse roster of artists who push boundaries 
                  and challenge conventions. From rock and metal to experimental sounds, our artists 
                  represent the cutting edge of independent music.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-8 font-electric">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="mb-6 flex justify-center items-center">
                <i className="bi bi-music-note-beamed text-primary text-5xl leading-none block"></i>
              </div>
              <h3 className="text-lg md:text-xl mb-4 font-semibold text-dark">Artistic Freedom</h3>
              <p className="text-gray-700 leading-relaxed">
                We believe artists should have complete creative control over their work and vision.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 flex justify-center items-center">
                <i className="bi bi-people text-primary text-5xl leading-none block"></i>
              </div>
              <h3 className="text-lg md:text-xl mb-4 font-semibold text-dark">Artist Development</h3>
              <p className="text-gray-700 leading-relaxed">
                We invest in long-term relationships, helping artists grow and evolve their careers.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 flex justify-center items-center">
                <i className="bi bi-heart text-primary text-5xl leading-none block"></i>
              </div>
              <h3 className="text-lg md:text-xl mb-4 font-semibold text-dark">Authenticity</h3>
              <p className="text-gray-700 leading-relaxed">
                We champion genuine expression and support artists who stay true to themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-4xl md:text-5xl mb-6 font-electric text-center">Our Artists</h2>
          <p className="text-center text-gray-700 mb-12 text-lg md:text-xl">
            Discover the talented artists who make Claim Records what it is today.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {artists.slice(0, 4).map((artist) => (
              <div key={artist.id}>
                <ArtistCard artist={artist} variant="card" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/artists" className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 no-underline inline-block transition-colors">
              View All Artists
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - One Row */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-4xl md:text-5xl mb-6 font-electric text-center">Shop Claim Records</h2>
          <p className="text-center text-gray-700 mb-12 text-lg md:text-xl">
            Support your favorite artists with official Claim Records merchandise.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop" className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 no-underline inline-block transition-colors">
              Visit Shop
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <GetInTouch variant="default" />
    </>
  );
}
