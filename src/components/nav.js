import React from "react";
import { Link } from "gatsby";

const Nav = () => {
  return (
    <div className="relative bg-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 lg:px-8 md:justify-start md:space-x-4">
          <Link
            className="text-4xl font-extrabold tracking-tight text-white sm:text-2xl sm:leading-none md:text-2xl"
            to={`/`}
          >
            viglucci.io
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;
