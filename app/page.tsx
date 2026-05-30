import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Visitor Management System</h1>
      <p className="text-center mt-4 text-lg">Please log in to manage your visits and visitors.</p>
      <div className="flex justify-center mt-10">
        <Image src="/welcome.png" alt="Welcome Image" width={400} height={300} />
      </div>
    </div>
  );
}
