import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CatalogGrid = ({children,}: Props) => {

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-6
      "
    >
      {children}
    </div>
  );
};


export default CatalogGrid;