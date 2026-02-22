import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BlogPost } from "@/components/site/BlogPost";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 300;

async function getPosts() {
  try {
    const data = await getSheetData("blog");
    return data.filter((p) => p.status === "published");
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  const config = await getSiteConfig();

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | ${config.name}`,
    description: post.excerpt?.slice(0, 160) || `Read ${post.title} on the ${config.name} blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getSiteConfig();
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen py-20">
        <BlogPost
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          imageId={post.image_id}
          publishedAt={post.published_at}
          variant="full"
          content={post.content}
        />
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}
