const Footer = () => {
  return (
    <footer className="p-3 h-[75px] bg-white border flex justify-around items-center w-full">
      <div className="w-full">
        <h1>
          Copyright &copy; {new Date().getFullYear()} Ali Shoddiqien. All right
          reserved
        </h1>
      </div>
      <div className="w-full text-end">Version 1.0</div>
    </footer>
  );
};

export default Footer;
