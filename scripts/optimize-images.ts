/**
 * 图片压缩脚本
 * - 将 public/images 下的 JPG/PNG 压缩为适合 web 展示的尺寸
 * - 人物图最大宽度 600px，场景图最大宽度 1200px
 * - 输出质量 82，格式保持 JPEG
 */
import { glob } from 'glob'
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs/promises'

const TARGETS = [
  { pattern: 'public/images/figures/*.jpg', maxWidth: 600, quality: 82 },
  { pattern: 'public/images/scenes/*.jpg', maxWidth: 1200, quality: 82 },
]

async function main() {
  let totalBefore = 0
  let totalAfter = 0

  for (const target of TARGETS) {
    const files = await glob(target.pattern)
    for (const file of files) {
      const stat = await fs.stat(file)
      totalBefore += stat.size

      const inputBuffer = await fs.readFile(file)
      const img = sharp(inputBuffer)
      const metadata = await img.metadata()
      const width = metadata.width ?? 0

      const pipeline =
        width > target.maxWidth
          ? img.resize({ width: target.maxWidth, withoutEnlargement: true })
          : img

      const buffer = await pipeline.jpeg({ quality: target.quality, progressive: true }).toBuffer()
      await fs.writeFile(file, buffer)
      totalAfter += buffer.length

      const saved = inputBuffer.length - buffer.length
      const savedPct = ((saved / inputBuffer.length) * 100).toFixed(1)
      console.log(
        `${path.basename(file)}: ${(inputBuffer.length / 1024).toFixed(1)}KB → ${(buffer.length / 1024).toFixed(1)}KB (${savedPct}% saved)`
      )

    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
