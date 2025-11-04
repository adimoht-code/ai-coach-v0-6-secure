// ✅ server.js - Render 배포 안정형 (AI 헬스코치 v0.6-secure)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 경로 유틸 (ESM 환경에서 __dirname 대체)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ public 폴더를 정적 파일로 제공
app.use(express.static(path.join(__dirname, "public")));

// ✅ 루트 경로(index.html) 응답
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", server: "AI Coach v0.6-secure" });
});

// ✅ AI 루틴 생성 엔드포인트
app.post("/api/routine", async (req, res) => {
  const { height, weight, goal, period } = req.body;
  console.log("📩 루틴 요청 받음:", req.body);

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error("❌ OpenAI API 키가 없습니다!");
    return res.status(500).json({ error: "API 키 누락" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "당신은 전문 피트니스 트레이너입니다. 사용자의 신체 정보와 목표에 맞는 맞춤 운동 루틴을 생성하세요.",
          },
          {
            role: "user",
            content: `키: ${height}cm, 몸무게: ${weight}kg, 목표: ${goal}, 기간: ${period}주.
            1주 단위로 요일별 운동 루틴을 한국어로 작성해주세요.
            (예: 월요일 - 스쿼트 4세트 12회 ...)`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI 응답 오류:", data);
      return res.status(500).json({
        error: data.error?.message || "AI 응답 실패",
      });
    }

    const resultText = data.choices[0].message.content;
    console.log("✅ 루틴 생성 완료");
    res.json({ routine: resultText });
  } catch (err) {
    console.error("🚨 서버 내부 오류:", err);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
