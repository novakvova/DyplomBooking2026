import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";


type Position = {
  x: number;
  y: number;
};


type PlaneContextType = {
  startPosition: Position | null;
  setStartPosition: React.Dispatch<
    React.SetStateAction<Position | null>
  >;
};


const PlaneContext = createContext<
  PlaneContextType | null
>(null);



export function PlaneProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [startPosition, setStartPosition] =
    useState<Position | null>(null);


  return (
    <PlaneContext.Provider
      value={{
        startPosition,
        setStartPosition,
      }}
    >
      {children}
    </PlaneContext.Provider>
  );
}

export function usePlane() {
  const context = useContext(PlaneContext);

  if (!context) {
    throw new Error(
      "usePlane must be used inside PlaneProvider"
    );
  }

  return context;
}