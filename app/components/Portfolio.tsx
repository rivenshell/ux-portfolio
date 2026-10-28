import React from "react";

// Placeholder frames. Swap the gray boxes for project images as they're ready.
// Sizes and offsets vary on purpose so the strip doesn't feel like a grid.
// Phones get wide frames so each one holds the screen; md and up uses the
// smaller sizes so several frames show at once.
const works = [
  { title: "Project one", size: "w-[82vw] h-[44vh] md:w-[38vw] md:h-[48vh]", offset: "" },
  { title: "Project two", size: "w-[72vw] h-[38vh] md:w-[32vw] md:h-[44vh]", offset: "translate-y-4" },
  { title: "Project three", size: "w-[68vw] h-[30vh] md:w-[30vw] md:h-[34vh]", offset: "translate-y-12" },
  { title: "Project four", size: "w-[72vw] h-[36vh] md:w-[30vw] md:h-[42vh]", offset: "-translate-y-6" },
];

const Portfolio = () => {
  return (
    <div className="flex h-full shrink-0 items-center gap-8 pl-9 pr-[10vw] md:gap-12 md:pl-12">
      {works.map((work) => (
        <figure key={work.title} className={`shrink-0 ${work.offset}`}>
          <div className={`bg-neutral-200 ${work.size}`} />
          <figcaption className="font-author italic text-sm mt-3">
            {work.title}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default Portfolio;
