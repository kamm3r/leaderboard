// TODO:remove this file
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Some = {
  deez: number;
  increase: (by: number) => void;
};

export const useSomeStore = create<Some>()(
  devtools(
    persist(
      (set) => ({
        deez: 0,
        increase: (by) => set((state) => ({ deez: state.deez + by })),
      }),
      {
        name: "deez-storage",
      }
    )
  )
);

type MeetName = {
  meet: string;
  setNewMeetName: (meet: string) => void;
  addMeetName: () => void;
};

export const useMeetNameStore = create<MeetName>()(
  devtools(
    persist(
      (set) => ({
        meet: "Deez Nutz",
        setNewMeetName: (meet) => set((state) => ({ ...state, meet })),
        addMeetName: () => set((state) => ({ ...state, meet: state.meet })),
      }),
      {
        name: "meet-storage",
      }
    )
  )
);
