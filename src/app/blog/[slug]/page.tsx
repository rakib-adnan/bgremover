import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPosts, getFeaturedImage, formatDate } from "@/lib/wordpress";
import { ArrowLeft, Clock, Upload } from "lucide-react";

export async function generateStaticParams() {
  const { posts } = await getPosts(1, 50);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const img = getFeaturedImage(post);
  return {
    title: `${post.title.rendered} — BG Remover Blog`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 160),
    openGraph: { images: img ? [img] : [] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const img = getFeaturedImage(post);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Back link */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition font-medium">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <Clock size={12} />
          <span>{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

        {/* Featured image */}
        {img && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-200">
            <img src={img} alt={post.title.rendered} className="w-full h-64 md:h-80 object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose-content text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* CTA */}
        <div className="mt-12 rounded-2xl p-8 text-center text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
          <h3 className="text-xl font-black mb-2">Try it yourself — free</h3>
          <p className="opacity-80 text-sm mb-5">Remove any background in seconds. No sign-up needed.</p>
          <Link href="/tool"
            className="inline-flex items-center gap-2 bg-white text-violet-700 px-6 py-3 rounded-xl font-black hover:bg-violet-50 transition">
            <Upload size={15} /> Remove Background Free
          </Link>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-gray-400 hover:text-violet-600 text-sm font-medium transition flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> All articles
          </Link>
        </div>
      </article>
    </div>
  );
}
