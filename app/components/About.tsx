import RichTextRenderer from "./RichTextRenderer";
import { FadeIn } from "./ui/FadeIn";

// Define props interface
interface AboutProps {
  title?: string;
  text?: string;
  imageUrl?: string;
}

export default function AboutUs({ title, text, imageUrl }: AboutProps) {
  return (
    <section className="bg-white py-12 sm:py-20 md:py-28" id="about">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:gap-12">
          <div className="mb-8 w-full md:mb-0 md:max-w-xl">
            <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <FadeIn>
                <img
                  src="/assets/master-builders-logo.png"
                  alt="Master Builders Logo"
                  className="h-16 sm:h-18"
                />
              </FadeIn>
              <FadeIn>
                <h2 className="font-medium font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
                  {/* Use title prop, fallback to default */}
                  {title ?? "About Us"}
                </h2>
              </FadeIn>
            </div>
            <div className="space-y-4 text-gray-700">
              {/* Render rich text if present, fallback to default text */}
              {text ? (
                <RichTextRenderer json={text} />
              ) : (
                <p className="text-base sm:text-lg">
                  {`At Lush Constructions, we're driven by a passion for building more than just structures – we craft homes, communities, and memories that last a lifetime. With a relentless focus on quality, transparency, and trust, we're dedicated to turning your vision into a breathtaking reality. As proud members of Master Builders NSW, we uphold the highest standards in the industry, ensuring every project is delivered with precision, care, and a commitment to excellence. Whether you're dreaming of a grand renovation, a thoughtful extension, or a brand-new build, our team of experts is here to guide you every step of the way.`}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <img
              // Use imageUrl prop, fallback to default
              src={imageUrl ?? "/assets/team.jpg"}
              alt={title ?? "About Us"} // Use title for alt text
              className="aspect-3/2 w-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
