import { randomUUID } from "crypto";
import { mkdir, readdir, stat, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

export async function GET() {
  try {
    await mkdir(uploadsDir, { recursive: true });
    const files = await readdir(uploadsDir);

    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        const fullPath = path.join(uploadsDir, fileName);
        const fileStat = await stat(fullPath);
        const uploadedAt = fileStat.mtime.toISOString();
        const uploadedAtTs = fileStat.mtimeMs;

        return {
          id: fileName,
          fileName,
          url: `/uploads/${fileName}`,
          size: fileStat.size,
          uploadedAt,
          uploadedAtTs,
        };
      }),
    );

    fileDetails.sort((a, b) => b.uploadedAtTs - a.uploadedAtTs);
    return NextResponse.json(fileDetails.map(({ uploadedAtTs, ...item }) => item));
  } catch (error) {
    console.error("Failed to read uploads:", error);
    return NextResponse.json(
      { message: "이미지 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ message: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "이미지는 5MB 이하만 업로드할 수 있습니다." }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  const safeExtension = allowedExtensions.has(extension) ? extension : ".png";
  const fileName = `${Date.now()}-${randomUUID()}${safeExtension}`;
  const filePath = path.join(uploadsDir, fileName);

  await mkdir(uploadsDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return NextResponse.json(
    {
      id: fileName,
      fileName,
      url: `/uploads/${fileName}`,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    },
    { status: 201 },
  );
}
