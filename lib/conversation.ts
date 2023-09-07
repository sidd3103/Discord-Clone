import { db } from "./db";

export const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conv = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);
    if (conv) return conv;

    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });
  } catch (error) {
    return null;
  }
};
