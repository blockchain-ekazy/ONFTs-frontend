import { Typography } from "@material-tailwind/react";
const Font_style = { fontFamily: "sans-serif ", fontSize: "17px" };

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 p-6 absolute buttom-0   z-50">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-gray-900 text-center md:justify-between">
        <div className="flex items-center gap-x-2">
          <Typography
            as="p"
            color="white"
            className="font-normal transition-colors focus:text-blue-500"
          >
            <span style={Font_style}> Powered by : </span>
          </Typography>
          <a href="https://www.arden.cc/">
            <img
              src="./assets/imgs/footer_logo.svg"
              alt="logo-ct"
              className="w-25"
            />
          </a>
        </div>
        <Typography color="gray" className="text-center font-normal">
          &copy; 2023 Arden
        </Typography>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8 bg-gray-900">
          <li>
            <Typography
              as="a"
              color="gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Terms
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              color="gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Privacy Policy
            </Typography>
          </li>
        </ul>
      </div>
    </footer>
  );
};
