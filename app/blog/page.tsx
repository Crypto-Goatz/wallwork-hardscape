import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BlogPost } from "@/components/site/BlogPost";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";

export const revalidate = 300;

export default async function BlogPage() {
  const config = await getSiteConfig();
  let posts: Record<string, string>[] = [];

  try {
    const data = await getSheetData("blog");
    posts = data
      .filter((p) => p.status === "published")
      .sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
  } catch {
    // Sheets not configured
  }

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                Blog
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Insights, tips, and updates from {config.name}.
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogPost
                    key={post.slug}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    imageId={post.image_id}
                    publishedAt={post.published_at}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                No blog posts yet. Check back soon!
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}
