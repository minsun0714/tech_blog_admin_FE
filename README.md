# tech_blog_admin_FE

기술 블로그 관리자 프론트엔드입니다.

## 기술 스택

- Next.js 14.x (App Router)
- TanStack Query
- TanStack Table
- Zustand
- Tailwind CSS

## 구현된 요구사항

- 보라 계열(과하지 않은 톤) 테마 적용
- 게시물 작성 시 실시간 미리보기
- 에디터에 이미지를 드래그 앤 드롭하면 즉시 서버(`/api/uploads`)로 업로드
- 업로드 완료 후 본문에 이미지 마크다운 자동 삽입
- 업로드 이미지 목록 테이블 제공

> 에디터는 추가 라이브러리 없이 **Next.js 기본 textarea**를 사용했습니다. 별도 에디터 의존성이 없어 가장 가볍습니다.

## 실행

```bash
npm install
npm run dev
```
