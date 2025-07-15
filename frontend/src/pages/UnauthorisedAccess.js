import React from "react";
import { Card } from "primereact/card";

const Unauthorized = () => {
  return (
    <div
      className="flex justify-content-center align-items-center bg-gray-100 pt-6 text-center"
    >
      <Card
        title="Access Denied"
        subTitle="Unauthorized Access"
        className="w-full md:w-30rem shadow-4"
      >
        <p className="text-md lg:text-md md:text-md sm:text-base">
          You are not authorised to view this page. Please contact the system administrator at:<br />
          <a href="mailto:m.salini@deakin.edu.au" className="font-semibold" style={{ "color": "var(--dark-green-color)" }}>
            m.salini@deakin.edu.au
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Unauthorized;
