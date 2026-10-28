import React from "react";

const Spacer = () => (
  <span
    aria-hidden="true"
    className="inline-block w-[2.4em] h-[0.8em] bg-neutral-200 align-middle mx-[0.1em]"
  />
);

const Hero = () => {
  // const BoldHeader =

  return (
    <>
      <div className=" flex justify-center items-center min-h-[80vh]">
        <div aria-label="into">
          <p className="font-author font-medium italic">Riv Salomon</p>
          <p className="font-author font italic">Product Designer</p>
          <br />
          <h1 className="font-author font-light leading-normal italic lg:text-4xl md:text-2xl">
            Hey there! <Spacer /> I’m a minimal Product Designer <br /> and App
            developer based <Spacer /> in sunny <br /> Miami, FL.
          </h1>
        </div>
      </div>
    </>
  );
};

export default Hero;
