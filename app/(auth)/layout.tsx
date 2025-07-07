export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full ">
      <div className="relative h-screen">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:30px_30px]"></div>
        </div>
        {/* Content */}
        <div className="relative h-full flex justify-center items-center ">{children}</div>
      </div>
    </section>
  );
}