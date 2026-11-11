import Link from "next/link";

const features = [
  { number: "01", title: "내 방부터 이해하기", description: "방의 가로·세로 길이를 입력하고 실제 비율의 평면도를 확인해요. 문·창문 위치 입력은 다음 단계에 추가돼요." },
  { number: "02", title: "있는 가구, 새롭게", description: "침대와 책상 등 기존 가구의 크기를 반영해 공간과 생활 동선에 맞는 배치를 제안할 예정이에요." },
  { number: "03", title: "필요한 가구만 더하기", description: "남은 공간과 예산에 어울리는 새 가구를 찾아, 구매 전 배치를 비교할 수 있도록 만들어요." },
];

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <header className="header container">
        <Link href="/" className="brand" aria-label="RoomFit AI 홈">
          <span className="brand-icon" aria-hidden="true">⌑</span>
          RoomFit <span className="brand-ai">AI</span>
        </Link>
        <a href="#how-it-works" className="nav-link">어떤 서비스인가요? <span aria-hidden="true">↗</span></a>
      </header>

      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="dot" /> 내 공간의 새로운 가능성</p>
            <h1 id="hero-title">같은 방,<br /><span>더 나은 배치.</span></h1>
            <p className="hero-description">내 방에 꼭 맞는 가구 배치와 인테리어.<br />RoomFit AI와 함께 공간을 새롭게 계획해 보세요.</p>
            <Link href="/room/new" className="button">내 방 만들기 <span aria-hidden="true">→</span></Link>
            <p className="helper">방 크기를 입력하고 나만의 2D 평면도를 만들어 보세요.</p>
          </div>

          <figure className="room-card" aria-labelledby="room-caption">
            <div className="room-card-top"><span>MY LITTLE SPACE</span><span className="sample-badge">예시 평면도</span></div>
            <div className="floorplan" role="img" aria-label="위쪽에 창문, 왼쪽에 침대, 오른쪽에 책상, 아래쪽에 출입문이 있는 가상 방 평면도">
              <span className="window" />
              <div className="bed"><span className="pillow" /><span>침대</span></div>
              <div className="rug" />
              <div className="desk"><span>책상</span></div>
              <div className="chair" />
              <div className="plant"><span>✳</span></div>
              <div className="storage">수납장</div>
              <span className="door" />
              <span className="dimension">3.6 m</span>
            </div>
            <figcaption id="room-caption"><span className="dot" /> 작은 변화로, 더 여유로운 일상</figcaption>
            <p className="sample-note">화면 이해를 위한 예시이며 실제 분석 결과가 아닙니다.</p>
          </figure>
        </section>

        <section id="how-it-works" className="features-section">
          <div className="container">
            <div className="section-heading"><p className="eyebrow">A BETTER FIT FOR YOU</p><h2>공간을 바꾸는 세 가지 단계</h2><p>이런 기능들을 차근차근 만들어 가고 있어요.</p></div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.number}>
                  <span className="feature-number">{feature.number}</span>
                  <h3>{feature.title}</h3><p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container footer"><span>RoomFit AI</span><span>당신의 공간에, 더 좋은 가능성.</span></footer>
    </>
  );
}
