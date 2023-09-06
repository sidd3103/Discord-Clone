import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "serverSettings" | "manageMembers" | "createChannel";

interface ModalStore {
  type: ModalType | null;
  data: { server?: Server };
  isOpen: boolean;
  onOpen: (type: ModalType, data?: { server?: Server }) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
