import Link from "next/link";

export default function NewRoom() {
  return (
    <main className="container coming-soon">
      <Link href="/" className="brand">RoomFit <span className="brand-ai">AI</span></Link>
      <section className="coming-soon-card" aria-labelledby="new-room-title">
        <p className="eyebrow">다음 단계</p>
        <h1 id="new-room-title">내 방 만들기를<br />준비하고 있어요.</h1>
        <p>방 크기와 문·창문 위치를 입력하는 평면도 기능은 다음 개발 단계에서 추가됩니다.</p>
        <p>지금은 홈 화면과 화면 이동을 확인할 수 있습니다. 방 정보 입력과 저장은 아직 지원하지 않습니다.</p>
        <Link href="/" className="button">홈으로 돌아가기 <span aria-hidden="true">←</span></Link>
      </section>
    </main>
  );
}
