import Conversations from "@/components/chat/Conversations";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex w-full h-full">
        <Conversations />
        {children}
      </div>
    </>
  );
};

export default layout;
