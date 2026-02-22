import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  rating: string;
}

export function TestimonialCard({
  name,
  role,
  text,
  rating,
}: TestimonialCardProps) {
  const stars = parseInt(rating) || 5;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < stars
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>
      <blockquote className="text-gray-700 mb-4 italic">
        &ldquo;{text}&rdquo;
      </blockquote>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        {role && <p className="text-sm text-gray-500">{role}</p>}
      </div>
    </div>
  );
}
