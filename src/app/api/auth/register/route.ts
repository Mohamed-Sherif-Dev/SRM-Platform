import { NextRequest }   from "next/server"
import { z }             from "zod"
import bcrypt            from "bcryptjs"
import { prisma }        from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/response"

const schema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message)

    const { name, email, password } = parsed.data
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return errorResponse("Email already registered", 409)

    const hashed = await bcrypt.hash(password, 12)
    const user   = await prisma.user.create({
      data: { name, email, password: hashed, isActive: true },
      select: { id: true, name: true, email: true, role: true }
    })

    return successResponse(user, "Registration successful", 201)
  } catch (err) {
    return errorResponse("Internal server error", 500)
  }
}