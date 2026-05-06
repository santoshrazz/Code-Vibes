import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n-config";
import { MoreStories } from "@/src/components/blog/more-stories";
import { Hero } from "@/src/components/Hero";
import { getAllPosts } from "@/src/utils/blogApi";

export const metadata: Metadata = {
  title: "Blog | CodeVibes",
  alternates: {
    canonical: "https://codevibes.in/blog",
  },
};

export default async function BlogOverviewPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <div>
      <BlogContent posts={allPosts} />
    </div>
  );
}

function BlogContent({ posts }: { posts: any[] }) {
  const t = useTranslations("Blog");

  return (
    <>
      <Hero
        title={t("title")}
        description={t("description")}
      />

      <div className="container">
        {posts.length > 0 && <MoreStories posts={posts} />}
      </div>
    </>
  );
}
