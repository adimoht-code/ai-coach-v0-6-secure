// ✅ AI 헬스코치 v0.6 Pro - app.js (최종 안정 버전)
// GPT-5 백엔드(Node.js)와 통신
document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const resultArea = document.getElementById("resultArea");

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const height = document.getElementById("height").value.trim();
    const weight = document.getElementById("weight").value.trim();
    const goal = document.getElementById("goal").value;
    const period = document.getElementById("duration").value.trim();

    if (!height || !weight || !goal || !period) {
      alert("⚠️ 모든 항목을 입력해주세요!");
      return;
    }

    // 로딩 메시지 표시
    resultArea.innerHTML = `
      <div style="text-align:center; font-size:1.1em; color:#555;">
        🤖 GPT-5 트레이너가 분석 중입니다...
      </div>
    `;

    try {
      const response = await fetch("/api/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight, goal, period }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI 응답 실패");
      }

      // 성공 시 루틴 표시
      resultArea.innerHTML = `
        <div style="background:#f7faff; border:1px solid #cce; border-radius:10px; padding:20px;">
          <h3 style="color:#0055cc;">🏋️‍♀️ AI 추천 루틴</h3>
          <pre style="white-space:pre-wrap; font-family:'Pretendard',sans-serif; line-height:1.6;">${data.routine}</pre>
        </div>
      `;
    } catch (error) {
      console.error("❌ 서버 통신 오류:", error);
      resultArea.innerHTML = `
        <div style="color:red; text-align:center; margin-top:20px;">
          ⚠️ 서버 오류 또는 응답 없음<br>
          Node.js 서버를 확인하세요.<br>
          (${error.message})
        </div>
      `;
    }
  });
});
