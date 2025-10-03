import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get a specific remote command
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const commandId = params.id

    const command = await prisma.remoteCommand.findFirst({
      where: {
        id: commandId,
        childProfile: {
          family: {
            OR: [
              { createdBy: user.id },
              { familyMembers: { some: { userId: user.id } } }
            ]
          }
        }
      },
      include: {
        childProfile: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            family: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!command) {
      return NextResponse.json(
        { error: "Command not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ command })
  } catch (error) {
    console.error("Error fetching remote command:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Cancel a remote command
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const commandId = params.id

    // Check if user has access to this command
    const existingCommand = await prisma.remoteCommand.findFirst({
      where: {
        id: commandId,
        childProfile: {
          family: {
            OR: [
              { createdBy: user.id },
              { familyMembers: { some: { userId: user.id, role: 'PARENT' } } }
            ]
          }
        }
      }
    })

    if (!existingCommand) {
      return NextResponse.json(
        { error: "Command not found or access denied" },
        { status: 404 }
      )
    }

    // Can only cancel pending commands
    if (existingCommand.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot cancel command with status: ${existingCommand.status}` },
        { status: 400 }
      )
    }

    // Update command status to cancelled
    const updatedCommand = await prisma.remoteCommand.update({
      where: { id: commandId },
      data: {
        status: 'CANCELLED',
        executedAt: new Date()
      },
      include: {
        childProfile: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json({
      command: updatedCommand,
      message: "Command cancelled successfully"
    })
  } catch (error) {
    console.error("Error cancelling remote command:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a remote command
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const commandId = params.id

    // Check if user has access to this command
    const command = await prisma.remoteCommand.findFirst({
      where: {
        id: commandId,
        childProfile: {
          family: {
            createdBy: user.id
          }
        }
      }
    })

    if (!command) {
      return NextResponse.json(
        { error: "Command not found or access denied" },
        { status: 404 }
      )
    }

    // Delete command
    await prisma.remoteCommand.delete({
      where: { id: commandId }
    })

    return NextResponse.json({ message: "Command deleted successfully" })
  } catch (error) {
    console.error("Error deleting remote command:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

