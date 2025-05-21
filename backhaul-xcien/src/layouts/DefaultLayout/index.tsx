import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-neutral-100">
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </div>
  );
};

export default DefaultLayout;
