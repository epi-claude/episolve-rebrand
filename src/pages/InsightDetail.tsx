import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Linkedin, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { getInsightBySlug, insights } from "@/data/insights";
import { toast } from "sonner";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InsightDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getInsightBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/insights" replace />;
  }

  const otherPosts = insights.filter((p) => p.id !== post.id).slice(0, 2);

  const handleShare = (platform: "linkedin" | "copy") => {
    const url = window.location.href;
    const title = post.title;

    switch (platform) {
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link
              to="/insights"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Insights
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{post.author.name}</span>
                <span>·</span>
                <span>{post.author.role}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar - Share */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="sticky top-28">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  Share this article
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("linkedin")}
                    className="justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="justify-start"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div
                className="text-muted-foreground leading-relaxed 
                  [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 
                  [&_h3]:text-foreground [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 
                  [&_p]:mb-6 [&_p]:text-lg
                  [&_ul]:mb-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
                  [&_ol]:mb-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3
                  [&_li]:text-muted-foreground
                  [&_strong]:text-foreground [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Mobile Share */}
              <div className="lg:hidden mt-12 pt-8 border-t border-border">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  Share this article
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {otherPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              More Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {otherPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/insights/${relatedPost.slug}`}
                  className="p-6 rounded-2xl card-gradient border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-xl font-display font-semibold text-foreground mt-4 mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
