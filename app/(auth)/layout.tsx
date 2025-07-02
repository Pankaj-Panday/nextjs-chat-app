export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full">
      <div className="h-screen flex justify-center items-center">{children}</div>
    </section>
  );
}
