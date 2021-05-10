export default function ErrorHeroComponent(props) {
  return (
    <section className="hero error--section">
      <div className="error--container">
        <h1 className="title">Error!</h1>
        <h2 className="meta">Those Aliens Stole This Page Again!</h2>
        <div className="cartoon--container">
          <img src="/assets/gfx/angry.webp" alt="Cartoon" className="cartoon" />
        </div>
      </div>
    </section>
  );
}
