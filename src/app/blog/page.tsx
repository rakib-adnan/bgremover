import Link from "next/link";
import { getPosts, getFeaturedImage, formatDate, stripHtml } from "@/lib/wordpress";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog — BG Remover",
  description: "Tips, tutorials and updates about background removal and image editing.",
};

export default async function BlogPage() {
  const { posts, total } = await getPosts(1, 12);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="hero-gradient py-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 border border-violet-200 px-4 py-1.5 rounded-full text-violet-600 text-xs font-bold mb-5">
          <BookOpen size={12} /> Blog & Tutorials
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Tips, Guides &<br /><span className="gradient-text">Tutorials</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Learn how to get the best results with background removal, image editing tips, and product photography guides.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">

        {posts.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <BookOpen size={32} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-500 mb-6">Check back soon — tutorials and guides are coming.</p>
            <Link href="/tool"
              className="inline-flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-xl font-black">
              Try the Tool <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-8">{total} article{total !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const img = getFeaturedImage(post);
                const excerpt = stripHtml(post.excerpt.rendered);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    className="bg-white rounded-2xl overflow-hidden card-shadow border border-gray-200 group flex flex-col">
                    {/* Image */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img src={img} alt={post.title.rendered} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full hero-gradient flex items-center justify-center">
                          <BookOpen size={36} className="text-violet-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="font-black text-gray-900 text-lg leading-snug mb-2 group-hover:text-violet-600 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      {excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{excerpt}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock size={12} /> {formatDate(post.date)}
                        </div>
                        <span className="text-violet-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
