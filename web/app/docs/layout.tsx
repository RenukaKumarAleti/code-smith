import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <aside className="md:sticky md:top-20 md:h-fit">
          <DocsSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
      <SiteFooter />
    </>
  );
}
