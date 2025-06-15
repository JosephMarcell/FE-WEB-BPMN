const Footer = () => {
  return (
    <div
      id='footer'
      className='dark:text-white-dark mt-auto p-6 pt-0 text-center ltr:sm:text-left rtl:sm:text-right'
    >
      © {new Date().getFullYear()}. DroneMEQ Team All rights reserved .
    </div>
  );
};

export default Footer;
