const agents = [
  {
    title: "Document Review Agent",
    desc: "Reads permits, applications and supporting files, checks eligibility against your rules, flags what's missing, and drafts the official report.",
  },
  {
    title: "Helpdesk & HR Agent",
    desc: "Answers employee and customer questions in Bahasa Indonesia from your own SOPs and policies, and triages tickets to the right person.",
  },
  {
    title: "Knowledge Agent",
    desc: "Turns scattered PDFs, spreadsheets and chats into searchable company knowledge, with every answer grounded in a source.",
  },
];

const proof = [
  { name: "DEMS", desc: "Document eligibility workflow with AI classifier & report generation" },
  { name: "Portal Helpdesk", desc: "RAG knowledge search, ticket categorization, meeting summaries" },
  { name: "AI Employee", desc: "Multi-agent orchestration with LangGraph & MCP tool use" },
];

export default function WyzerProduct() {
  return (
    <section id="product" className="mx-auto max-w-5xl px-4 py-20">
      <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>
        Wyzer · AI agents for Indonesian SMEs
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl text-text">
        Your back office, run by AI agents.
      </h2>
      <p className="mt-5 max-w-2xl text-lg text-text-muted">
        Wyzer builds AI agents that handle document-heavy work for Indonesian
        businesses: reviewing documents, answering staff and customer questions,
        and keeping company knowledge at hand, all in Bahasa Indonesia. A
        5-person team gets the output of a full operations department.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="mailto:hello@wyzer.my.id?subject=Wyzer%20demo"
          className="btn-noir btn-noir-primary"
        >
          Book a demo
        </a>
        <a href="/#projects" className="btn-noir btn-noir-ghost">
          See what we&apos;ve built
        </a>
      </div>
      <div className="mt-20 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-text">The problem</h3>
          <p className="mt-3 text-text-muted">
            Indonesian SMEs drown in manual back-office work: checking documents
            by hand, answering the same questions on WhatsApp, and searching
            folders for the right file. Enterprise software is too expensive and
            too complex; hiring more staff doesn&apos;t scale.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text">Our approach</h3>
          <p className="mt-3 text-text-muted">
            Focused AI agents that plug into the way a business already works,
            built on Claude by Anthropic, grounded in each company&apos;s own
            documents, and priced for SMEs.
          </p>
        </div>
      </div>
      <h3 className="mt-20 text-xl font-semibold text-text">What the agents do</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {agents.map((a) => (
          <div key={a.title} className="card-noir">
            <h4 className="font-semibold text-text">{a.title}</h4>
            <p className="mt-2 text-sm text-text-muted">{a.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 card-noir sm:p-8">
        <h3 className="text-xl font-semibold text-text">Built on Claude</h3>
        <p className="mt-3 text-text-muted">
          Claude is the reasoning core of every Wyzer agent: classifying
          documents, drafting reports, and answering from company knowledge via
          retrieval (RAG) and MCP tool use, with structured outputs that slot
          straight into existing systems.
        </p>
      </div>
      <h3 className="mt-20 text-xl font-semibold text-text">Already built</h3>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {proof.map((p) => (
          <li key={p.name} className="card-noir">
            <p className="font-semibold text-text">{p.name}</p>
            <p className="mt-2 text-sm text-text-muted">{p.desc}</p>
          </li>
        ))}
      </ul>
      <p className="mt-16 text-sm text-text-dim">
        Wyzer is founded by Muhammad Wyzer, a full-stack & AI engineer and
        Ministry-certified AI trainer who teaches Indonesian students and teams
        to build with AI.
      </p>
    </section>
  );
}
