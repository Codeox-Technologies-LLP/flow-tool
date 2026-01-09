import type { GreetingProps } from "@/types/app";

const Greeting = ({ firstName }: GreetingProps) => {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-semibold text-primary mb-1">
        Welcome back, {firstName}
      </h1>
      <p className="text-sm text-secondary">Select a module to get started</p>
    </div>
  );
};

export default Greeting;
