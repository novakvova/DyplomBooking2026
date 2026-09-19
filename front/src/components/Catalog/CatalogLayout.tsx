import type { ReactNode } from "react";


interface Props {
  title: string;
  sidebar: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}


const CatalogLayout = ({
  title,
  sidebar,
  toolbar,
  children,
}: Props) => {


  return (
    <main
      className="
        mx-auto
        max-w-[1600px]
        px-6
        pb-14
        lg:px-10
      "
    >
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-[27px]
            font-bold
            text-[#111820]
          "
        >
          {title}
        </h1>
        {toolbar}
      </div>

      <div
        className="
          grid
          gap-10
          lg:grid-cols-[320px_minmax(0,1fr)]
        "
      >

        <aside>
          {sidebar}
        </aside>

        <section>
          {children}
        </section>
      </div>
    </main>
  );

};


export default CatalogLayout;