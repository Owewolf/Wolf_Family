export default function MapBlock() {
  return (
    <section id="map" className="mb-16">
      <div className="card-modern rounded-3xl shadow-modern p-10">
        <h2 className="text-4xl font-dynapuff font-semibold text-forest mb-8">Find Our Farm</h2>
        <p className="text-forest/80 mb-8 text-lg leading-relaxed font-dynapuff">
          Located in the heart of South Africa, Wolf's Lair offers a perfect blend of rural tranquility and accessibility. 
          Come visit us and experience farm life firsthand!
        </p>
        <div className="rounded-2xl overflow-hidden shadow-modern-lg">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d37980.59918259149!2d24.12038024419048!3d-34.005213021145266!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e797d00ca632c55%3A0x6871d750475262e9!2sWolf%20Lair!5e1!3m2!1sen!2sza!4v1749924764790!5m2!1sen!2sza"
            width="100%" 
            height="450" 
            style={{ border: 0 }}
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            title="Wolf's Lair Farm Location"
          />
        </div>
      </div>
    </section>
  );
}
