import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { Toaster } from "./Sonner";
import { sonnerVariants } from "./sonnerVariants";

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Sonner 기반의 토스트 알림 Playground입니다. 다양한 타입과 기능을 한 번에 테스트할 수 있습니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster
          toastOptions={{
            classNames: {
              toast: sonnerVariants({ type: "default" }),
            },
          }}
        />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {/* 기본 토스트 */}
      <div className="flex gap-3">
        <button
          className="rounded-md border bg-gray-100 px-4 py-2 hover:bg-gray-200"
          onClick={() => toast("기본 토스트 메시지입니다.")}
        >
          기본
        </button>
        <button
          className="rounded-md border bg-green-100 px-4 py-2 hover:bg-green-200"
          onClick={() =>
            toast.success("성공 메시지입니다!", {
              description: new Date().toLocaleString(),
            })
          }
        >
          성공
        </button>
        <button
          className="rounded-md border bg-red-100 px-4 py-2 hover:bg-red-200"
          onClick={() =>
            toast.error("에러 메시지입니다.", {
              description: "문제가 발생했어요.",
            })
          }
        >
          에러
        </button>
        <button
          className="rounded-md border bg-yellow-100 px-4 py-2 hover:bg-yellow-200"
          onClick={() =>
            toast.warning("경고 메시지입니다.", {
              description: "확인해 주세요.",
            })
          }
        >
          경고
        </button>
        <button
          className="rounded-md border bg-blue-100 px-4 py-2 hover:bg-blue-200"
          onClick={() =>
            toast.info("정보 메시지입니다.", {
              description: "참고해 주세요.",
            })
          }
        >
          정보
        </button>
      </div>

      {/* Promise 토스트 */}
      <button
        className="rounded-md border bg-purple-100 px-4 py-2 hover:bg-purple-200"
        onClick={() => {
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: "업로드 중...",
            success: "업로드 완료!",
            error: "업로드 실패",
          });
        }}
      >
        Promise 토스트
      </button>

      {/* 액션 토스트 */}
      <div className="flex gap-3">
        <button
          className="rounded-md border bg-teal-100 px-4 py-2 hover:bg-teal-200"
          onClick={() =>
            toast("액션이 있는 토스트", {
              action: {
                label: "실행",
                onClick: () => console.log("액션 실행됨"),
              },
            })
          }
        >
          액션 토스트
        </button>
        <button
          className="rounded-md border bg-orange-100 px-4 py-2 hover:bg-orange-200"
          onClick={() =>
            toast("취소 가능한 토스트", {
              action: {
                label: "취소",
                onClick: () => console.log("취소됨"),
              },
              duration: Infinity,
            })
          }
        >
          취소 토스트
        </button>
      </div>
    </div>
  ),
};
