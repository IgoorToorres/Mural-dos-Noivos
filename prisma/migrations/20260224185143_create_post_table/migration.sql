-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");
