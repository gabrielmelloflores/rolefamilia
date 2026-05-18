"use client";

import { useEffect } from "react";

interface DisqusCommentsProps {
  slug: string;
  title: string;
  url: string;
}

export function DisqusComments({ slug, title, url }: DisqusCommentsProps) {
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.disqus_config = function (this: Record<string, string>) {
      this.page_url = url;
      this.page_identifier = slug;
      this.page_title = title;
    };

    if (!document.getElementById("dsq-embed-scr")) {
      const s = document.createElement("script");
      s.id = "dsq-embed-scr";
      s.src = `https://rolefamilia.disqus.com/embed.js`;
      s.async = true;
      s.setAttribute("data-timestamp", String(Date.now()));
      document.head.appendChild(s);
    } else if (w.DISQUS) {
      (w.DISQUS as { reset: (config: unknown) => void }).reset({
        reload: true,
        config: w.disqus_config,
      });
    }
  }, [slug, title, url]);

  return (
    <section className="mt-16 pt-10 border-t border-stone-200">
      <h3 className="font-heading text-2xl font-bold text-stone-900 mb-8">Comentários</h3>
      <div id="disqus_thread" />
    </section>
  );
}
