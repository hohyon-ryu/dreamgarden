/**
 * 꿈이자라는뜰 플랫폼 핵심 타입 정의
 * PRD 문서의 데이터 사전(Data Dictionary)을 기반으로 작성
 */

// ========== User Role Enum ==========
export enum UserRole {
  TEACHER = "Teacher",
  PARENT = "Parent",
  INDIVIDUAL = "Individual",
  STAFF = "Staff",
}

// ========== School Context Enum ==========
export enum SchoolContext {
  PRE = "Pre", // 등교 전
  DURING = "During", // 학교/기관 중
  POST = "Post", // 귀가 후
}

// ========== AI Flag Enum ==========
export enum AIFlag {
  AGG = "AGG", // Aggressive/감정적 언어
  VAG = "VAG", // Vague/모호한 언어
  NEU = "NEU", // Neutral/중립적
}

// ========== Competency (역량) ==========
export interface Competency {
  competencyId: string; // UUID
  competencyName: string; // 예: "정리정돈", "의사소통"
  parentCompetencyId?: string; // 상위 계층 분류
  recommendedJobIds?: number[]; // 외부 직업 DB 연결
  recordCitationCount: number; // 해당 역량을 뒷받침하는 기록 수
}

// ========== User (사용자) ==========
export interface User {
  userId: string; // UUID
  role: UserRole;
  hoching?: string; // 보호자의 호칭 (엄마, 아빠 등)
  facilityId?: string; // 교사의 소속 기관 ID
  managedStudentIds?: string[]; // 교사가 관리하는 학생 ID 목록
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== Student (학생/당사자) ==========
export interface Student {
  studentId: string; // UUID
  affiliation: string; // 학교/학년 정보 (예: "서울중, 3학년")
  guardianIds: string[]; // 연결된 보호자 User ID 목록
  portfolioCompletionPct: number; // 0-100 실시간 완성도 지표
  name: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== Record (기록) - 핵심 트랜잭션 데이터 ==========
export interface Record {
  recordId: string; // UUID
  studentId: string; // 기록 대상 학생 ID
  authorId: string; // 작성자 User ID
  authorRole: UserRole; // 작성 주체 역할
  schoolContext: SchoolContext; // 등교 전/중/후 구분 (F01.02 인과 관계 연결에 필수)
  narrativeTextRaw: string; // 원본 입력 텍스트 (감사 추적 및 법적 기록 보존)
  narrativeTextShared: string; // 최종 공유 텍스트 (중립화 적용 여부 포함)
  aiNeutralized: boolean; // F02.01 AI 중립화 적용 및 수락 여부
  aiFlag?: AIFlag; // NLP 텍스트 플래그 지정 결과
  emotionCardId: number; // C의 감정 데이터 누적 (예: 1=기뻐요, 2=혼란스러워요)
  linkedRecordId?: string; // 보호자의 등교 전 기록과 교사의 학교 기록 간 연결 (F01.02)
  extractedCompetencyIds?: string[]; // F03.01 결과, 기록이 어떤 역량과 관련되는지 매핑
  mediaUrls?: string[]; // 사진/동영상 첨부 (최대 20개)
  fileUrls?: string[]; // 파일 첨부 (최대 5개)
  checklistItems?: ChecklistItem[]; // 체크리스트
  createdAt: Date;
  updatedAt: Date;
}

// ========== Checklist Item (체크리스트 항목) ==========
export interface ChecklistItem {
  id: string;
  label: string; // 체크리스트 항목명
  checked: boolean;
}

// ========== Emotion Card (감정 카드) ==========
export interface EmotionCard {
  id: number;
  label: string; // 예: "기뻐요", "혼란스러워요", "우울해요"
  icon?: string; // 아이콘 URL 또는 이모지
}

// ========== Comment (댓글) ==========
export interface Comment {
  commentId: string; // UUID
  recordId: string; // 댓글이 달린 기록 ID
  authorId: string; // 댓글 작성자 User ID
  authorRole: UserRole;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== Portfolio (포트폴리오) ==========
export interface Portfolio {
  portfolioId: string; // UUID
  studentId: string;
  generatedAt: Date;
  completionPct: number; // 완성도 (0-100)
  summaryText: string; // AI 생성 요약 텍스트
  keyCompetencies: Competency[]; // 핵심 역량 목록
  recommendedJobs: string[]; // 추천 직업 목록
  recordCount: number; // 누적 기록 수
  emotionTimelineData: EmotionTimelineEntry[]; // 감정 타임라인 데이터
  pdfUrl?: string; // 생성된 PDF URL
}

// ========== Emotion Timeline Entry (감정 타임라인 항목) ==========
export interface EmotionTimelineEntry {
  date: Date;
  emotionCardId: number;
  emotionLabel: string;
}

// ========== Facility (기관/학교) ==========
export interface Facility {
  facilityId: string; // UUID
  name: string; // 기관명
  type: string; // 기관 종류 (특수학교, 직업학교 등)
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
