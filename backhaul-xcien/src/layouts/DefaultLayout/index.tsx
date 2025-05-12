import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const DefaultLayout: FC<Props> = ({
  children,
}: Props) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-neutral-100">
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;
