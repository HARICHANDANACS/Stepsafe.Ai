import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { AppSession } from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client/client";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AppSession;
    const profileData = body.profile ?? null;
    let profileId: string | undefined = undefined;
    if (profileData) {
      const p = await prisma.userProfile.create({
        data: {
          city: profileData.city ?? null,
          latitude: profileData.latitude ?? null,
          longitude: profileData.longitude ?? null,
          ageGroup: profileData.ageGroup ?? null,
          activityLevel: profileData.activityLevel ?? null,
        },
      });
      profileId = p.id;
    }
    const s = await prisma.session.create({
      data: {
        profileId,
        location: body.data?.location?.name ?? null,
        aqi: body.data?.current?.aqi ?? null,
        uvIndex: body.data?.current?.uvIndex ?? null,
        temperatureC: body.data?.current?.temperatureC ?? null,
        humidity: body.data?.current?.humidity ?? null,
        precipProb: body.data?.current?.precipProb ?? null,
        dataJson: (body.data ?? {}) as unknown as Prisma.InputJsonValue,
        resultJson: (body.result ?? {}) as unknown as Prisma.InputJsonValue,
      },
    });
    if (body.advisory) {
      await prisma.advisory.create({
        data: { sessionId: s.id, text: body.advisory },
      });
    }
    return Response.json({ id: s.id });
  } catch (e: unknown) {
    const msg = (e as Error).message ?? "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { advisory: true },
  });
  return Response.json({ sessions });
}
