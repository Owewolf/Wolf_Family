interface ContentBlockProps {
  title: string;
  content: string;
}

export default function ContentBlock({ title, content }: ContentBlockProps) {
  return (
    <section className="mb-16">
      <div className="card-modern rounded-3xl shadow-modern p-10">
        <h2 className="text-4xl font-dynapuff font-semibold text-forest mb-8">{title}</h2>
        <div className="prose prose-xl max-w-none">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-forest/80 leading-relaxed mb-6 text-lg font-dynapuff">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
