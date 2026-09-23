import { PrismaClient } from "@prisma/client";
import { ProjectStatus, BidStatus, Role } from "../src/lib/constants";
import bcrypt from "bcryptjs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createHash } from "crypto";

const prisma = new PrismaClient();

async function upsertUser(
  email: string,
  role: Role,
  orgName: string,
  password: string,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: { role, orgName, passwordHash },
    create: { email, role, orgName, passwordHash },
  });
}

async function writeSample(rel: string, content: string) {
  const root = path.resolve(process.env.STORAGE_DIR || "./storage");
  const full = path.join(root, rel);
  await mkdir(path.dirname(full), { recursive: true });
  const buf = Buffer.from(content, "utf8");
  await writeFile(full, buf);
  return {
    storageKey: rel,
    hash: createHash("sha256").update(buf).digest("hex"),
    size: buf.length,
  };
}

async function main() {
  await prisma.evaluation.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.bidFile.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const admin = await upsertUser("admin@demo.local", Role.ADMIN, "平台运营", "password123");
  const buyer = await upsertUser("buyer@demo.local", Role.BUYER, "示例招标单位", "password123");
  const bidder1 = await upsertUser("bidder1@demo.local", Role.BIDDER, "投标人甲科技", "password123");
  const bidder2 = await upsertUser("bidder2@demo.local", Role.BIDDER, "投标人乙工程", "password123");

  const live = await prisma.project.create({
    data: {
      buyerId: buyer.id,
      title: "演示办公设备采购",
      description: "采购台式计算机、显示器及配套办公软件，用于机关日常办公。",
      status: ProjectStatus.BIDDING,
      publishedAt: new Date(),
      bidDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      scoringRules: '{"method":"综合评分法","满分":100}',
    },
  });
  const tender = await writeSample(
    `projects/${live.id}/tender.txt`,
    "招标文件（演示）：办公设备采购技术与商务要求。",
  );
  await prisma.projectFile.create({
    data: {
      projectId: live.id,
      filename: "招标文件-演示.txt",
      storageKey: tender.storageKey,
      hash: tender.hash,
      size: tender.size,
    },
  });

  const closed = await prisma.project.create({
    data: {
      buyerId: buyer.id,
      title: "已截止演示项目（可直接开标）",
      description: "用于演示开标→评标→公示闭环。",
      status: ProjectStatus.CLOSED,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      bidDeadline: new Date(Date.now() - 60 * 60 * 1000),
      scoringRules: '{"method":"综合评分法","满分":100}',
    },
  });
  const tender2 = await writeSample(
    `projects/${closed.id}/tender.txt`,
    "已截止项目招标文件演示内容。",
  );
  await prisma.projectFile.create({
    data: {
      projectId: closed.id,
      filename: "招标文件-已截止.txt",
      storageKey: tender2.storageKey,
      hash: tender2.hash,
      size: tender2.size,
    },
  });

  for (const [bidder, name] of [
    [bidder1, "甲"],
    [bidder2, "乙"],
  ] as const) {
    const saved = await writeSample(
      `bids/${closed.id}/${bidder.id}/bid.txt`,
      `投标文件演示（${name}）技术方案与报价说明。`,
    );
    await prisma.bid.create({
      data: {
        projectId: closed.id,
        bidderId: bidder.id,
        status: BidStatus.SUBMITTED,
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        files: {
          create: {
            filename: `投标文件-${name}.txt`,
            storageKey: saved.storageKey,
            hash: saved.hash,
            size: saved.size,
            version: 1,
          },
        },
      },
    });
  }

  console.log("Seed OK");
  console.log({
    admin: admin.email,
    buyer: buyer.email,
    bidder1: bidder1.email,
    bidder2: bidder2.email,
    liveProject: live.id,
    closedProject: closed.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
